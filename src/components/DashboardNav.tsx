'use client';

import { SignOutButton } from '@clerk/nextjs';
import { LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserProfileSidebar } from '@/components/UserProfileSidebar';

type DashboardNavProps = {
  userProfileText: string;
  signOutText: string;
};

export function DashboardNav({ userProfileText, signOutText }: DashboardNavProps) {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowProfileSidebar(true)}
        >
          <UserCircle className="mr-2 h-4 w-4" />
          {userProfileText}
        </Button>

        <SignOutButton>
          <Button variant="ghost" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            {signOutText}
          </Button>
        </SignOutButton>
      </div>

      {/* Profile Sidebar */}
      <UserProfileSidebar
        open={showProfileSidebar}
        onOpenChange={setShowProfileSidebar}
      />
    </>
  );
}
