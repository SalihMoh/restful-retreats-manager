
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '@/store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock } from 'lucide-react';
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

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre profil",
        variant: "destructive",
      });
      return;
    }

    // Validate password fields
    if (formData.newPassword) {
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
    }

    try {
      const userData: Partial<UserType> = {
        id: user.id,
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        // In a real application, you would verify the current password on the server side
        userData.password = formData.newPassword;
      }

      await dispatch(updateUser(userData as UserType)).unwrap();
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  disabled={!isEditing}
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
                    disabled={!isEditing}
                    required 
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-primary" />
                    Changer de mot de passe
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                      <Input 
                        name="currentPassword" 
                        type="password"
                        value={formData.currentPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                      <Input 
                        name="newPassword" 
                        type="password"
                        value={formData.newPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
                      <Input 
                        name="confirmPassword" 
                        type="password"
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing ? (
                <>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                >
                  Modifier
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
