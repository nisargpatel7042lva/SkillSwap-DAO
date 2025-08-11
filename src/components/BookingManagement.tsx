import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, X, FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount, useWriteContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { SKILL_EXCHANGE_ADDRESS, SKILL_EXCHANGE_ABI } from '@/lib/SkillExchange';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import EscrowManager from "./EscrowManager";

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
  role?: 'requester' | 'provider';
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [submittingEvidenceId, setSubmittingEvidenceId] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  
  // Evidence submission state
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [completionNotes, setCompletionNotes] = useState("");

  useEffect(() => {
    if (address) {
      fetchBookings();
    }
  }, [address]);

  const fetchBookings = async () => {
    if (!address) return;
    
    try {
      // Get user's bookings as requester
      const { data: requesterBookings, error: requesterError } = await supabase
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
        .eq('requester_id', address)
        .order('created_at', { ascending: false });

      if (requesterError) {
        console.error('Error fetching requester bookings:', requesterError);
        return;
      }

      // Get user's bookings as provider (through skills)
      const { data: providerBookings, error: providerError } = await supabase
        .from('bookings')
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          skills!inner (
            title,
            price,
            user_id
          )
        `)
        .eq('skills.user_id', address)
        .order('created_at', { ascending: false });

      if (providerError) {
        console.error('Error fetching provider bookings:', providerError);
        return;
      }

      // Combine and transform bookings
      const allBookings = [
        ...(requesterBookings || []).map(b => ({ 
          ...b, 
          role: 'requester' as const,
          skills: Array.isArray(b.skills) ? b.skills[0] : b.skills
        })),
        ...(providerBookings || []).map(b => ({ 
          ...b, 
          role: 'provider' as const,
          skills: Array.isArray(b.skills) ? b.skills[0] : b.skills
        }))
      ];
      
      setBookings(allBookings);
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
        chain: sepolia
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

  const cancelRequest = async (bookingId: string) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet to cancel request.");
      return;
    }
    setCancellingId(bookingId);
    try {
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'cancelRequest',
        args: [parseInt(bookingId)],
        account: address,
        chain: sepolia
      });
      toast.success("Request cancelled! Refund processing...");
      // Update status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          payment_status: 'refunded'
        })
        .eq('id', bookingId);
      if (error) {
        toast.error("Request cancelled but failed to update status in database.");
      } else {
        toast.success("Request status updated to cancelled.");
        fetchBookings();
      }
    } catch (err) {
      toast.error("Failed to cancel request: " + (err?.message || err));
    } finally {
      setCancellingId(null);
    }
  };

  const submitWorkEvidence = async () => {
    if (!selectedBookingId || !evidenceFiles.length || !completionNotes.trim()) {
      toast.error("Please provide evidence files and completion notes.");
      return;
    }

    setSubmittingEvidenceId(selectedBookingId);
    try {
      // Upload files to Supabase storage and get hashes
      const evidenceHashes: string[] = [];
      
      for (const file of evidenceFiles) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('work-evidence')
          .upload(fileName, file);
        
        if (error) {
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('work-evidence')
          .getPublicUrl(fileName);
        
        evidenceHashes.push(publicUrlData.publicUrl);
      }

      // Call smart contract to submit evidence
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI,
        functionName: 'submitWorkEvidence',
        args: [parseInt(selectedBookingId), evidenceHashes, completionNotes],
        account: address!,
        chain: sepolia
      });

      toast.success("Work evidence submitted successfully!");
      
      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', selectedBookingId);
      
      if (error) {
        toast.error("Evidence submitted but failed to update status in database.");
      } else {
        fetchBookings();
      }

      // Reset form
      setEvidenceDialogOpen(false);
      setSelectedBookingId(null);
      setEvidenceFiles([]);
      setCompletionNotes("");
      
    } catch (err) {
      toast.error("Failed to submit evidence: " + (err?.message || err));
    } finally {
      setSubmittingEvidenceId(null);
    }
  };

  const openEvidenceDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setEvidenceDialogOpen(true);
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Please connect your wallet to view your bookings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Loading bookings...</p>
          </CardContent>
        </Card>
      </div>
    );
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
                        {booking.skills?.price || 0} ETH
                      </span>
                      <Badge variant={booking.role === 'requester' ? 'outline' : 'secondary'}>
                        {booking.role === 'requester' ? 'Requested' : 'Providing'}
                      </Badge>
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
                <div className="flex gap-2 flex-wrap">
                  {/* Requester Actions */}
                  {booking.role === 'requester' && (
                    <>
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => cancelRequest(booking.id)}
                          disabled={cancellingId === booking.id}
                        >
                          <X className="w-4 h-4 mr-1" />
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Request'}
                        </Button>
                      )}
                      {booking.status === 'completed' && booking.payment_status === 'escrowed' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => releasePayment(booking.id)}
                          disabled={releasingId === booking.id}
                        >
                          {releasingId === booking.id ? 'Releasing...' : 'Release Payment'}
                        </Button>
                      )}
                    </>
                  )}
                  
                  {/* Provider Actions */}
                  {booking.role === 'provider' && (
                    <>
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                        >
                          Start Work
                        </Button>
                      )}
                      {booking.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEvidenceDialog(booking.id)}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Submit Evidence
                        </Button>
                      )}
                      {booking.status === 'completed' && booking.payment_status === 'escrowed' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => releasePayment(booking.id)}
                          disabled={releasingId === booking.id}
                        >
                          {releasingId === booking.id ? 'Releasing...' : 'Release Payment'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <EscrowManager bookingId={booking.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Evidence Submission Dialog */}
      <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Work Evidence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Evidence Files</label>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setEvidenceFiles(files);
                }}
                className="border-2 border-dashed border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload screenshots, documents, or any proof of work completion
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Completion Notes</label>
              <Textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Describe the work completed, any challenges faced, and final deliverables..."
                rows={4}
                className="border-2 border-dashed border-gray-300"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={submitWorkEvidence}
                disabled={submittingEvidenceId === selectedBookingId}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-1" />
                {submittingEvidenceId === selectedBookingId ? 'Submitting...' : 'Submit Evidence'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEvidenceDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
