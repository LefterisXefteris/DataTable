import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { setWhatsAppClient, setWhatsAppReady } from './whatsapp-singleton';

let client: Client | null = null;
let isReady = false;

export function initializeWhatsApp() {
  if (client) {
    return client;
  }

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  client.on('qr', (qr) => {
    // eslint-disable-next-line no-console
    console.log('📱 WhatsApp QR Code - Scan with your phone:');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log('✅ WhatsApp is ready!');
    isReady = true;
    setWhatsAppReady(true);
    setWhatsAppClient(client!);
  });

  client.on('authenticated', () => {
    // eslint-disable-next-line no-console
    console.log('✅ WhatsApp authenticated');
  });

  client.on('auth_failure', (msg) => {
    console.error('❌ WhatsApp authentication failed:', msg);
  });

  client.on('disconnected', (reason) => {
    // eslint-disable-next-line no-console
    console.log('❌ WhatsApp disconnected:', reason);
    isReady = false;
    setWhatsAppReady(false);
  });

  client.initialize();
  setWhatsAppClient(client);

  return client;
}

export function getWhatsAppClient() {
  return client;
}

export function isWhatsAppReady() {
  return isReady;
}

export async function sendImageToGroup(
  groupName: string,
  // eslint-disable-next-line node/prefer-global/buffer
  imageBuffer: Buffer,
  caption: string,
) {
  if (!client || !isReady) {
    throw new Error('WhatsApp client is not ready');
  }

  try {
    // Get all chats
    const chats = await client.getChats();

    // Find the group by name
    const targetGroup = chats.find(
      chat => chat.isGroup && chat.name.toLowerCase().includes(groupName.toLowerCase()),
    );

    if (!targetGroup) {
      throw new Error(`Group "${groupName}" not found`);
    }

    // Send image with caption
    const media = new (await import('whatsapp-web.js')).MessageMedia(
      'image/png',
      imageBuffer.toString('base64'),
      'staff-rota.png',
    );

    await targetGroup.sendMessage(media, { caption });

    return { success: true, groupId: targetGroup.id._serialized };
  } catch (error) {
    console.error('Error sending image to group:', error);
    throw error;
  }
}

export async function listGroups() {
  if (!client || !isReady) {
    throw new Error('WhatsApp client is not ready');
  }

  const chats = await client.getChats();
  const groups = chats.filter(chat => chat.isGroup);

  return groups.map(group => ({
    id: group.id._serialized,
    name: group.name,
  }));
}
