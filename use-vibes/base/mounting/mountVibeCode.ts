import { mountVibesApp } from '../vibe-app-mount.js';

// Declare Babel and call-ai globals loaded via CDN script tag or set at runtime
declare global {
  interface Window {
    Babel: {
      transform: (code: string, options: { presets: string[] }) => { code: string | null };
    };
    CALLAI_API_KEY?: string;
    CALLAI_CHAT_URL?: string;
    CALLAI_IMG_URL?: string;
  }
}

// Helper to mount vibe code using Blob URL dynamic import
// With React externalized in vite.config, both the host app and user Vibe code
// use the same React instance from esm.sh via the import map
export async function mountVibeCode(
  code: string,
  containerId: string,
  titleId: string,
  installId: string,
  transformImports: (code: string) => string,
  showVibesSwitch = true,
  apiKey?: string,
  chatUrl?: string,
  imgUrl?: string
): Promise<void> {
  let objectURL: string | undefined;

  console.log('[MountVibeCode] Starting mount process', {
    codeLength: code.length,
    containerId,
    titleId,
    installId,
    showVibesSwitch,
    hasApiKey: !!apiKey,
    chatUrl,
    imgUrl,
  });

  try {
    // Set window globals for call-ai if provided
    // This allows call-ai to use these values when no explicit options are provided
    if (typeof window !== 'undefined') {
      if (apiKey) {
        window.CALLAI_API_KEY = apiKey;
        console.log('[MountVibeCode] Set CALLAI_API_KEY');
      }

      if (chatUrl) {
        window.CALLAI_CHAT_URL = chatUrl;
        console.log('[MountVibeCode] Set CALLAI_CHAT_URL');
      }

      if (imgUrl) {
        window.CALLAI_IMG_URL = imgUrl;
        console.log('[MountVibeCode] Set CALLAI_IMG_URL');
      }
    }

    // Step 1: Transform imports (rewrite unknown bare imports to esm.sh)
    console.log('[MountVibeCode] Transforming imports...');
    const codeWithTransformedImports = transformImports(code);
    console.log('[MountVibeCode] Import transformation complete', {
      originalLength: code.length,
      transformedLength: codeWithTransformedImports.length,
    });

    // Step 2: Ensure Babel is loaded (from CDN script tag)
    console.log('[MountVibeCode] Checking for Babel...');
    if (!window.Babel) {
      const errorMsg = 'Babel not loaded - add <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script> to your HTML';
      console.error('[MountVibeCode]', errorMsg);
      throw new Error(errorMsg);
    }
    console.log('[MountVibeCode] Babel is available');

    // Step 3: Transform JSX to JavaScript (preserve ES modules)
    console.log('[MountVibeCode] Transforming JSX...');
    const transformed = window.Babel.transform(codeWithTransformedImports, {
      presets: ['react'], // Only transform JSX, keep imports as-is
    });
    
    if (!transformed.code) {
      const errorMsg = 'Babel transformation failed - no output code';
      console.error('[MountVibeCode]', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('[MountVibeCode] JSX transformation complete', {
      transformedLength: transformed.code.length,
    });

    // Step 4: Create Blob URL and dynamically import user's Vibe code
    console.log('[MountVibeCode] Creating blob URL...');
    const blob = new Blob([transformed.code], { type: 'application/javascript' });
    objectURL = URL.createObjectURL(blob);
    console.log('[MountVibeCode] Blob URL created:', objectURL);

    // Dynamically import the user's Vibe module
    console.log('[MountVibeCode] Dynamically importing module...');
    const userVibeModule = await import(/* @vite-ignore */ objectURL);
    console.log('[MountVibeCode] Module imported successfully', {
      moduleKeys: Object.keys(userVibeModule),
      hasDefault: !!userVibeModule.default,
      defaultType: typeof userVibeModule.default,
    });

    const AppComponent = userVibeModule.default;

    if (typeof AppComponent === 'undefined') {
      const errorMsg = 'App component is not defined - check your default export';
      console.error('[MountVibeCode]', errorMsg, 'Available exports:', Object.keys(userVibeModule));
      throw new Error(errorMsg);
    }

    // Check container exists
    console.log('[MountVibeCode] Looking for container...');
    const container = document.getElementById(containerId);
    if (!container) {
      const errorMsg = `Container element not found: ${containerId}`;
      console.error('[MountVibeCode]', errorMsg);
      throw new Error(errorMsg);
    }
    console.log('[MountVibeCode] Container found:', {
      containerId,
      containerSize: `${container.offsetWidth}x${container.offsetHeight}`,
    });

    // Step 5: Call the directly imported mountVibesApp with the user's component
    console.log('[MountVibeCode] Calling mountVibesApp...');
    const mountResult = mountVibesApp({
      container: container,
      appComponent: AppComponent,
      showVibesSwitch: showVibesSwitch,
      vibeMetadata: {
        titleId: titleId,
        installId: installId,
      },
    });
    
    console.log('[MountVibeCode] mountVibesApp completed', {
      hasUnmount: typeof mountResult.unmount === 'function',
    });

    // Dispatch success event with unmount callback
    console.log('[MountVibeCode] Dispatching success event...');
    document.dispatchEvent(
      new CustomEvent('vibes-mount-ready', {
        detail: {
          unmount: mountResult.unmount,
          containerId: containerId,
        },
      })
    );
    
    console.log('[MountVibeCode] Mount process completed successfully');
  } catch (err) {
    console.error('[MountVibeCode] Mount failed:', err);
    
    // Log additional debug info
    if (typeof window !== 'undefined') {
      console.log('[MountVibeCode] Environment info:', {
        userAgent: navigator.userAgent,
        location: window.location.href,
        hasBabel: !!window.Babel,
        hasCALLAI_API_KEY: !!window.CALLAI_API_KEY,
        containerExists: !!document.getElementById(containerId),
      });
    }
    
    // Dispatch error event for mount failures
    document.dispatchEvent(
      new CustomEvent('vibes-mount-error', {
        detail: {
          error: err instanceof Error ? err.message : String(err),
          containerId: containerId,
        },
      })
    );
    throw err;
  } finally {
    if (objectURL) {
      URL.revokeObjectURL(objectURL);
      console.log('[MountVibeCode] Cleaned up blob URL');
    }
  }
}
