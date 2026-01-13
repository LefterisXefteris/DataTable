# Deployment Guide - DataTable SaaS

## Pre-Deployment Checklist

### ✅ Build Status
- [x] Production build passes (`npm run build`)
- [x] TypeScript compilation succeeds
- [x] No ESLint errors

### ✅ Core Features Working
- [x] **Inventory Management** - Track stock and supplies
- [x] **Staff Rota** - Employee scheduling with shifts
- [x] **Bookings System** - Customer reservations with day-by-day pagination (4 months of data)
- [x] **WhatsApp Integration** - Send staff rota to WhatsApp groups
- [x] **User Authentication** - Clerk-powered sign in/up
- [x] **User Profile Sidebar** - Beautiful profile management
- [x] **Excel Export** - Export data to spreadsheets
- [x] **Real-time Editing** - Lock/unlock, auto-save changes
- [x] **Core Sheets Protection** - Cannot delete essential hospitality sheets

## Environment Variables Required

Copy `.env.example` to `.env` and fill in:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# PostHog Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Next.js
NEXT_TELEMETRY_DISABLED=1
```

## Deployment Platforms

### Recommended: Vercel (Easiest)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables from `.env`
   - Click "Deploy"

3. **Post-Deployment**
   - Add your Vercel domain to Clerk allowed domains
   - Test all features in production

### Alternative: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Add all variables from `.env.example`

## Database Setup (Production)

Your Neon PostgreSQL database is already configured. For production:

1. **Database Migrations**
   - Migrations run automatically during build: `npm run db:migrate`
   - Drizzle ORM handles all schema changes

2. **Seed Data** (Optional for demo)
   ```bash
   npm run seed:bookings  # Adds 4 months of booking data
   npm run seed:staff     # Adds sample staff rota
   ```

## Domain Setup

1. **Add Custom Domain** (Optional)
   - In Vercel: Settings → Domains
   - Add your domain (e.g., `app.yourhospitality.com`)
   - Configure DNS as instructed

2. **Update Clerk Settings**
   - Go to Clerk Dashboard
   - Add production domain to allowed domains
   - Update redirect URLs

## WhatsApp Setup (For Clients)

WhatsApp integration requires initial QR code scan:

1. **First Time Setup**
   ```bash
   npm run whatsapp:init
   ```

2. **Scan QR Code** with WhatsApp mobile app
   - Opens camera in WhatsApp
   - Scan the QR code in terminal
   - Session persists in `.wwebjs_auth` folder

3. **Production Note**
   - WhatsApp session stored in `.wwebjs_auth/`
   - Session persists across deployments
   - Re-scan only if session expires

## Security Considerations

### ✅ Already Implemented
- Environment variables for secrets
- Clerk authentication with middleware
- PostgreSQL with SSL (Neon)
- Input validation on all forms
- CORS protection
- No sensitive data in frontend

### ⚠️ Before Going Live
- [ ] Add rate limiting (optional)
- [ ] Configure CSP headers (optional)
- [ ] Set up error monitoring (Sentry recommended)

## Performance Optimizations

### ✅ Already Optimized
- Next.js 16 with Turbopack
- Static page generation for public pages
- Image optimization with Next.js Image
- Database indexes on frequently queried columns
- Client-side caching for bookings data

## Testing for Client Demos

### Prepare Demo Data
```bash
# Generate realistic demo data
npm run seed:bookings  # 676 bookings over 4 months
npm run seed:staff     # 8 staff members with shifts
```

### Demo Flow
1. **Show Authentication** - Sign up/sign in with Clerk
2. **Inventory Sheet** - Add/edit/delete items, show auto-save
3. **Staff Rota Sheet** - Show employee scheduling, WhatsApp integration
4. **Bookings Sheet** - Navigate days, show pagination, CRUD operations
5. **Protected Sheets** - Try deleting a core sheet (shows protection)
6. **User Profile** - Click profile, show beautiful sidebar
7. **Export** - Export any sheet to Excel

## Known Limitations

1. **WhatsApp Integration**
   - Uses unofficial WhatsApp Web API (whatsapp-web.js)
   - Free but may have rate limits
   - For production at scale, consider official WhatsApp Business API

2. **Real-time Collaboration**
   - Not yet implemented
   - Users work on their own data
   - Can be added with Socket.io or Pusher

## Support & Maintenance

### Monitoring
- Check Vercel Analytics for traffic
- Monitor Clerk Dashboard for auth metrics
- Review Neon dashboard for database performance

### Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit fix

# Rebuild
npm run build
```

## Client Presentation Tips

1. **Emphasize Core Value**
   - "All-in-one hospitality management"
   - "Inventory, Staff, and Bookings in one place"
   - "WhatsApp integration for instant communication"

2. **Highlight Unique Features**
   - Day-by-day booking pagination (unique!)
   - Protected core sheets (reliability)
   - Beautiful modern UI with neon effects
   - Real-time saving with visual feedback

3. **Demo Script**
   - Start with bookings (most impressive)
   - Show 4 months of data navigation
   - Demo WhatsApp sending from staff rota
   - Show Excel export
   - End with protected sheets (security)

## Production Deployment Status

🟢 **READY FOR DEPLOYMENT**

Your project is production-ready and can be shown to clients immediately. All core features work, build succeeds, and the UI is polished.

## Quick Deploy Command

```bash
# Build and verify
npm run build

# Deploy to Vercel (if CLI installed)
vercel --prod

# Or push to GitHub and deploy via Vercel dashboard
git push origin main
```

---

**Questions?** Check the main README.md or reach out for support.
