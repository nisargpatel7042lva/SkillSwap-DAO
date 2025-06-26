import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount, useWriteContract } from "wagmi";
import { SKILL_EXCHANGE_ADDRESS, SKILL_EXCHANGE_ABI } from '@/lib/SkillExchange';
import { toast } from "sonner";

interface Skill {
  title: string;
  price: number;
}

interface Booking {
  id: string;
  requirements: string;
  status: string;
  payment_status: string;
  created_at: string;
  skills: Skill;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          skills (
            title,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      if (data) {
        // Transform the data to match our interface
        const transformedBookings = data.map(booking => ({
          ...booking,
          skills: Array.isArray(booking.skills) ? booking.skills[0] : booking.skills
        })) as Booking[];
        
        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking:', error);
        return;
      }

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const releasePayment = async (bookingId: string) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet to release payment.");
      return;
    }
    setReleasingId(bookingId);
    try {
      // Call the contract's releasePayment function
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'releasePayment',
        args: [parseInt(bookingId)],
        account: address,
      });
      toast.success("Payment released on-chain! Updating status...");
      // Update payment_status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', bookingId);
      if (error) {
        toast.error("Payment released but failed to update status in database.");
      } else {
        toast.success("Payment status updated to paid.");
        fetchBookings();
      }
    } catch (err) {
      toast.error("Failed to release payment: " + (err?.message || err));
    } finally {
      setReleasingId(null);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Booking Management</h2>
      
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.skills?.title || 'Unknown Skill'}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${booking.skills?.price || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                    <Badge variant={booking.payment_status === 'paid' ? 'default' : 'destructive'}>
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{booking.requirements}</p>
                <div className="flex gap-2">
                  {booking.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {booking.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                    >
                      Start Work
                    </Button>
                  )}
                  {booking.status === 'completed' && booking.payment_status === 'escrowed' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => releasePayment(booking.id)}
                      disabled={releasingId === booking.id}
                    >
                      {releasingId === booking.id ? 'Releasing...' : 'Release Payment'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
