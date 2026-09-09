import type {Metadata} from 'next';
import './globals.css'; // Global styles
import SessionKeeper from '@/components/SessionKeeper';

export const metadata: Metadata = {
  title: 'Cyber Security Learning Platform',
  description:
    'Comprehensive Full-Stack Cyber Security Learning Platform with Basic to Advanced modules, hands-on labs, 20-question quizzes, final project assessment, and verifiable certificates.',
  openGraph: {
    title: 'Cyber Security Learning Platform',
    description:
      'Comprehensive Full-Stack Cyber Security Learning Platform with Basic to Advanced modules, hands-on labs, 20-question quizzes, final project assessment, and verifiable certificates.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Security Learning Platform',
    description:
      'Comprehensive Full-Stack Cyber Security Learning Platform with Basic to Advanced modules, hands-on labs, 20-question quizzes, final project assessment, and verifiable certificates.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionKeeper />
        {children}
      </body>
    </html>
  );
}
