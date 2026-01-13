import { NextResponse } from 'next/server';
import { getWhatsAppClient, isWhatsAppReady } from '@/lib/whatsapp-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!isWhatsAppReady()) {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp is not connected. Please initialize WhatsApp first.',
          groups: [],
        },
        { status: 503 },
      );
    }

    const client = getWhatsAppClient();
    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp client not available',
          groups: [],
        },
        { status: 503 },
      );
    }

    const chats = await client.getChats();
    const groups = chats
      .filter(chat => chat.isGroup)
      .map(group => ({
        id: group.id._serialized,
        name: group.name,
      }));

    return NextResponse.json({
      success: true,
      groups,
    });
  } catch (error) {
    console.error('Error fetching WhatsApp groups:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch groups',
        groups: [],
      },
      { status: 500 },
    );
  }
}
