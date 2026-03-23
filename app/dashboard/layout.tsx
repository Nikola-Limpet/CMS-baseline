"use client";

import { ReactNode } from 'react';
import DashboardLayout from './DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
