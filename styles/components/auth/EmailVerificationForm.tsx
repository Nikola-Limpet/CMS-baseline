'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';

interface EmailVerificationFormProps {
  onBack: () => void;
}

export function EmailVerificationForm({ onBack }: EmailVerificationFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Check your email
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We sent a verification link to your email address. Click the link to verify your account.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 py-6">
        <div className="h-16 w-16 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900/30 flex items-center justify-center">
          <Mail className="h-8 w-8 text-brand-blue-600" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Didn&apos;t receive the email? Check your spam folder or try signing up again.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
