import { NextRequest, NextResponse } from 'next/server';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../lib/prisma';
import { ApiResponse } from '../../../lib/api-response';
import type { CreateWordRequest } from '../../../types';

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse<PrismaWord[]>>({
      success: true,
      data: words,
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json<ApiResponse<PrismaWord[]>>(
      {
        success: false,
        error: 'Failed to fetch words',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CreateWordRequest> | null;

    if (!body?.english || !body?.russian || !body?.exampleEn || !body?.exampleRu) {
      return NextResponse.json<ApiResponse<PrismaWord>>(
        {
          success: false,
          error: 'All fields are required',
        },
        { status: 400 },
      );
    }

    const word = await prisma.word.create({
      data: {
        english: body.english.toLowerCase().trim(),
        russian: body.russian.trim(),
        exampleEn: body.exampleEn.trim(),
        exampleRu: body.exampleRu.trim(),
      },
    });

    return NextResponse.json<ApiResponse<PrismaWord>>({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error('Error creating word:', error);
    return NextResponse.json<ApiResponse<PrismaWord>>(
      {
        success: false,
        error: 'Failed to create word',
      },
      { status: 500 },
    );
  }
}
