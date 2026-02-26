import { Suspense } from 'react';
import { PreviewClient } from './PreviewClient';

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#0B1220]">
        <div className="w-10 h-10 bg-[#E85D2B] rounded-full animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xs">AM</span>
        </div>
      </div>
    }>
      <PreviewClient />
    </Suspense>
  );
}
