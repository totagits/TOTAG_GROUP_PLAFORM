import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border-2 border-red-500/50 p-8 rounded-2xl max-w-xl shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-white">TOTAG Component Rendering Exception</h2>
            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-left overflow-x-auto">
              {this.state.error?.toString() || "Unknown rendering exception"}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg cursor-pointer"
            >
              Clear Storage & Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
