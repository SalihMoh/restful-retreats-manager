
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, addHotel, updateHotel, deleteHotel } from '../../store/hotelSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RootState } from '@/store/store';

const Hotel = () => {
  const dispatch = useDispatch();
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const [editingHotel, setEditingHotel] = useState<number | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null,
    imagePreview: '',
    location: '',
    amenities: '',
    rating: '',
    availableRooms: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      imagePreview: '',
      location: '',
      amenities: '',
      rating: '',
      availableRooms: ''
    });
    setEditingHotel(null);
    setDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const hotelData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        location: formData.location,
        amenities: formData.amenities.split(',').map(item => item.trim()),
        rating: parseFloat(formData.rating),
        availableRooms: parseInt(formData.availableRooms)
      };

      if (editingHotel) {
        await dispatch(updateHotel({ id: editingHotel, ...hotelData }));
        toast({
          title: "Succès",
          description: "Hôtel mis à jour avec succès",
        });
      } else {
        await dispatch(addHotel(hotelData));
        toast({
          title: "Succès",
          description: "Nouvel hôtel ajouté avec succès",
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

  const handleEdit = (hotel: any) => {
    setEditingHotel(hotel.id);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      price: String(hotel.price),
      image: null,
      imagePreview: hotel.image,
      location: hotel.location,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : hotel.amenities,
      rating: String(hotel.rating),
      availableRooms: String(hotel.availableRooms)
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôtel ?')) {
      try {
        await dispatch(deleteHotel(id));
        toast({
          title: "Succès",
          description: "Hôtel supprimé avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'hôtel",
          variant: "destructive",
        });
      }
    }
  };

  // Filter hotels based on search term
  const filteredHotels = hotels.filter((hotel) => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Analytics data for charts
  const roomAvailabilityData = hotels.map(hotel => ({
    name: hotel.name,
    availableRooms: hotel.availableRooms,
    totalRooms: hotel.availableRooms + Math.floor(Math.random() * 10) + 5 // Mock data for total rooms
  }));

  const ratingDistributionData = [
    { name: '5 étoiles', value: hotels.filter(h => h.rating === 5).length },
    { name: '4 étoiles', value: hotels.filter(h => h.rating === 4).length },
    { name: '3 étoiles', value: hotels.filter(h => h.rating === 3).length },
    { name: '2 étoiles', value: hotels.filter(h => h.rating === 2).length },
    { name: '1 étoile', value: hotels.filter(h => h.rating === 1).length }
  ].filter(item => item.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-8">
      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Hôtels</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Disponibilité des chambres</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roomAvailabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="availableRooms" stroke="#8884d8" name="Chambres disponibles" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Distribution des évaluations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Rechercher par nom ou emplacement..."
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
              <Plus size={16} />
              <span>Ajouter un hôtel</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingHotel ? 'Modifier l\'hôtel' : 'Ajouter un nouvel hôtel'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Emplacement</label>
                  <Input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prix par nuit (€)</label>
                  <Input 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Évaluation (1-5)</label>
                  <Input 
                    name="rating" 
                    type="number" 
                    min="1" 
                    max="5" 
                    step="0.1" 
                    value={formData.rating} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chambres disponibles</label>
                  <Input 
                    name="availableRooms" 
                    type="number" 
                    min="0" 
                    value={formData.availableRooms} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <Input 
                    name="image" 
                    type="file" 
                    onChange={handleInputChange} 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  {(formData.imagePreview || formData.image) && (
                    <div className="mt-2">
                      <img 
                        src={formData.imagePreview || ''} 
                        alt="Preview" 
                        className="h-24 w-auto object-cover rounded-md" 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Équipements (séparés par des virgules)</label>
                <Input 
                  name="amenities" 
                  value={formData.amenities} 
                  onChange={handleInputChange} 
                  placeholder="WiFi, Piscine, Restaurant, Salle de sport" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={4} 
                  required 
                />
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
                  {editingHotel ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video w-full relative">
              <img 
                src={hotel.image || '/placeholder.svg'} 
                alt={hotel.name} 
                className="object-cover w-full h-full" 
              />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded-full text-xs">
                {hotel.rating} ⭐
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{hotel.name}</CardTitle>
                <div className="text-lg font-bold">{hotel.price} €<span className="text-xs font-normal">/nuit</span></div>
              </div>
              <p className="text-sm text-muted-foreground">{hotel.location}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm line-clamp-2">{hotel.description}</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(hotel.amenities) && hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
                {Array.isArray(hotel.amenities) && hotel.amenities.length > 3 && (
                  <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs">
                    +{hotel.amenities.length - 3}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">{hotel.availableRooms}</span> chambres disponibles
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(hotel)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(hotel.id)}
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {pageNumbers.map(number => (
              <PaginationItem key={number}>
                <PaginationLink 
                  isActive={currentPage === number}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Hotel;
