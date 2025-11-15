import { NextRequest, NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../../../lib/prisma';
import { ApiResponse } from '../../../../../lib/api-response';

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wordId = Number.parseInt(id, 10);

    if (Number.isNaN(wordId)) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        { success: false, error: 'Invalid word id' },
        { status: 400 },
      );
    }

    const currentWord = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!currentWord) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        { success: false, error: 'Word not found' },
        { status: 404 },
      );
    }

    const word = await prisma.word.update({
      where: { id: wordId },
      data: { isFavorite: !currentWord.isFavorite },
    });

    return NextResponse.json<ApiResponse<PrismaWord>>({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json<ApiResponse<PrismaWord>>(
      { success: false, error: 'Failed to toggle favorite' },
      { status: 500 },
    );
  }
}
