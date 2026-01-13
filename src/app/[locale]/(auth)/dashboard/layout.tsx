import { Database } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

import { DashboardNav } from '@/components/DashboardNav';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'DashboardLayout',
  });

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-3 shadow-md md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard/" className="mr-6 flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative">
              <Database className="h-7 w-7 text-red-500" strokeWidth={2.5} />
              <div className="absolute inset-0 animate-pulse bg-red-500/20 blur-md" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                DataTable
              </span>
              <span className="text-[0.6rem] font-medium tracking-wider text-zinc-500">
                SMART SHEETS
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <DashboardNav
            userProfileText={t('user_profile_link')}
            signOutText={t('sign_out')}
          />
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1 overflow-hidden">
        {props.children}
      </main>
    </div>
  );
}
