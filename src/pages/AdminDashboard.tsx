
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.includes('users') ? 'users' : 'hotels';

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Hotels Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
