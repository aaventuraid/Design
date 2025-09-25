import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as string; // 'logo' atau 'icon'

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 });
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.'
      }, { status: 400 });
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan folder dan nama file
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`;
    const filePath = join(uploadDir, fileName);

    // Buat direktori jika belum ada
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Simpan file
    await writeFile(filePath, buffer);

    // Return URL relatif
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}