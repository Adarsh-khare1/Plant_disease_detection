'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 text-center">
            <h1 className="font-serif text-2xl font-bold text-stone-900">Reset your password</h1>
            <p className="text-xs text-stone-600">
              Enter your account email address to receive password reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-stone-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Prototype Banner */}
            <div className="p-3 bg-stone-100 border border-stone-200 rounded text-[11px] text-stone-600">
              <strong>UI Prototype Note:</strong> Password reset email dispatch via Firebase Auth will be wired in a subsequent step.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded transition-colors"
            >
              Send reset link
            </button>
          </form>

          <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-100">
            Remembered your password?{' '}
            <Link href="/login" className="text-emerald-800 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
