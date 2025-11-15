import { NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      where: { isFavorite: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse<PrismaWord[]>>({
      success: true,
      data: words,
    });
  } catch (error) {
    console.error('Error fetching favorite words:', error);
    return NextResponse.json<ApiResponse<PrismaWord[]>>(
      { success: false, error: 'Failed to fetch favorite words' },
      { status: 500 },
    );
  }
}
