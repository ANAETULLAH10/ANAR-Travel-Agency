import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center p-6 text-slate-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-slate-900 mb-2">
              পেজটি লোড হতে সমস্যা হয়েছে
            </h1>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              একটি অপ্রত্যাশিত ত্রুটির কারণে পেজটি প্রদর্শন করা সম্ভব হচ্ছে না। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-100 rounded-xl text-left text-xs font-mono text-slate-700 mb-6 break-words max-h-32 overflow-y-auto border border-slate-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                পেজ রিলোড করুন
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                ক্যাশ ক্লিয়ার করে রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
