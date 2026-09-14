import { mockUserProfile } from '@/lib/mock/profile';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">User profile</h1>
        <p className="mt-1 text-sm text-stone-600">
          Account details and workspace activity overview.
        </p>
      </div>

      {/* User Information Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0">
            AC
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{mockUserProfile.name}</h2>
            <p className="text-xs text-stone-500">{mockUserProfile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Email Address
            </span>
            <p className="text-stone-900 font-medium text-sm">{mockUserProfile.email}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Member Since
            </span>
            <p className="text-stone-900 font-medium text-sm">{mockUserProfile.joinedDate}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Total Analyses Evaluated
            </span>
            <p className="text-stone-900 font-medium text-sm">{mockUserProfile.totalAnalyses} scans</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Primary Crop Focus
            </span>
            <p className="text-stone-900 font-medium text-sm">{mockUserProfile.primaryCropFocus}</p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 text-xs text-stone-600 leading-relaxed">
        <strong className="text-stone-800">Note:</strong> Profile settings and credentials update functionality will be active following Firebase Authentication integration in a later step.
      </div>
    </div>
  );
}
