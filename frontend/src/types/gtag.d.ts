declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

declare const gtag: (
  command: 'config' | 'event' | 'js',
  targetId: string,
  config?: Record<string, unknown>
) => void;

export {};
