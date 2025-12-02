import React, { useEffect, useState, useRef } from "react";
import { Lazy } from "@adviser/cement";
import { ensureSuperThis } from "@fireproof/core-runtime";
import { mountVibeWithCleanup } from "use-vibes";
import { setupDevShims, transformImportsDev } from "../../utils/dev-shims.js";
import { useAuth } from "@clerk/clerk-react";
import { VibesDiyEnv } from "../../config/env.js";
import PreviewTestComponent from "./PreviewTestComponent.js";

const sthis = Lazy(() => ensureSuperThis());

interface InlinePreviewProps {
  code: string;
  sessionId: string;
  codeReady: boolean;
}

export function InlinePreview({
  code,
  sessionId,
  codeReady,
}: InlinePreviewProps) {
  const { getToken } = useAuth();
  const [containerId] = useState(
    () => `preview-container-${sthis().nextId().str}`,
  );
  const [error, setError] = useState<string | null>(null);
  const unmountVibeRef = useRef<(() => void) | null>(null);
  return (
    <div
      className="relative w-full h-full bg-gray-900 overflow-auto"
      style={{ isolation: "isolate", transform: "translate3d(0,0,0)" }}
    >
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 z-20 bg-black text-green-400 p-2 text-xs">
          Debug: codeReady={String(codeReady)}, codeLength={code?.length || 0}, error={error || 'none'}
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center max-w-md p-6">
            <p className="text-red-400 text-lg mb-4">Error loading preview:</p>
            <p className="text-white mb-4 break-words">{error}</p>
            <p className="text-gray-400 text-sm">Check browser console for detailed error information</p>
          </div>
        </div>
      )}

      {/* Container for vibe module to mount into */}
      <div id={containerId} className="w-full h-full" />
    </div>
  );
}

export function TestInlinePreview() {
  const [containerId] = useState(
    () => `test-preview-container-${Math.random().toString(36).substr(2, 9)}`,
  );
  const [error, setError] = useState<string | null>(null);
  const unmountVibeRef = useRef<(() => void) | null>(null);

  const testCode = `import React, { useState } from 'react';

export default function TestApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>Test Preview Component</h1>
      <p>This is a test component to verify preview functionality.</p>
      
      <div style={{
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        border: '2px solid #007bff',
        margin: '20px 0'
      }}>
        <h2>Counter: {count}</h2>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Increment
        </button>
      </div>
      
      <div style={{
        backgroundColor: '#d4edda',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #c3e6cb'
      }}>
        <h3 style={{ color: '#155724', marginTop: 0 }}>Preview Test Success!</h3>
        <p style={{ color: '#155724', marginBottom: 0 }}>
          If you can see this component, the preview system is working correctly.
        </p>
      </div>
    </div>
  );
}`;

  const { getToken } = useAuth();

  // Keep window.CALLAI_API_KEY fresh by periodically refreshing the Clerk token
  useEffect(() => {
    const refreshToken = async () => {
      const freshToken = await getToken();
      if (freshToken && typeof window !== "undefined") {
        window.CALLAI_API_KEY = freshToken;
      }
    };

    // Refresh token every 30 seconds (half of Clerk's 60-second token lifetime)
    const interval = setInterval(refreshToken, 30000);

    return () => clearInterval(interval);
  }, [getToken]);

  useEffect(() => {
    console.log('[TestInlinePreview] Starting test mount');

    // Expose libraries to window for development shim
    setupDevShims();
    console.log('[TestInlinePreview] Dev shims setup complete');

    let active = true;

    const loadAndMountTest = async () => {
      try {
        console.log('[TestInlinePreview] Starting loadAndMountTest');
        
        // Check if container exists
        const container = document.getElementById(containerId);
        if (!container) {
          console.error('[TestInlinePreview] Container not found:', containerId);
          setError(`Container element not found: ${containerId}`);
          return;
        }
        console.log('[TestInlinePreview] Container found:', container);

        // Clean up previous mount if exists
        if (unmountVibeRef.current) {
          console.log('[TestInlinePreview] Cleaning up previous mount');
          unmountVibeRef.current();
          unmountVibeRef.current = null;
        }

        // Check if Babel is loaded
        if (typeof window !== 'undefined' && !window.Babel) {
          console.error('[TestInlinePreview] Babel not loaded');
          setError('Babel not loaded - preview requires Babel standalone');
          return;
        }
        console.log('[TestInlinePreview] Babel is loaded');

        // Get Clerk token for API authentication
        console.log('[TestInlinePreview] Getting Clerk token...');
        const clerkToken = await getToken();
        console.log('[TestInlinePreview] Clerk token received:', clerkToken ? 'present' : 'missing');

        // Get configured API endpoint (respects preview mode via env)
        const callaiEndpoint = VibesDiyEnv.CALLAI_ENDPOINT();
        console.log('[TestInlinePreview] API endpoint:', callaiEndpoint);

        // Mount the test vibe code and capture the unmount callback via event
        console.log('[TestInlinePreview] Calling mountVibeWithCleanup with test code...');
        const unmount = await mountVibeWithCleanup(
          testCode,
          containerId,
          "test-session", // Use test session ID as titleId
          "test-preview", // Use "test-preview" as installId
          transformImportsDev,
          false, // Hide vibes switch in test preview mode
          clerkToken || undefined, // Pass Clerk token as apiKey
          callaiEndpoint, // Pass chat API endpoint so vibe uses same endpoint as host
          callaiEndpoint, // Pass image API endpoint (same as chat endpoint)
        );

        console.log('[TestInlinePreview] mountVibeWithCleanup completed');
        
        if (active) {
          unmountVibeRef.current = unmount;
          setError(null);
          console.log('[TestInlinePreview] Mount successful, error cleared');
        } else {
          // Component was unmounted while mounting, clean up immediately
          unmount();
          console.log('[TestInlinePreview] Component unmounted during mount, cleaned up');
        }
      } catch (err) {
        // Error handled by setting error state
        console.error('[TestInlinePreview] Mount failed:', err);
        if (active) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error('[TestInlinePreview] Setting error state:', errorMessage);
          setError(errorMessage);
        }
      }
    };

    // Reset error state
    setError(null);

    loadAndMountTest();

    // Cleanup function
    return () => {
      console.log('[TestInlinePreview] Cleanup function called');
      active = false;

      // Call the unmount callback to properly cleanup the React root
      if (unmountVibeRef.current) {
        unmountVibeRef.current();
        unmountVibeRef.current = null;
      }

      // Clean up the script tag
      const script = document.getElementById(`vibe-script-${containerId}`);
      if (script) {
        script.remove();
      }
    };
  }, [containerId]);

  return (
    <div
      className="relative w-full h-full bg-gray-900 overflow-auto"
      style={{ isolation: "isolate", transform: "translate3d(0,0,0)" }}
    >
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 z-20 bg-black text-green-400 p-2 text-xs">
          Test Preview: containerId={containerId}, error={error || 'none'}
        </div>
      )}
      
      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center max-w-md p-6">
            <p className="text-red-400 text-lg mb-4">Error loading test preview:</p>
            <p className="text-white mb-4 break-words">{error}</p>
            <p className="text-gray-400 text-sm">Check browser console for detailed error information</p>
          </div>
        </div>
      )}

      {/* Container for vibe module to mount into */}
      <div id={containerId} className="w-full h-full" />
    </div>
  );
}
