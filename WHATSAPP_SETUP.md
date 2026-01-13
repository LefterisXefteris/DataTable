# WhatsApp Integration Setup Guide

This guide will help you set up the WhatsApp integration to send staff rota schedules to WhatsApp groups.

## Overview

The system uses **whatsapp-web.js** to connect to WhatsApp and send staff rota images automatically.

## Quick Start

### Step 1: Initialize WhatsApp Connection

Run this command in a **separate terminal**:

```bash
npm run whatsapp:init
```

This will:
1. Start the WhatsApp client
2. Display a QR code in your terminal
3. Keep running in the background

### Step 2: Scan QR Code

1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices** → **Link a Device**
3. Scan the QR code shown in your terminal

You'll see: `✅ WhatsApp is ready!` when connected

### Step 3: Start Your Next.js App

In another terminal, run:

```bash
npm run dev
```

### Step 4: Send Staff Rota to WhatsApp

1. Go to your dashboard: `http://localhost:3000/dashboard`
2. Click on the **"Staff Rota"** tab
3. Click the green **"WhatsApp"** button
4. Enter the name of your WhatsApp group (e.g., "Staff Team" or "Work Group")
5. The staff rota image will be sent!

## How It Works

### 1. **Image Generation**
- The system captures the staff rota table as a beautiful PNG image
- Uses Puppeteer to render HTML/CSS
- Includes company branding and formatted dates

### 2. **WhatsApp Connection**
- Uses `whatsapp-web.js` to connect to your WhatsApp account
- Maintains a persistent session (you only need to scan QR once)
- Session data is saved in `.wwebjs_auth/`

### 3. **Sending Process**
- Searches for the WhatsApp group by name
- Sends the generated image with a caption
- Shows success/error message

## API Endpoints

### Generate Staff Rota Image
```
GET /api/staff-rota/generate-image
```
Returns a PNG image of the current staff rota.

### Send to WhatsApp
```
POST /api/staff-rota/send-whatsapp
Body: { groupName: "Your Group Name" }
```
Sends the staff rota image to the specified WhatsApp group.

### List WhatsApp Groups
```
GET /api/whatsapp/groups
```
Returns all available WhatsApp groups.

## Troubleshooting

### QR Code Not Showing
- Make sure you're running `npm run whatsapp:init`
- Check if port 3000 is available
- Try restarting the WhatsApp init script

### "WhatsApp is not ready" Error
1. Make sure `npm run whatsapp:init` is running
2. Wait for "✅ WhatsApp is ready!" message
3. Refresh your browser

### Group Not Found
- Check the group name spelling (it's case-insensitive but must match partially)
- List all groups: `GET /api/whatsapp/groups`
- Make sure you're in the group on WhatsApp

### Session Expired
- Delete the `.wwebjs_auth/` folder
- Run `npm run whatsapp:init` again
- Scan the new QR code

## Advanced Usage

### Customize the Image Template

Edit `/src/app/api/staff-rota/generate-image/route.ts`:
- Change colors, fonts, styles
- Add company logo
- Modify table layout

### Schedule Automatic Sending

Use a cron job or task scheduler:

```typescript
// Example: Send every Monday at 9 AM
import cron from 'node-cron';

cron.schedule('0 9 * * 1', async () => {
  await fetch('http://localhost:3000/api/staff-rota/send-whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupName: 'Staff Team' })
  });
});
```

## Production Deployment

For production, consider:

1. **Use PM2** to keep WhatsApp running:
   ```bash
   pm2 start npm --name "whatsapp" -- run whatsapp:init
   ```

2. **Add Health Checks**:
   - Monitor WhatsApp connection status
   - Auto-restart if disconnected

3. **Secure the API**:
   - Add authentication to API routes
   - Validate group names
   - Rate limit requests

## Cost

- ✅ **100% FREE** for prototyping
- ✅ No API costs
- ✅ Uses your regular WhatsApp account
- ⚠️ Against WhatsApp ToS (use at your own risk)

## Migrating to Official API

When ready for production, migrate to **WhatsApp Business Cloud API**:
1. Sign up at https://developers.facebook.com
2. Create a Business App
3. Get WhatsApp Business API access
4. Replace whatsapp-web.js with official API calls

## Support

- WhatsApp Web.js Docs: https://wwebjs.dev/
- Issue Tracker: Create an issue in your repo

---

**Note**: This integration is for prototyping. For production, use the official WhatsApp Business API.
