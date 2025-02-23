
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserManagement from '@/components/admin/UserManagement';
import { Users } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">User Management</h1>
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
