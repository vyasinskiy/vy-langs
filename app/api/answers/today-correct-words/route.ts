import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';

interface TodayCorrectWord {
  english: string;
  russian: string;
  exampleEn: string;
  exampleRu: string;
}

export async function GET() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const answers = await prisma.answer.findMany({
      where: {
        isCorrect: true,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        word: true,
      },
    });

    const uniqueWords = new Map<number, TodayCorrectWord>();

    answers.forEach((answer) => {
      if (answer.word) {
        uniqueWords.set(answer.word.id, {
          english: answer.word.english,
          russian: answer.word.russian,
          exampleEn: answer.word.exampleEn,
          exampleRu: answer.word.exampleRu,
        });
      }
    });

    return NextResponse.json<ApiResponse<TodayCorrectWord[]>>({
      success: true,
      data: Array.from(uniqueWords.values()),
    });
  } catch (error) {
    console.error('Error fetching today correct words:', error);
    return NextResponse.json<ApiResponse<TodayCorrectWord[]>>(
      { success: false, error: 'Failed to fetch today correct words' },
      { status: 500 },
    );
  }
}
