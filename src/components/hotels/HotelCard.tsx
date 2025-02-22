
import { Hotel } from '@/types/hotel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Wifi, Utensils, Bed, Waves } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  selectedHotel: number | null;
  onSelect: (id: number) => void;
}

const amenityIcons: { [key: string]: any } = {
  'Pool': Waves, // Changed from Pool to Waves icon
  'Free Wi-Fi': Wifi,
  'Restaurant': Utensils,
  'Room Service': Bed,
};

export const HotelCard = ({ hotel, selectedHotel, onSelect }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative h-48">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{hotel.rating}</span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{hotel.name}</span>
          <span className="text-xl font-bold text-primary">${hotel.price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{hotel.description}</p>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 4).map((amenity) => {
            const IconComponent = amenityIcons[amenity];
            return (
              <span
                key={amenity}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
              >
                {IconComponent && <IconComponent className="w-3 h-3" />}
                {amenity}
              </span>
            );
          })}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {hotel.availableRooms} rooms left
          </span>
          <Button
            onClick={() => onSelect(hotel.id)}
            variant={selectedHotel === hotel.id ? "secondary" : "default"}
          >
            {selectedHotel === hotel.id ? 'Selected' : 'Book Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
