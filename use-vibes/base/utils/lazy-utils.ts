import * as React from 'react';

/**
 * Enhanced lazy loading wrapper for components
 * Handles both default and named exports automatically
 * @param importFunc Dynamic import function for the component
 * @returns Lazy loaded component
 * @template T - Component type
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T>;

/**
 * Enhanced lazy loading wrapper for components
 * Handles both default and named exports automatically
 * @param importFunc Dynamic import function for the component
 * @returns Lazy loaded component
 * @template T - Component type
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<T>
): React.LazyExoticComponent<T>;

export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>
): React.LazyExoticComponent<T> {
  // Create a wrapper that normalizes the import to always have a default export
  const wrappedImport = async () => {
    const module = await importFunc();
    if ('default' in module) {
      return module;
    } else {
      return { default: module };
    }
  };
  return React.lazy(wrappedImport);
}

/**
 * Error boundary component for lazy loaded components
 * Provides better error handling and logging
 */
export class LazyLoadErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Lazy load error:', error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || React.createElement('div', null, 'Error loading component');
    }
    return this.props.children;
  }
}

/**
 * Standard loading fallback component
 * Simplified and more maintainable implementation
 */
export function LazyLoadingFallback() {
  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '200px',
        padding: '20px'
      }
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }
      },
      [
        React.createElement('div', {
          style: {
            width: '40px',
            height: '40px',
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
            borderTopColor: '#0074d9'
          }
        }),
        React.createElement('span', {
          style: { color: '#666' }
        }, 'Loading component...')
      ]
    )
  );
}