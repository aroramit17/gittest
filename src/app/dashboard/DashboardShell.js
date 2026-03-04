'use client';

import { useState, useEffect } from 'react';
import { useEnhance } from '@/context/EnhanceContext';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import EffectsGrid from '@/components/EffectsGrid';
import EnhanceModal from '@/components/EnhanceModal';

export default function DashboardShell({ email, tier, usageCount }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setUserProfile } = useEnhance();

  // Sync server-fetched profile into client context
  useEffect(() => {
    setUserProfile({ tier, usage_count: usageCount });
  }, [tier, usageCount, setUserProfile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        email={email}
        tier={tier}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          tier={tier}
        />
        <EffectsGrid tier={tier} />
      </div>
      <EnhanceModal />
    </div>
  );
}
