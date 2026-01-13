import { NextResponse } from 'next/server';
import { getWhatsAppClient, isWhatsAppClientReady } from '@/lib/whatsapp-singleton';

export async function POST(request: Request) {
  try {
    const { groupName, imageUrl } = await request.json();

    if (!groupName) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 },
      );
    }

    // Check if WhatsApp is ready
    if (!isWhatsAppClientReady()) {
      return NextResponse.json(
        { error: 'WhatsApp is not connected. Please run: npm run whatsapp:init' },
        { status: 503 },
      );
    }

    const client = getWhatsAppClient();
    if (!client) {
      return NextResponse.json(
        { error: 'WhatsApp client not initialized' },
        { status: 503 },
      );
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/staff-rota/generate-image`);

    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image');
    }

    // eslint-disable-next-line node/prefer-global/buffer
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Get all chats and find the group
    const chats = await client.getChats();
    const targetGroup = chats.find(
      chat => chat.isGroup && chat.name.toLowerCase().includes(groupName.toLowerCase()),
    );

    if (!targetGroup) {
      return NextResponse.json(
        { error: `Group "${groupName}" not found. Available groups: ${chats.filter(c => c.isGroup).map(c => c.name).join(', ')}` },
        { status: 404 },
      );
    }

    // Send image with caption
    const { MessageMedia } = await import('whatsapp-web.js');
    const media = new MessageMedia(
      'image/png',
      imageBuffer.toString('base64'),
      'staff-rota.png',
    );

    await targetGroup.sendMessage(media, {
      caption: `📅 Staff Rota Schedule\n\nGenerated: ${new Date().toLocaleString()}\n\n✨ Stay updated with the latest shifts!`,
    });

    return NextResponse.json({
      success: true,
      message: 'Staff rota sent to WhatsApp group successfully',
      groupId: targetGroup.id._serialized,
      groupName: targetGroup.name,
    });
  } catch (error) {
    console.error('Error sending to WhatsApp:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send to WhatsApp' },
      { status: 500 },
    );
  }
}
