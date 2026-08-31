'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), {
  ssr: false,
});

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        {children}
      </div>
    </>
  );
}
