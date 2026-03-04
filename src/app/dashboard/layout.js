import { EnhanceProvider } from '@/context/EnhanceContext';

export const metadata = {
  title: 'Dashboard — ZenEnhance',
};

export default function DashboardLayout({ children }) {
  return (
    <EnhanceProvider>
      {children}
    </EnhanceProvider>
  );
}
