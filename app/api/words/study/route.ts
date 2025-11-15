import { NextRequest, NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';

interface StudyWordResponse {
  word: PrismaWord;
  unlearnedCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const favoriteOnly = request.nextUrl.searchParams.get('favoriteOnly') === 'true';
    const excludeIdParam = request.nextUrl.searchParams.get('excludeId');
    const excludeId = excludeIdParam ? Number.parseInt(excludeIdParam, 10) : undefined;

    const excludeCondition = Number.isInteger(excludeId) ? { id: { not: excludeId } } : {};
    const whereClause = {
      ...(favoriteOnly ? { isFavorite: true } : {}),
      ...excludeCondition,
      answers: {
        none: {
          isCorrect: true,
        },
      },
    } as const;

    const totalUnlearned = await prisma.word.count({ where: whereClause });

    if (totalUnlearned > 0) {
      const randomSkip = Math.floor(Math.random() * totalUnlearned);
      const candidates = await prisma.word.findMany({
        where: whereClause,
        skip: randomSkip,
        take: 1,
      });

      if (candidates[0]) {
        return NextResponse.json<ApiResponse<StudyWordResponse>>({
          success: true,
          data: { word: candidates[0], unlearnedCount: totalUnlearned },
        });
      }
    }

    return NextResponse.json<ApiResponse<StudyWordResponse>>(
      { success: false, error: 'No words available for study' },
      { status: 404 },
    );
  } catch (error) {
    console.error('Error fetching study word:', error);
    return NextResponse.json<ApiResponse<StudyWordResponse>>(
      { success: false, error: 'Failed to fetch study word' },
      { status: 500 },
    );
  }
}
