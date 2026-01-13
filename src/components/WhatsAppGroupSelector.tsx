'use client';

import { Loader2, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type WhatsAppGroup = {
  id: string;
  name: string;
};

type WhatsAppGroupSelectorProps = {
  onClose: () => void;
  onSend: (groupName: string) => void;
};

export function WhatsAppGroupSelector({ onClose, onSend }: WhatsAppGroupSelectorProps) {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/whatsapp/groups');
      const data = await response.json();

      if (data.success) {
        setGroups(data.groups);
        // Auto-select first group
        if (data.groups.length > 0) {
          setSelectedGroup(data.groups[0].name);
        }
      } else {
        setError(data.error || 'Failed to load groups');
      }
    } catch {
      setError('Failed to connect to WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSend = () => {
    if (selectedGroup) {
      onSend(selectedGroup);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold text-white">Send to WhatsApp</h2>
        </div>

        {loading
          ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )
          : error
            ? (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Make sure WhatsApp is connected. Run: npm run whatsapp:init
                  </p>
                </div>
              )
            : groups.length === 0
              ? (
                  <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                    <p className="text-sm text-amber-400">No WhatsApp groups found</p>
                    <p className="mt-2 text-xs text-zinc-400">
                      Please add some groups to your WhatsApp account first
                    </p>
                  </div>
                )
              : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="whatsapp-group-select" className="mb-2 block text-sm font-medium text-zinc-300">
                        Select WhatsApp Group
                      </label>
                      <select
                        id="whatsapp-group-select"
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/50 focus:outline-none"
                      >
                        {groups.map(group => (
                          <option key={group.id} value={group.name}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSend}
                        disabled={!selectedGroup}
                        className="flex-1 bg-green-600 hover:bg-green-500"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </>
                )}
      </div>
    </div>
  );
}
