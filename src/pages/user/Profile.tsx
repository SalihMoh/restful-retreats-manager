
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '@/store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { User as UserType } from '@/types/user';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI state management
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre profil",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData: Partial<UserType> = {
        id: user.id,
        name: formData.name,
        email: formData.email
      };

      await dispatch(updateUser(userData as UserType)).unwrap();
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditingProfile(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre mot de passe",
        variant: "destructive",
      });
      return;
    }

    // Validate password fields
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (!formData.currentPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre mot de passe actuel",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData: UserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: formData.newPassword // Now this will work with our updated type
      };

      await dispatch(updateUser(userData)).unwrap();
      toast({
        title: "Succès",
        description: "Mot de passe mis à jour avec succès",
      });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setIsChangingPassword(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
    }
  };

  const resetAllForms = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditingProfile(false);
    setIsChangingPassword(false);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Vous n'êtes pas connecté</h2>
        <Button onClick={() => navigate('/login')}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
      
      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditingProfile ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Rôle</h3>
                    <p className="font-medium flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                    <div className={`px-2 py-1 rounded-full text-xs inline-block mt-1 ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 
                       user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Modifier mon profil
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Changer de mot de passe
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
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
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="email" 
                      type="email"
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        name: user.name,
                        email: user.email
                      }));
                      setIsEditingProfile(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Password Change Card - Only shown when button is clicked */}
        {isChangingPassword && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Changer de mot de passe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                  <Input 
                    name="currentPassword" 
                    type="password"
                    value={formData.currentPassword} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                  <Input 
                    name="newPassword" 
                    type="password"
                    value={formData.newPassword} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
                  <Input 
                    name="confirmPassword" 
                    type="password"
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                      setIsChangingPassword(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    Mettre à jour le mot de passe
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
