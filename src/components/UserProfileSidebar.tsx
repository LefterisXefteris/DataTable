'use client';

import { SignOutButton, useUser } from '@clerk/nextjs';
import { Calendar, LogOut, Mail, Settings, Shield, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type UserProfileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserProfileSidebar({ open, onOpenChange }: UserProfileSidebarProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const getInitials = () => {
    if (!user) {
      return '??';
    }
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || '?';
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) {
      return 'N/A';
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] overflow-y-auto border-zinc-800 bg-zinc-900 sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-2xl font-bold text-zinc-100">Profile</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Manage your account information and preferences
          </SheetDescription>
        </SheetHeader>

        {/* User Avatar and Basic Info */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-2xl font-bold text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-red-500/20 blur-xl" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-zinc-100">
              {user?.fullName || 'Anonymous User'}
            </h3>
            <p className="text-sm text-zinc-400">
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800" />

        {/* Account Details */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Account Details
          </h4>

          <div className="space-y-4">
            {/* User ID */}
            <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800">
              <User className="mt-0.5 h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">User ID</p>
                <p className="mt-1 font-mono text-xs break-all text-zinc-300">
                  {user?.id || 'N/A'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800">
              <Mail className="mt-0.5 h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Email Address</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {user?.primaryEmailAddress?.emailAddress || 'N/A'}
                </p>
                {user?.primaryEmailAddress?.verification?.status && (
                  <div className="mt-2 flex items-center gap-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800">
              <Calendar className="mt-0.5 h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Member Since</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>

            {/* Last Sign In */}
            <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4 transition-colors hover:bg-zinc-800">
              <Calendar className="mt-0.5 h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-400">Last Sign In</p>
                <p className="mt-1 text-sm text-zinc-300">
                  {formatDate(user?.lastSignInAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800" />

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
            Quick Actions
          </h4>

          <Button
            variant="outline"
            className="w-full justify-start border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => {
              // Navigate to settings or open settings modal
              window.location.href = '/dashboard/user-profile';
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>

          <SignOutButton>
            <Button
              variant="outline"
              className="w-full justify-start border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-800/30 p-4">
          <p className="text-center text-xs text-zinc-500">
            Secured by
            {' '}
            <span className="font-semibold text-zinc-400">DataTable</span>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
