import React from 'react';

export interface Metadata {
  title: string;
  description: string;
  icons: {
    icon: string;
    shortcut?: string;
    apple?: string;
  };
}

export const metadata: Metadata = {
  title: 'YourCalculation.com',
  description: 'Calculate Anything Smarter with AI. Free online calculators with instant results and AI-powered explanations.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
