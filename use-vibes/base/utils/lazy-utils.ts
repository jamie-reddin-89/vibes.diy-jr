import * as React from 'react';

/**
 * Simple lazy loading wrapper for components
 * @param importFunc Dynamic import function for the component
 * @returns Lazy loaded component
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

/**
 * Error boundary component for lazy loaded components
 */
export class LazyLoadErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Lazy load error:', error);
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
 */
export function LazyLoadingFallback() {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '200px',
      padding: '20px'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }
  }, [
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
  ]));
}