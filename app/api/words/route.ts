import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { Word as PrismaWord } from '@prisma/client';

import prisma from '../../../lib/prisma';
import { ApiResponse } from '../../../lib/api-response';
import type { CreateWordRequest } from '../../../types';

interface PaginatedWords {
  items: PrismaWord[];
  total: number;
  page: number;
  pageSize: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const pageParam = Number(searchParams.get('page'));
    const pageSizeParam = Number(searchParams.get('pageSize'));

    const pageSize = Math.min(Math.max(Number.isFinite(pageSizeParam) ? pageSizeParam : 10, 1), 100);
    const requestedPage = Math.max(0, Number.isFinite(pageParam) ? pageParam : 0);

    const where: Prisma.WordWhereInput | undefined = search
      ? {
          OR: [
            { english: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { russian: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { exampleEn: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { exampleRu: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : undefined;

    const total = await prisma.word.count({ where });
    const maxPage = total === 0 ? 0 : Math.max(0, Math.ceil(total / pageSize) - 1);
    const page = Math.min(requestedPage, maxPage);

    const words = await prisma.word.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: page * pageSize,
      take: pageSize,
    });

    return NextResponse.json<ApiResponse<PaginatedWords>>({
      success: true,
      data: {
        items: words,
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json<ApiResponse<PaginatedWords>>(
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
