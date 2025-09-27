import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Authentication middleware
async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return null;
    }
    
    return user;
  } catch {
    return null;
  }
}

// Schema untuk validasi input
const SiteContentSchema = z.object({
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
  valueType: z.enum(['TEXT', 'HTML', 'URL', 'IMAGE', 'JSON']).default('TEXT'),
  label: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  sortOrder: z.number().optional(),
});

const UpdateContentSchema = z.object({
  value: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
});

// GET - Ambil semua content atau berdasarkan section
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (section) where.section = section;
    if (category) where.category = category;

        const contents = await prisma.siteContent.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { section: 'asc' },
        { key: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content'
    }, { status: 500 });
  }
}

// POST - Buat content baru
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = SiteContentSchema.parse(body);

    const content = await prisma.siteContent.create({
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Error creating site content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create content'
    }, { status: 500 });
  }
}

// PUT - Update content berdasarkan section dan key
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const key = searchParams.get('key');

    if (!section || !key) {
      return NextResponse.json({
        success: false,
        error: 'Section and key are required'
      }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = UpdateContentSchema.parse(body);

    const content = await prisma.siteContent.update({
      where: {
        section_key: {
          section,
          key
        }
      },
      data: validatedData
    });

    return NextResponse.json({
      success: true,
      data: content
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data',
        details: error.errors
      }, { status: 400 });
    }

    console.error('Error updating site content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update content'
    }, { status: 500 });
  }
}

// DELETE - Hapus content
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await authenticateAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const key = searchParams.get('key');

    if (!section || !key) {
      return NextResponse.json({
        success: false,
        error: 'Section and key are required'
      }, { status: 400 });
    }

    await prisma.siteContent.delete({
      where: {
        section_key: {
          section,
          key
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting site content:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete content'
    }, { status: 500 });
  }
}