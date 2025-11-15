import { NextRequest, NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../../lib/prisma';
import { ApiResponse } from '../../../../lib/api-response';
import type { UpdateWordRequest } from '../../../../types';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wordId = Number.parseInt(id, 10);

    if (Number.isNaN(wordId)) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        { success: false, error: 'Invalid word id' },
        { status: 400 },
      );
    }

    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        { success: false, error: 'Word not found' },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse<PrismaWord>>({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error('Error fetching word:', error);
    return NextResponse.json<ApiResponse<PrismaWord>>(
      { success: false, error: 'Failed to fetch word' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wordId = Number.parseInt(id, 10);

    if (Number.isNaN(wordId)) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        { success: false, error: 'Invalid word id' },
        { status: 400 },
      );
    }

    const updateData = (await request.json()) as UpdateWordRequest;

    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined && value !== null),
    ) as UpdateWordRequest;

    if (cleanData.english) {
      cleanData.english = cleanData.english.toLowerCase().trim();
    }

    const word = await prisma.word.update({
      where: { id: wordId },
      data: cleanData,
    });

    return NextResponse.json<ApiResponse<PrismaWord>>({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error('Error updating word:', error);
    return NextResponse.json<ApiResponse<PrismaWord>>(
      { success: false, error: 'Failed to update word' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const wordId = Number.parseInt(id, 10);

    if (Number.isNaN(wordId)) {
      return NextResponse.json<ApiResponse<Record<string, never>>>(
        { success: false, error: 'Invalid word id' },
        { status: 400 },
      );
    }

    await prisma.word.delete({
      where: { id: wordId },
    });

    return NextResponse.json<ApiResponse<Record<string, never>>>({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting word:', error);
    return NextResponse.json<ApiResponse<Record<string, never>>>(
      { success: false, error: 'Failed to delete word' },
      { status: 500 },
    );
  }
}
