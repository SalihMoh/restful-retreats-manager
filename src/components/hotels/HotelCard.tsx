
import { Hotel } from '@/types/hotel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HotelCardProps {
  hotel: Hotel;
  selectedHotel: number | null;
  onSelect: (id: number) => void;
}

export const HotelCard = ({ hotel, selectedHotel, onSelect }: HotelCardProps) => {
  return (
    <Card className="hoverable-card overflow-hidden">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{hotel.description}</p>
        <p className="text-lg font-semibold">${hotel.price} / night</p>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {amenity}
            </span>
          ))}
        </div>
        <Button
          onClick={() => onSelect(hotel.id)}
          className="w-full"
          variant={selectedHotel === hotel.id ? "secondary" : "default"}
        >
          {selectedHotel === hotel.id ? 'Selected' : 'Select Hotel'}
        </Button>
      </CardContent>
    </Card>
  );
};
