import { NextRequest, NextResponse } from 'next/server';
import type { Answer as PrismaAnswer } from '@prisma/client';

import prisma from '../../../../../lib/prisma';
import { ApiResponse } from '../../../../../lib/api-response';

interface RouteContext {
  params: {
    wordId: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const wordId = Number.parseInt(params.wordId, 10);

    if (Number.isNaN(wordId)) {
      return NextResponse.json<ApiResponse<PrismaAnswer[]>>(
        { success: false, error: 'Invalid word id' },
        { status: 400 },
      );
    }

    const answers = await prisma.answer.findMany({
      where: { wordId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse<PrismaAnswer[]>>({
      success: true,
      data: answers,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json<ApiResponse<PrismaAnswer[]>>(
      { success: false, error: 'Failed to fetch answers' },
      { status: 500 },
    );
  }
}
