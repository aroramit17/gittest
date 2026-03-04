import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import DashboardShell from './DashboardShell';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch profile for tier + usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier, usage_count')
    .eq('id', user.id)
    .single();

  return (
    <DashboardShell
      email={user.email}
      tier={profile?.tier || 'free'}
      usageCount={profile?.usage_count || 0}
    />
  );
}
