/**
 * Authentication layout
 * 
 * Following Next.js route groups best practice using (auth) naming convention
 * https://nextjs.org/docs/app/building-your-application/routing/route-groups
 */

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}
