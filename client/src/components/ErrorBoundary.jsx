import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OmniFusion UI Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F19] text-white">
          <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-rose-500/30 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Workspace Interface Notice</h2>
              <p className="text-xs text-slate-400">
                An unexpected component rendering state occurred. Click below to refresh your workspace session.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs font-mono text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.assign('/login')}
                className="flex-1 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Go to Sign In
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white gradient-bg-primary hover:opacity-95 transition-opacity"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
