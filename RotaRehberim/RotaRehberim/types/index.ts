export interface City {
  id: string;
  country: string;
  cityName: string;
  routeCount: number;
  thumbnail?: string;
}

export interface RouteStop {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export interface Rating {
  userId: string;
  rate: number;
  comment: string;
  userName: string;
  userAvatar: string;
  date: string;
}

export interface Route {
  id: string;
  cityId: string;
  creatorUserId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  stops: RouteStop[];
  duration: string;
  distance?: string;
  rating: number;
  ratingCount: number;
  ratings: Rating[];
  photos: string[];
  category: 'walking' | 'driving' | 'mixed';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  photoUri?: string;
  memberSince: string;
  routesCreated: number;
  ratingsGiven: number;
  favoriteCount: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}
