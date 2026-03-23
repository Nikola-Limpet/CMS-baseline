import { AuthImagePanel } from '@/components/auth/AuthImagePanel';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 pt-14 sm:pt-16 lg:grid-cols-2">
      <AuthImagePanel />
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
