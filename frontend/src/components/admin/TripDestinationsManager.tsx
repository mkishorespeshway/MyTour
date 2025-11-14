import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface TripDestination {
  id: string;
  trip_id: string;
  destination_id: string;
  order_number: number;
  package_amount: number;
  destinations: { name: string; location: string };
  trips: { title: string };
}

interface Destination {
  id: string;
  name: string;
  location: string;
}

interface Trip {
  id: string;
  title: string;
}

const TripDestinationsManager = () => {
  const [tripDestinations, setTripDestinations] = useState<TripDestination[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    trip_id: "",
    destination_id: "",
    package_amount: "",
    order_number: "",
  });

  useEffect(() => {
    fetchTripDestinations();
    fetchDestinations();
    fetchTrips();
  }, []);

  const fetchTripDestinations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations`);
      const data = await response.json();
      setTripDestinations(data || []);
    } catch (error) {
      console.error('Error fetching trip destinations:', error);
      toast.error("Failed to fetch trip destinations");
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/destinations`);
      const data = await response.json();
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trips`);
      const data = await response.json();
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      package_amount: parseFloat(formData.package_amount),
      order_number: parseInt(formData.order_number),
    };

    if (editingId) {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        toast.error("Failed to update trip destination");
      } else {
        toast.success("Trip destination updated successfully");
        resetForm();
        fetchTripDestinations();
      }
    } else {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        toast.error("Failed to create trip destination");
      } else {
        toast.success("Trip destination created successfully");
        resetForm();
        fetchTripDestinations();
      }
    }
  };

  const handleEdit = (tripDestination: TripDestination) => {
    setEditingId(tripDestination.id);
    setFormData({
      trip_id: tripDestination.trip_id,
      destination_id: tripDestination.destination_id,
      package_amount: tripDestination.package_amount.toString(),
      order_number: tripDestination.order_number.toString(),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip destination?")) return;

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      toast.error("Failed to delete trip destination");
    } else {
      toast.success("Trip destination deleted successfully");
      fetchTripDestinations();
    }
  };

  const moveOrder = async (id: string, direction: 'up' | 'down') => {
    const current = tripDestinations.find(td => td.id === id);
    if (!current) return;

    const tripDests = tripDestinations.filter(td => td.trip_id === current.trip_id);
    const currentIndex = tripDests.findIndex(td => td.id === id);
    
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = tripDests[currentIndex - 1].order_number;
      await updateOrder(id, newOrder);
      await updateOrder(tripDests[currentIndex - 1].id, current.order_number);
    } else if (direction === 'down' && currentIndex < tripDests.length - 1) {
      const newOrder = tripDests[currentIndex + 1].order_number;
      await updateOrder(id, newOrder);
      await updateOrder(tripDests[currentIndex + 1].id, current.order_number);
    }
    
    fetchTripDestinations();
  };

  const updateOrder = async (id: string, order_number: number) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/trip_destinations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_number })
    });
  };

  const resetForm = () => {
    setFormData({
      trip_id: "",
      destination_id: "",
      package_amount: "",
      order_number: "",
    });
    setEditingId(null);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trip Destinations</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Trip Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Trip Destination" : "Add New Trip Destination"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trip_id">Trip *</Label>
                  <Select
                    value={formData.trip_id}
                    onValueChange={(value) => setFormData({ ...formData, trip_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {trips.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination_id">Destination *</Label>
                  <Select
                    value={formData.destination_id}
                    onValueChange={(value) => setFormData({ ...formData, destination_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem key={dest.id} value={dest.id}>
                          {dest.name} - {dest.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order_number">Order Number</Label>
                    <Input
                      id="order_number"
                      type="number"
                      value={formData.order_number}
                      onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                      placeholder="e.g., 1, 2, 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package_amount">Package Amount ($)</Label>
                    <Input
                      id="package_amount"
                      type="number"
                      step="0.01"
                      value={formData.package_amount}
                      onChange={(e) => setFormData({ ...formData, package_amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Package Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripDestinations.map((tripDest) => (
              <TableRow key={tripDest.id}>
                <TableCell className="font-medium">{tripDest.trips?.title}</TableCell>
                <TableCell>{tripDest.destinations?.name}</TableCell>
                <TableCell>{tripDest.destinations?.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {tripDest.order_number}
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => moveOrder(tripDest.id, 'up')}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => moveOrder(tripDest.id, 'down')}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${tripDest.package_amount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(tripDest)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tripDest.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TripDestinationsManager;