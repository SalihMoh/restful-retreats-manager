
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHotels, addHotel, updateHotel, deleteHotel } from '../store/hotelSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface HotelFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  location: string;
  amenities: string;
}

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const [editingHotel, setEditingHotel] = useState<number | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    location: '',
    amenities: '',
  });

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      location: '',
      amenities: '',
    });
    setEditingHotel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hotelData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      location: formData.location,
      amenities: formData.amenities.split(',').map(item => item.trim()),
    };

    try {
      if (editingHotel) {
        await dispatch(updateHotel({ id: editingHotel, ...hotelData })).unwrap();
        toast({
          title: "Success",
          description: "Hotel updated successfully!",
        });
      } else {
        await dispatch(addHotel(hotelData)).unwrap();
        toast({
          title: "Success",
          description: "Hotel added successfully!",
        });
      }
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save hotel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (hotel: any) => {
    setEditingHotel(hotel.id);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      price: hotel.price.toString(),
      image: hotel.image,
      location: hotel.location,
      amenities: hotel.amenities.join(', '),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteHotel(id)).unwrap();
      toast({
        title: "Success",
        description: "Hotel deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hotel. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Hotel Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Hotel Name"
                  required
                />
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  required
                />
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price per night"
                  required
                />
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  required
                />
              </div>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Hotel Description"
                className="min-h-[100px]"
                required
              />
              <Input
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Amenities (comma-separated)"
                required
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                </Button>
                {editingHotel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="hoverable-card overflow-hidden">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{hotel.description}</p>
                <p className="text-lg font-semibold mb-4">${hotel.price} / night</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(hotel)} variant="outline">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(hotel.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
