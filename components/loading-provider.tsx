"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { Building2 } from "lucide-react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo(() => ({
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
  }), [isLoading, setLoading, startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

export function InlineLoader({ size = 32 }: { size?: number }) {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
            }}
          />
        </div>
        <div 
          className="rounded-full flex items-center justify-center"
          style={{
            width: size,
            height: size,
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          }}
        >
          <Building2 
            size={size - 10} 
            strokeWidth={2.5} 
            className="text-white animate-pulse"
          />
        </div>
        <div className="absolute -inset-2 rounded-full animate-pulse opacity-20">
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function SectionLoader() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
            }}
          />
        </div>
        <div 
          className="rounded-full flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          }}
        >
          <Building2 
            size={14} 
            strokeWidth={2.5} 
            className="text-white animate-pulse"
          />
        </div>
        <div className="absolute -inset-1 rounded-full animate-pulse opacity-20">
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Standalone centered loader for content areas.
 * Does NOT depend on LoadingContext — always renders when used.
 * Use inside flex-1 containers so it fills and centers properly.
 */
export function ContentLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            }}
          >
            <Building2 size={22} strokeWidth={2} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            }}
          />
        </div>
        <p className="text-sm font-medium text-gray-400">{message}</p>
      </div>
    </div>
  );
}
