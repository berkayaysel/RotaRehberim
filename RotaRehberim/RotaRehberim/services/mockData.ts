import { City, Route } from "@/types";

export const MOCK_CITIES: City[] = [
  {
    id: "city-1",
    country: "Turkey",
    cityName: "Istanbul",
    routeCount: 5,
    thumbnail: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop",
  },
  {
    id: "city-2",
    country: "Turkey",
    cityName: "Ankara",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  },
  {
    id: "city-3",
    country: "Turkey",
    cityName: "Izmir",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1605639637817-59d0fe58f4d0?w=400&h=300&fit=crop",
  },
  {
    id: "city-4",
    country: "Turkey",
    cityName: "Antalya",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=400&h=300&fit=crop",
  },
  {
    id: "city-5",
    country: "Turkey",
    cityName: "Cappadocia",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop",
  },
  {
    id: "city-6",
    country: "Italy",
    cityName: "Rome",
    routeCount: 6,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
  },
  {
    id: "city-7",
    country: "Italy",
    cityName: "Florence",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1541017430812-9c0f1f7b0b61?w=400&h=300&fit=crop",
  },
  {
    id: "city-8",
    country: "Italy",
    cityName: "Venice",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1541602025294-f5c5767faf4f?w=400&h=300&fit=crop",
  },
  {
    id: "city-9",
    country: "Italy",
    cityName: "Milan",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1490424870945-c5bace63f3dd?w=400&h=300&fit=crop",
  },
  {
    id: "city-10",
    country: "France",
    cityName: "Paris",
    routeCount: 7,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-11",
    country: "France",
    cityName: "Lyon",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-12",
    country: "France",
    cityName: "Marseille",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-13",
    country: "France",
    cityName: "Nice",
    routeCount: 2,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-14",
    country: "Spain",
    cityName: "Barcelona",
    routeCount: 5,
    thumbnail: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&h=300&fit=crop",
  },
  {
    id: "city-15",
    country: "Spain",
    cityName: "Madrid",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&h=300&fit=crop",
  },
  {
    id: "city-16",
    country: "Spain",
    cityName: "Seville",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&h=300&fit=crop",
  },
  {
    id: "city-17",
    country: "Spain",
    cityName: "Valencia",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=400&h=300&fit=crop",
  },
  {
    id: "city-18",
    country: "Germany",
    cityName: "Berlin",
    routeCount: 5,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
  },
  {
    id: "city-19",
    country: "Germany",
    cityName: "Munich",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
  },
  {
    id: "city-20",
    country: "Germany",
    cityName: "Hamburg",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop",
  },
  {
    id: "city-21",
    country: "Greece",
    cityName: "Athens",
    routeCount: 5,
    thumbnail: "https://images.unsplash.com/photo-1533182302531-e83c5e12d4c7?w=400&h=300&fit=crop",
  },
  {
    id: "city-22",
    country: "Greece",
    cityName: "Mykonos",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1533182302531-e83c5e12d4c7?w=400&h=300&fit=crop",
  },
  {
    id: "city-23",
    country: "Greece",
    cityName: "Santorini",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1533182302531-e83c5e12d4c7?w=400&h=300&fit=crop",
  },
  {
    id: "city-24",
    country: "Portugal",
    cityName: "Lisbon",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-25",
    country: "Portugal",
    cityName: "Porto",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    id: "city-26",
    country: "Czech Republic",
    cityName: "Prague",
    routeCount: 5,
    thumbnail: "https://images.unsplash.com/photo-1541452262330-2033e97e8b29?w=400&h=300&fit=crop",
  },
  {
    id: "city-27",
    country: "Netherlands",
    cityName: "Amsterdam",
    routeCount: 4,
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
  },
  {
    id: "city-28",
    country: "Netherlands",
    cityName: "Rotterdam",
    routeCount: 2,
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
  },
  {
    id: "city-29",
    country: "Belgium",
    cityName: "Brussels",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1530894743296-c6613408018d?w=400&h=300&fit=crop",
  },
  {
    id: "city-30",
    country: "Belgium",
    cityName: "Bruges",
    routeCount: 3,
    thumbnail: "https://images.unsplash.com/photo-1530894743296-c6613408018d?w=400&h=300&fit=crop",
  },
];

export const MOCK_ROUTES: Route[] = [
  {
    id: "route-1",
    cityId: "city-1",
    creatorUserId: "user-2",
    creatorName: "Mehmet Yılmaz",
    creatorAvatar: "city-explorer",
    title: "Historic Istanbul Walking Tour",
    description: "Explore the magnificent historical sites of old Istanbul, from Hagia Sophia to the Blue Mosque and Grand Bazaar.",
    stops: [
      { name: "Sultanahmet Square", description: "Starting point with beautiful views", lat: 41.0082, lng: 28.9784 },
      { name: "Hagia Sophia", description: "Ancient Byzantine cathedral", lat: 41.0086, lng: 28.9802 },
      { name: "Blue Mosque", description: "Stunning Ottoman mosque", lat: 41.0054, lng: 28.9768 },
      { name: "Grand Bazaar", description: "Historic covered market", lat: 41.0108, lng: 28.9681 },
    ],
    duration: "4 hours",
    distance: "3.2 km",
    rating: 4.8,
    ratingCount: 124,
    ratings: [
      { userId: "user-3", rate: 5, comment: "Amazing experience! Highly recommended.", userName: "Sarah Johnson", userAvatar: "beach-wanderer", date: "2024-11-15" },
      { userId: "user-4", rate: 4, comment: "Great route, but can be crowded.", userName: "David Chen", userAvatar: "cultural-traveler", date: "2024-11-10" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
    ],
    category: "walking",
    createdAt: "2024-10-15",
  },
  {
    id: "route-2",
    cityId: "city-1",
    creatorUserId: "user-1",
    creatorName: "Travel Explorer",
    creatorAvatar: "backpacker",
    title: "Bosphorus Coastal Drive",
    description: "Scenic drive along the Bosphorus strait with stunning views of both continents.",
    stops: [
      { name: "Ortaköy", description: "Charming waterfront neighborhood", lat: 41.0547, lng: 29.0272 },
      { name: "Bebek Park", description: "Beautiful seaside park", lat: 41.0781, lng: 29.0431 },
      { name: "Rumeli Fortress", description: "Historic Ottoman fortress", lat: 41.0838, lng: 29.0556 },
      { name: "Emirgan Park", description: "Large green park with tulips", lat: 41.1089, lng: 29.0556 },
    ],
    duration: "2.5 hours",
    distance: "15 km",
    rating: 4.6,
    ratingCount: 89,
    ratings: [
      { userId: "user-5", rate: 5, comment: "Breathtaking views!", userName: "Emma Wilson", userAvatar: "backpacker", date: "2024-11-18" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
    ],
    category: "driving",
    createdAt: "2024-11-01",
  },
  {
    id: "route-3",
    cityId: "city-1",
    creatorUserId: "user-2",
    creatorName: "Mehmet Yılmaz",
    creatorAvatar: "city-explorer",
    title: "Asian Side Food Tour",
    description: "Discover authentic local cuisine in Istanbul's Asian neighborhoods.",
    stops: [
      { name: "Kadıköy Market", description: "Fresh produce and local delicacies", lat: 40.9904, lng: 29.0258 },
      { name: "Moda Seaside", description: "Trendy cafes and restaurants", lat: 40.9834, lng: 29.0299 },
      { name: "Çiya Restaurant", description: "Famous for Anatolian cuisine", lat: 40.9899, lng: 29.0256 },
    ],
    duration: "3 hours",
    distance: "2.5 km",
    rating: 4.9,
    ratingCount: 156,
    ratings: [],
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
    ],
    category: "walking",
    createdAt: "2024-09-20",
  },
  {
    id: "route-4",
    cityId: "city-7",
    creatorUserId: "user-3",
    creatorName: "Sarah Johnson",
    creatorAvatar: "beach-wanderer",
    title: "Romantic Paris Evening",
    description: "An enchanting evening walk through the most romantic spots in Paris.",
    stops: [
      { name: "Eiffel Tower", description: "Iconic iron lattice tower", lat: 48.8584, lng: 2.2945 },
      { name: "Trocadéro Gardens", description: "Best Eiffel Tower views", lat: 48.8620, lng: 2.2877 },
      { name: "Seine River Walk", description: "Romantic riverside stroll", lat: 48.8606, lng: 2.3376 },
      { name: "Notre-Dame", description: "Gothic cathedral masterpiece", lat: 48.8530, lng: 2.3499 },
    ],
    duration: "3.5 hours",
    distance: "4.8 km",
    rating: 4.7,
    ratingCount: 203,
    ratings: [
      { userId: "user-6", rate: 5, comment: "Perfect for couples!", userName: "Lucas Martin", userAvatar: "cultural-traveler", date: "2024-11-20" },
    ],
    photos: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop",
    ],
    category: "walking",
    createdAt: "2024-08-10",
  },
];

export function getCountries(): string[] {
  return Array.from(new Set(MOCK_CITIES.map((city) => city.country))).sort();
}

export function getCitiesByCountry(country: string): City[] {
  return MOCK_CITIES.filter((city) => city.country === country);
}

export function getCityById(cityId: string): City | undefined {
  return MOCK_CITIES.find((city) => city.id === cityId);
}

export async function getRoutesByCityId(cityId: string): Promise<Route[]> {
  const mockRoutes = MOCK_ROUTES.filter((route) => route.cityId === cityId);
  
  try {
    const { getCreatedRoutes } = await import("./storage");
    const createdRoutes = await getCreatedRoutes();
    const userRoutesForCity = createdRoutes.filter((route) => route.cityId === cityId);
    return [...mockRoutes, ...userRoutesForCity];
  } catch (error) {
    console.error("Failed to load created routes:", error);
    return mockRoutes;
  }
}

export function getRouteById(routeId: string): Route | undefined {
  return MOCK_ROUTES.find((route) => route.id === routeId);
}

export async function getRouteByIdWithRatings(routeId: string): Promise<Route | undefined> {
  let route = MOCK_ROUTES.find((r) => r.id === routeId);
  let originalRatings = route ? [...route.ratings] : [];
  
  if (!route) {
    try {
      const { getCreatedRoutes } = await import("./storage");
      const createdRoutes = await getCreatedRoutes();
      route = createdRoutes.find((r) => r.id === routeId);
      if (!route) return undefined;
      originalRatings = route.ratings ? [...route.ratings] : [];
    } catch (error) {
      console.error("Failed to load created route:", error);
      return undefined;
    }
  }

  try {
    const { getRatings } = await import("./storage");
    const storedRatings = await getRatings(routeId);
    
    const allRatings = [...originalRatings, ...storedRatings];
    const totalRating = allRatings.reduce((sum, r) => sum + r.rate, 0);
    const avgRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;

    return {
      ...route,
      ratings: allRatings,
      rating: avgRating,
      ratingCount: allRatings.length,
    };
  } catch (error) {
    console.error("Failed to merge ratings:", error);
    return route;
  }
}

export function getRecommendedRoutes(limit: number = 10): Route[] {
  return [...MOCK_ROUTES]
    .sort((a, b) => b.rating * b.ratingCount - a.rating * a.ratingCount)
    .slice(0, limit);
}

export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_CITIES.filter(
    (city) =>
      city.cityName.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery)
  );
}
