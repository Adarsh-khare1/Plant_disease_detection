'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Application settings</h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage workspace presentation preferences.
        </p>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4 shadow-xs">
        <h2 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
          Account Preferences
        </h2>
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-800">Interface Theme</p>
              <p className="text-stone-500">Select application visual presentation mode.</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="light">Light Mode (Default)</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Image Handling Section */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-3 shadow-xs">
        <h2 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
          Image Privacy Information
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Uploaded plant foliage images are processed strictly for quality validation and hierarchical ML classification in this prototype system.
        </p>
      </div>

      {/* Prototype Notice */}
      <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 text-xs text-stone-600 leading-relaxed">
        <strong className="text-stone-800">UI Prototype Note:</strong> Settings persistence and preference syncing will be connected to user profiles during backend integration.
      </div>
    </div>
  );
}
