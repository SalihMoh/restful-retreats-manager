
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
                

If there's knowledge, context or custom instructions you want to include in every edit in this project, set it below.

<lov-actions>
<lov-knowledge>
</lov-actions>

Since you'll be using json-server for your backend, you won't need Supabase for this project.  If you decide to use a different backend solution later, you can use the Supabase menu on the top right to connect your project to Supabase.
<lov-actions>
<lov-message-prompt message="Tell me more about Supabase">Learn more about Supabase</lov-message-prompt>
</lov-actions>
