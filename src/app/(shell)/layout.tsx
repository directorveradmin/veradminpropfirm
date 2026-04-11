import type { ReactNode } from 'react';
import { AppShell } from '@/lib/ui/appShell';

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}