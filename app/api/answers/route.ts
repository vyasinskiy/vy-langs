import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../../lib/prisma';
import { ApiResponse } from '../../../lib/api-response';

interface ClearAnswersResponse {
  deletedCount: number;
}

export async function DELETE(_request: NextRequest) {
  try {
    const result = await prisma.answer.deleteMany();

    return NextResponse.json<ApiResponse<ClearAnswersResponse>>({
      success: true,
      data: { deletedCount: result.count },
    });
  } catch (error) {
    console.error('Error clearing answers:', error);
    return NextResponse.json<ApiResponse<ClearAnswersResponse>>(
      { success: false, error: 'Failed to clear answers' },
      { status: 500 },
    );
  }
}
