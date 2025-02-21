
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchHotels, addHotel, updateHotel, deleteHotel } from '../store/hotelSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotels } = useSelector((state: RootState) => state.hotels);
  const [editingHotel, setEditingHotel] = useState<number | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    location: '',
    amenities: '',
    rating: '',
    availableRooms: ''
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
      rating: '',
      availableRooms: ''
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
      rating: parseFloat(formData.rating),
      availableRooms: parseInt(formData.availableRooms)
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
      rating: hotel.rating.toString(),
      availableRooms: hotel.availableRooms.toString()
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

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statistics = {
    totalHotels: hotels.length,
    averagePrice: hotels.reduce((acc, hotel) => acc + hotel.price, 0) / hotels.length,
    totalRooms: hotels.reduce((acc, hotel) => acc + hotel.availableRooms, 0),
    averageRating: hotels.reduce((acc, hotel) => acc + hotel.rating, 0) / hotels.length
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-12">Hotel Management Dashboard</h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.totalHotels}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${statistics.averagePrice.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.totalRooms}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.averageRating.toFixed(1)} ⭐</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Price Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hotels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Room Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hotels}
                    dataKey="availableRooms"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {hotels.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search hotels by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Hotel Form */}
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
                <Input
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                  placeholder="Rating (0-5)"
                  required
                />
                <Input
                  name="availableRooms"
                  type="number"
                  min="0"
                  value={formData.availableRooms}
                  onChange={handleInputChange}
                  placeholder="Available Rooms"
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

        {/* Hotels List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
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
                <p className="text-lg font-semibold mb-2">${hotel.price} / night</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Rating: {hotel.rating} ⭐ | Available Rooms: {hotel.availableRooms}
                </p>
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
