import * as React from 'react';
import { lazyLoadComponent, LazyLoadingFallback, LazyLoadErrorBoundary } from '../utils/lazy-utils.js';

/**
 * Lazy loaded image generation display component
 * @see ImgGenDisplay component
 */
export const LazyImgGenDisplay = lazyLoadComponent(() => 
  import('./ImgGenUtils/ImgGenDisplay.js').then(module => ({ default: module.ImgGenDisplay }))
);

/**
 * Lazy loaded image generation modal component
 * @see ImgGenModal component
 */
export const LazyImgGenModal = lazyLoadComponent(() => 
  import('./ImgGenUtils/ImgGenModal.js').then(module => ({ default: module.ImgGenModal }))
);

/**
 * Lazy loaded async image component
 * @see AsyncImg component
 */
export const LazyAsyncImg = lazyLoadComponent(() => 
  import('./ImgGenUtils/AsyncImg.js').then(module => ({ default: module.AsyncImg }))
);

/**
 * Lazy loaded controls bar component
 * @see ControlsBar component
 */
export const LazyControlsBar = lazyLoadComponent(() => 
  import('./ControlsBar.js').then(module => ({ default: module.ControlsBar }))
);

/**
 * Lazy loaded prompt bar component
 * @see PromptBar component
 */
export const LazyPromptBar = lazyLoadComponent(() => 
  import('./PromptBar.js').then(module => ({ default: module.PromptBar }))
);

/**
 * Wrapper component for lazy loaded components with error boundary and suspense
 *
 * @param props - Component props
 * @param props.children - Child components to be wrapped
 * @param props.fallback - Custom fallback component (optional)
 * @returns Wrapped component with error handling and loading states
 */
export function LazyComponentWrapper({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}): React.ReactElement {
  return React.createElement(
    LazyLoadErrorBoundary,
    { 
      fallback,
      children: React.createElement(
        React.Suspense,
        { fallback: fallback || React.createElement(LazyLoadingFallback) },
        children
      )
    }
  );
}