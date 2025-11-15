import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';

interface StatsResponse {
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  totalWords: number;
  learnedWords: number;
  favoriteWords: number;
}

export async function GET() {
  try {
    const [totalAnswers, correctAnswers, totalWords, learnedWords, favoriteWords] = await Promise.all([
      prisma.answer.count(),
      prisma.answer.count({ where: { isCorrect: true } }),
      prisma.word.count(),
      prisma.word.count({
        where: {
          answers: {
            some: {
              isCorrect: true,
            },
          },
        },
      }),
      prisma.word.count({ where: { isFavorite: true } }),
    ]);

    const stats: StatsResponse = {
      totalAnswers,
      correctAnswers,
      accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      totalWords,
      learnedWords,
      favoriteWords,
    };

    return NextResponse.json<ApiResponse<StatsResponse>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json<ApiResponse<StatsResponse>>(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 },
    );
  }
}
