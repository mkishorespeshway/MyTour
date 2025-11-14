import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, Clock, DollarSign, ArrowRight, ExternalLink } from "lucide-react";

interface Trip {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  featured: boolean;
}

interface TripDestination {
  id: string;
  destination_id: string;
  order_number: number;
  package_amount: number;
  destinations: {
    name: string;
    description: string;
    location: string;
    image_url: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripDestinations, setTripDestinations] = useState<TripDestination[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripDetails();
    fetchUserData();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      // Fetch trip details
      const tripResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trips/${id}`);
      const tripData = await tripResponse.json();
      setTrip(tripData);

      // Fetch trip destinations with destination details
      const destinationsResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations?filter=${encodeURIComponent(
          JSON.stringify({ trip_id: id })
        )}&sort=order_number&order=asc`
      );
      const destinationsData = await destinationsResponse.json();
      setTripDestinations(destinationsData);
    } catch (error) {
      console.error('Error fetching trip details:', error);
      toast.error("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generateGoogleFormUrl = () => {
    if (!trip) return '#';

    // Google Form ID - you'll need to replace this with your actual Google Form ID
    const formId = '1FAIpQLSd1234567890abcdef'; // Replace with your actual Google Form ID
    
    // Pre-filled data
    const prefillData = {
      'entry.123456789': user?.name || '', // Name field
      'entry.234567890': user?.email || '', // Email field
      'entry.345678901': user?.phone || '', // Phone field
      'entry.456789012': trip.title, // Trip name
      'entry.567890123': trip.duration, // Duration
      'entry.678901234': trip.price.toString(), // Base price
      'entry.789012345': calculateTotalPackage().toString(), // Total with destinations
    };

    const queryString = new URLSearchParams(prefillData).toString();
    return `https://docs.google.com/forms/d/e/${formId}/viewform?${queryString}`;
  };

  const calculateTotalPackage = () => {
    const destinationsTotal = tripDestinations.reduce((sum, td) => sum + td.package_amount, 0);
    return (trip?.price || 0) + destinationsTotal;
  };

  const handleProceed = () => {
    const formUrl = generateGoogleFormUrl();
    if (formUrl !== '#') {
      window.open(formUrl, '_blank');
      
      // Send notification to admin
      sendAdminNotification();
    } else {
      toast.error("Please login to proceed with booking");
    }
  };

  const sendAdminNotification = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Please login to book');
        window.location.href = '/auth';
        return;
      }
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'booking_inquiry',
          message: `${user?.email} is interested in ${trip?.title} trip`,
          user_id: user?.id,
          trip_id: trip?.id,
          data: {
            trip_title: trip?.title,
            user_email: user?.email,
            user_name: user?.name,
            total_amount: calculateTotalPackage(),
            destinations_count: tripDestinations.length
          }
        })
      });
    } catch (error) {
      console.error('Error sending admin notification:', error);
    }
  };

  const [ratings, setRatings] = useState<number[]>([])
  const [userRating, setUserRating] = useState<number | null>(null)

  const fetchRatings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/ratings?filter=${encodeURIComponent(JSON.stringify({ trip_id: id }))}`)
      const list = await res.json()
      setRatings(Array.isArray(list) ? list.map((r: any) => Number(r.value) || 0) : [])
    } catch {}
  }

  useEffect(() => { fetchRatings() }, [id])

  const submitRating = async (value: number) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      toast.error('Please login to rate');
      window.location.href = '/auth'
      return
    }
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trip_id: id, value })
      })
      setUserRating(value)
      toast.success('Thanks for rating!')
      fetchRatings()
    } catch {
      toast.error('Failed to submit rating')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
        <p className="text-gray-600">The trip you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Trip Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
          {trip.featured && (
            <Badge className="bg-yellow-500 text-white">Featured</Badge>
          )}
        </div>
        
        {trip.image_url && (
          <div className="mb-6">
            <img
              src={trip.image_url}
              alt={trip.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span>${trip.price} base price</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{tripDestinations.length} destinations</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">{trip.description}</p>
      </div>

      {/* Destinations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Trip Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          {tripDestinations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No destinations added to this trip yet.</p>
          ) : (
            <div className="space-y-6">
              {tripDestinations.map((tripDestination, index) => (
                <div key={tripDestination.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {tripDestination.order_number}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {tripDestination.destinations?.name}
                        </h3>
                        <Badge variant="outline">${tripDestination.package_amount}</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        {tripDestination.destinations?.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{tripDestination.destinations?.location}</span>
                      </div>
                    </div>
                    
                    {tripDestination.destinations?.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={tripDestination.destinations.image_url}
                          alt={tripDestination.destinations.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  
                  {index < tripDestinations.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Package Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Package Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Trip Price:</span>
              <span>${trip.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Destinations Total:</span>
              <span>
                ${tripDestinations.reduce((sum, td) => sum + td.package_amount, 0)}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Package Amount:</span>
              <span>${calculateTotalPackage()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rate This Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                onClick={() => submitRating(n)}
                className={`h-8 w-8 rounded-full flex items-center justify-center ${((userRating || 0) >= n) ? 'bg-primary text-white' : 'bg-muted'}`}
                aria-label={`Rate ${n} star${n>1?'s':''}`}
              >
                ★
              </button>
            ))}
            <span className="ml-4 text-sm text-muted-foreground">
              Average: {ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : '—'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          onClick={handleProceed}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {user ? 'Proceed to Book' : 'Login to Book'}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TripDetails;