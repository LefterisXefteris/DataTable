import { NextResponse } from 'next/server';
import { getOrCreateWhatsAppClient, isWhatsAppReady } from '@/lib/whatsapp-client';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 2 minutes timeout

export async function POST() {
  try {
    if (isWhatsAppReady()) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp is already connected',
        ready: true,
      });
    }

    // Initialize WhatsApp client
    await getOrCreateWhatsAppClient();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp connected successfully',
      ready: true,
    });
  } catch (error) {
    console.error('WhatsApp initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize WhatsApp',
        ready: false,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    ready: isWhatsAppReady(),
    message: isWhatsAppReady() ? 'WhatsApp is connected' : 'WhatsApp is not connected',
  });
}
