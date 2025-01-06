import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => (
  <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black p-4">
    <div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center">
      {children}
    </div>
  </div>
); 