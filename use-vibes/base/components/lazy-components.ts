import * as React from 'react';
import { lazyLoadComponent, LazyLoadingFallback, LazyLoadErrorBoundary } from '../utils/lazy-utils';

// Lazy load the main display components
export const LazyImgGenDisplay = lazyLoadComponent(() => import('./ImgGenUtils/ImgGenDisplay.js'));
export const LazyImgGenModal = lazyLoadComponent(() => import('./ImgGenUtils/ImgGenModal.js'));
export const LazyAsyncImg = lazyLoadComponent(() => import('./ImgGenUtils/AsyncImg.js'));
export const LazyControlsBar = lazyLoadComponent(() => import('./ControlsBar.js'));
export const LazyPromptBar = lazyLoadComponent(() => import('./PromptBar.js'));

// Wrapper component for lazy loaded components with error boundary and suspense
export function LazyComponentWrapper({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return React.createElement(
    LazyLoadErrorBoundary,
    { fallback },
    React.createElement(
      React.Suspense,
      { fallback: fallback || React.createElement(LazyLoadingFallback) },
      children
    )
  );
}