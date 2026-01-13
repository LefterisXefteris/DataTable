// Singleton pattern for WhatsApp client to share across API routes
import type { Client } from 'whatsapp-web.js';

let clientInstance: Client | null = null;
let isClientReady = false;

export function setWhatsAppClient(client: Client) {
  clientInstance = client;
}

export function setWhatsAppReady(ready: boolean) {
  isClientReady = ready;
}

export function getWhatsAppClient(): Client | null {
  return clientInstance;
}

export function isWhatsAppClientReady(): boolean {
  return isClientReady && clientInstance !== null;
}
