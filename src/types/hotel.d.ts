
export interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | File;
  location: string;
  rating: number;
  amenities: string[];
  availableRooms: number;
}

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestCount: number;
  specialRequests?: string;
  createdAt: string;
  roomType: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Review {
  id: number;
  userId: number;
  hotelId: number;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
  response?: {
    text: string;
    date: string;
    staffName: string;
  };
}

export interface Favorite {
  id: number;
  userId: number;
  hotelId: number;
  savedAt: string;
  notes?: string;
}

export interface Room {
  id: number;
  hotelId: number;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  available: boolean;
  images: string[];
  description: string;
}

export interface HotelFilters {
  priceRange: [number, number];
  rating?: number;
  amenities?: string[];
  location?: string;
  dates?: [Date, Date];
  guestCount?: number;
}
