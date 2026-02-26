import { Suspense } from 'react';
import { BuilderClient } from './BuilderClient';

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-[#0B1220]">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#E85D2B] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold">AM</span>
            </div>
            <p className="text-white text-sm">Loading proposal builder...</p>
          </div>
        </div>
      }
    >
      <BuilderClient />
    </Suspense>
  );
}
