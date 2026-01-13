import qrcode from 'qrcode-terminal';
// WhatsApp client that runs inside Next.js process
import { Client, LocalAuth } from 'whatsapp-web.js';

let client: Client | null = null;
let isReady = false;
let initializationPromise: Promise<Client> | null = null;

export async function getOrCreateWhatsAppClient(): Promise<Client> {
  // If already ready, return immediately
  if (client && isReady) {
    return client;
  }

  // If initialization in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start new initialization
  initializationPromise = new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log('🚀 Initializing WhatsApp client...');

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth',
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    client.on('qr', (qr) => {
      // eslint-disable-next-line no-console
      console.log('📱 QR Code received. Please scan with WhatsApp:');
      qrcode.generate(qr, { small: true });
      // eslint-disable-next-line no-console
      console.log('\n👆 Scan this QR code with your WhatsApp mobile app\n');
    });

    client.on('authenticated', () => {
      // eslint-disable-next-line no-console
      console.log('✅ WhatsApp authenticated');
    });

    client.on('ready', () => {
      // eslint-disable-next-line no-console
      console.log('✅ WhatsApp client is ready!');
      isReady = true;
      resolve(client!);
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failure:', msg);
      isReady = false;
      initializationPromise = null;
      reject(new Error('WhatsApp authentication failed'));
    });

    client.on('disconnected', (reason) => {
      // eslint-disable-next-line no-console
      console.log('⚠️ WhatsApp disconnected:', reason);
      isReady = false;
      client = null;
      initializationPromise = null;
    });

    client.initialize().catch((error) => {
      console.error('❌ Failed to initialize WhatsApp:', error);
      isReady = false;
      initializationPromise = null;
      reject(error);
    });

    // Timeout after 2 minutes
    setTimeout(() => {
      if (!isReady) {
        reject(new Error('WhatsApp initialization timed out'));
      }
    }, 120000);
  });

  return initializationPromise;
}

export function isWhatsAppReady(): boolean {
  return isReady && client !== null;
}

export function getWhatsAppClient(): Client | null {
  return client;
}
