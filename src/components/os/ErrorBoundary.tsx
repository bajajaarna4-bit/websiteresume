'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(): void {
    // Error details intentionally withheld from client UI to avoid leaking internals.
  }

  private readonly handleReset = (): void => {
    this.setState({ hasError: false });
  };

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="glass-panel flex flex-col items-start gap-3 rounded-2xl border border-amber-400/30 p-6 text-sm text-slate-200"
        >
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-amber-300 uppercase">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span>{this.props.title ?? 'Module Recovery Mode'}</span>
          </div>
          <p className="text-slate-300">
            This module hit a runtime boundary and switched to safe fallback mode.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 font-mono text-xs text-sky-200 transition-colors hover:bg-sky-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reload module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
