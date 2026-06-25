'use client';

import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../../types';
import { Card, CardContent } from '../ui/card';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return null; // AuthGuard should handle redirecting unauthenticated users
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto mt-12 border-(--status-danger)">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-(--status-danger) mb-2">Access Denied</h2>
            <p className="text-(--text-secondary)">
              You do not have the required permissions to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
