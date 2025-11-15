import { NextRequest, NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';
import type { CheckAnswerRequest, CheckAnswerResponse } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckAnswerRequest;

    if (!body?.wordId || !body?.answer) {
      return NextResponse.json<ApiResponse<CheckAnswerResponse>>(
        { success: false, error: 'Word ID and answer are required' },
        { status: 400 },
      );
    }

    const word = await prisma.word.findUnique({
      where: { id: body.wordId },
    });

    if (!word) {
      return NextResponse.json<ApiResponse<CheckAnswerResponse>>(
        { success: false, error: 'Word not found' },
        { status: 404 },
      );
    }

    const userAnswer = body.answer.toLowerCase().trim();
    const correctAnswer = word.english.toLowerCase().trim();

    const isCorrect = userAnswer === correctAnswer;

    let isSynonym = false;
    let synonymWord: PrismaWord | null = null;

    if (!isCorrect) {
      synonymWord = await prisma.word.findFirst({
        where: {
          russian: word.russian,
          english: userAnswer,
        },
      });
      isSynonym = Boolean(synonymWord);
    }

    let isPartial = false;
    let hint: string | undefined;

    if (!isCorrect && !isSynonym && userAnswer.length > 0) {
      if (correctAnswer.startsWith(userAnswer)) {
        isPartial = true;
        hint = `Correct! Continue... (${correctAnswer.length - userAnswer.length} letters left)`;
      } else if (correctAnswer.includes(userAnswer)) {
        isPartial = true;
        hint = 'Partially correct! Try again!';
      } else if (levenshteinDistance(userAnswer, correctAnswer) <= 2) {
        isPartial = true;
        hint = 'Very close! Check your answer';
      }
    }

    await prisma.answer.create({
      data: {
        wordId: body.wordId,
        answer: userAnswer,
        isCorrect,
        isSynonym,
      },
    });

    if (isSynonym && synonymWord) {
      const existingCorrect = await prisma.answer.findFirst({
        where: { wordId: synonymWord.id, isCorrect: true },
      });
      if (!existingCorrect) {
        await prisma.answer.create({
          data: {
            wordId: synonymWord.id,
            answer: userAnswer,
            isCorrect: true,
          },
        });
      }
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayCorrectAnswers = await prisma.answer.count({
      where: {
        isCorrect: true,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalCorrectAnswers = await prisma.answer.count({
      where: { isCorrect: true },
    });

    const totalWords = await prisma.word.count();

    const response: CheckAnswerResponse = {
      isCorrect,
      isPartial,
      hint: isSynonym ? 'This is synonym. Try another word.' : hint,
      isSynonym: isSynonym || undefined,
      correctAnswer: word.english,
      todayCorrectAnswers,
      totalCorrectAnswers,
      totalWords,
    };

    return NextResponse.json<ApiResponse<CheckAnswerResponse>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json<ApiResponse<CheckAnswerResponse>>(
      { success: false, error: 'Failed to check answer' },
      { status: 500 },
    );
  }
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = Array.from({ length: str2.length + 1 }, () =>
    Array(str1.length + 1).fill(0),
  );

  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }

  return matrix[str2.length][str1.length];
}
