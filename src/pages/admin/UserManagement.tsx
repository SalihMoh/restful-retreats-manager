import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '@/store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { User, Lock, UserPlus, Search } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { User as UserType } from '@/types/user';

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status } = useSelector((state: RootState) => state.users);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'role') {
        return { ...prev, [name]: value as 'admin' | 'user' };
      } else if (name === 'status') {
        return { ...prev, [name]: value as 'active' | 'inactive' | 'suspended' };
      }
      return { ...prev, [name]: value };
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    });
    setEditingUser(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status
      };

      if (editingUser) {
        await dispatch(updateUser({ id: editingUser, ...userData } as UserType)).unwrap();
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
        });
      } else {
        await dispatch(addUser(userData)).unwrap();
        toast({
          title: "Succès",
          description: "Nouvel utilisateur ajouté avec succès",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password for security reasons
      role: user.role,
      status: user.status || 'active'
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { resetForm(); setDialogOpen(true); }} 
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>Ajouter un utilisateur</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un nouvel utilisateur'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                  </label>
                  <Input 
                    name="password" 
                    type="password"
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUser ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {user.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">{user.email}</div>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </span>
                
                {user.status && (
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                    {user.status === 'active' ? 'Actif' : 
                     user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Date non disponible'}
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(user)}
                    className="flex items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {pageNumbers.map(number => (
              <PaginationItem key={number}>
                <PaginationLink 
                  href="#"
                  isActive={currentPage === number}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(number);
                  }}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UserManagement;
