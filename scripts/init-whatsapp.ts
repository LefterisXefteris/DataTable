import { initializeWhatsApp } from '../src/lib/whatsapp-service';

console.log('🚀 Initializing WhatsApp...');
console.log('📱 Please scan the QR code with your WhatsApp mobile app\n');

initializeWhatsApp();

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down WhatsApp service...');
  process.exit(0);
});
