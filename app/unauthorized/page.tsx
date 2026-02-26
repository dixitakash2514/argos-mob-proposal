import { SignOutButton } from '@clerk/nextjs';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-red-400 text-2xl">✕</span>
        </div>
        <h1 className="text-white text-xl font-bold mb-3">Access Denied</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Your account is not authorised to use this tool.
          Contact your administrator to request access.
        </p>
        <SignOutButton redirectUrl="/sign-in">
          <button className="bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
