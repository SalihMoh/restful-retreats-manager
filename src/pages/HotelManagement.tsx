
import { useState } from 'react';
import Hotel from '@/components/admin/Hotel';
import { Building2 } from 'lucide-react';

const HotelManagement = () => {
  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Hotel Management</h1>
        <Hotel />
      </div>
    </div>
  );
};

export default HotelManagement;
