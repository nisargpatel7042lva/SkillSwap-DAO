import React, { useEffect, useMemo, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Clock, CheckCircle, AlertTriangle, Upload, Shield, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicClient, SKILL_EXCHANGE_ABI, SKILL_EXCHANGE_ADDRESS } from "@/lib/SkillExchange";
import { decodeEventLog } from "viem";

interface EscrowManagerProps {
  bookingId: string;
}

interface BookingRecord {
  id: number;
  requirements: string | null;
  status: string | null;
  payment_status: string | null;
  created_at: string;
  requester_id: string | null;
  tx_hash: string | null;
  amount: string | null;
  token_address: string | null;
  skills?: {
    user_id: string | null;
    title?: string | null;
    price?: number | null;
  }[] | null;
}

export const EscrowManager: React.FC<EscrowManagerProps> = ({ bookingId }) => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [contractState, setContractState] = useState<{
    completed: boolean;
    paymentReleased: boolean;
    disputed: boolean;
    autoReleaseTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [completionNotes, setCompletionNotes] = useState("");
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeEvidenceUrl, setDisputeEvidenceUrl] = useState("");

  const isRequester = useMemo(() => {
    if (!booking || !address) return false;
    return booking.requester_id?.toLowerCase() === address.toLowerCase();
  }, [booking, address]);

  const isProvider = useMemo(() => {
    if (!booking || !address) return false;
    const skill = booking.skills && Array.isArray(booking.skills) ? booking.skills[0] : undefined;
    return skill?.user_id?.toLowerCase() === address.toLowerCase();
  }, [booking, address]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Load booking (with skill owner)
        const { data, error } = await supabase
          .from("bookings")
          .select(`id, requirements, status, payment_status, created_at, requester_id, tx_hash, amount, token_address, skills(user_id, title, price)`) // prettier-ignore
          .eq("id", bookingId)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setBooking(null);
          return;
        }
        setBooking(data as unknown as BookingRecord);

        // Resolve on-chain requestId from tx hash
        if (data.tx_hash) {
          try {
            const receipt = await publicClient.getTransactionReceipt({
              hash: data.tx_hash as `0x${string}`,
            });
            let found: number | null = null;
            for (const log of receipt.logs as any[]) {
              try {
                const decoded = decodeEventLog({
                  abi: SKILL_EXCHANGE_ABI as any,
                  data: (log as any).data as `0x${string}`,
                  topics: (log as any).topics as any,
                }) as any;
                if (decoded.eventName === "ServiceRequested") {
                  const rid = Number((decoded.args as any)[0]);
                  found = rid;
                  break;
                }
              } catch {}
            }
            if (found !== null) setRequestId(found);
          } catch (e) {
            console.warn("Could not fetch receipt for tx", data.tx_hash, e);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load escrow state");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [bookingId]);

  // Load contract state for the request
  useEffect(() => {
    const loadState = async () => {
      if (requestId == null) return;
      try {
        const res: any = await publicClient.readContract({
          address: SKILL_EXCHANGE_ADDRESS,
          abi: SKILL_EXCHANGE_ABI as any,
          functionName: "requests",
          args: [BigInt(requestId)],
        });
        // Map struct by index (as returned by viem)
        const completed = Boolean(res[6]);
        const paymentReleased = Boolean(res[7]);
        const disputed = Boolean(res[8]);
        const autoReleaseTime = Number(res[10] ?? 0);
        setContractState({ completed, paymentReleased, disputed, autoReleaseTime });
      } catch (e) {
        console.warn("Failed to read contract state", e);
      }
    };
    loadState();
  }, [requestId]);

  // Supabase realtime for booking updates and escrow events
  useEffect(() => {
    if (!bookingId) return;
    const channel = supabase
      .channel("escrow-" + bookingId)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${bookingId}` },
        (payload) => {
          setBooking((prev) => ({ ...(prev as any), ...(payload.new as any) }));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "escrow_events", filter: `booking_id=eq.${bookingId}` },
        () => {
          // Refresh booking for any cascading UI updates
          supabase
            .from("bookings")
            .select(`id, requirements, status, payment_status, created_at, requester_id, tx_hash, amount, token_address, skills(user_id, title, price)`) // prettier-ignore
            .eq("id", bookingId)
            .maybeSingle()
            .then(({ data }) => data && setBooking(data as any));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  const timeRemaining = useMemo(() => {
    if (!contractState?.autoReleaseTime) return null;
    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, contractState.autoReleaseTime - now);
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [contractState?.autoReleaseTime]);

  const submitEvidence = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet");
      return;
    }
    if (requestId == null) {
      toast.error("Missing on-chain request id");
      return;
    }
    if (!evidenceFiles.length || !completionNotes.trim()) {
      toast.error("Please add evidence files and notes");
      return;
    }

    try {
      // Upload to storage
      const evidenceUrls: string[] = [];
      for (const file of evidenceFiles) {
        const fileName = `${bookingId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("work-evidence")
          .upload(fileName, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("work-evidence").getPublicUrl(fileName);
        evidenceUrls.push(urlData.publicUrl);
      }

      // Call contract (submitWorkEvidence exists in contract)
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI as any,
        functionName: "submitWorkEvidence",
        args: [BigInt(requestId), evidenceUrls, completionNotes],
        account: address,
        chain: sepolia,
      });

      // Store off-chain for quick UI
      await supabase.from("work_evidence").insert({
        booking_id: Number(bookingId),
        request_id: requestId,
        submitter: address,
        evidence_url: evidenceUrls.join(","),
        notes: completionNotes,
      });

      await supabase
        .from("bookings")
        .update({ status: "completed" })
        .eq("id", bookingId);

      toast.success("Evidence submitted successfully");
      setEvidenceDialogOpen(false);
      setEvidenceFiles([]);
      setCompletionNotes("");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to submit evidence");
    }
  };

  const releasePayment = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet");
      return;
    }
    if (requestId == null) {
      toast.error("Missing on-chain request id");
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI as any,
        functionName: "releasePayment",
        args: [BigInt(requestId)],
        account: address,
        chain: sepolia,
      });
      await supabase
        .from("bookings")
        .update({ payment_status: "paid" })
        .eq("id", bookingId);
      toast.success("Payment released");
    } catch (e: any) {
      toast.error(e?.message || "Failed to release payment");
    }
  };

  const raiseDispute = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet");
      return;
    }
    if (requestId == null) {
      toast.error("Missing on-chain request id");
      return;
    }
    if (!disputeReason.trim() || !disputeEvidenceUrl.trim()) {
      toast.error("Provide evidence URL and reason");
      return;
    }
    try {
      await writeContractAsync({
        address: SKILL_EXCHANGE_ADDRESS,
        abi: SKILL_EXCHANGE_ABI as any,
        functionName: "raiseDispute",
        args: [BigInt(requestId), disputeEvidenceUrl, disputeReason],
        account: address,
        chain: sepolia,
      });
      await supabase
        .from("bookings")
        .update({ status: "disputed" })
        .eq("id", bookingId);
      toast.success("Dispute raised");
      setDisputeDialogOpen(false);
      setDisputeReason("");
      setDisputeEvidenceUrl("");
    } catch (e: any) {
      toast.error(e?.message || "Failed to raise dispute");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Escrow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading escrow state...</div>
        </CardContent>
      </Card>
    );
  }

  if (!booking) return null;

  const statusBadges = (
    <div className="flex gap-2 flex-wrap">
      <Badge variant={booking.status === "completed" ? "default" : "secondary"}>{booking.status || "pending"}</Badge>
      <Badge variant={booking.payment_status === "paid" ? "default" : "outline"}>{booking.payment_status || "unpaid"}</Badge>
      {contractState?.disputed && <Badge variant="destructive">Disputed</Badge>}
    </div>
  );

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" /> Escrow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">On-chain Request ID</div>
          <div className="font-mono text-sm">{requestId ?? "Not available"}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Status</div>
          {statusBadges}
        </div>

        {contractState && !contractState.paymentReleased && contractState.completed && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Clock className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Auto-release in {timeRemaining || "-"}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 flex-wrap">
          {/* Provider actions */}
          {isProvider && !contractState?.completed && (
            <Button variant="outline" size="sm" onClick={() => setEvidenceDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-1" /> Submit Evidence
            </Button>
          )}

          {/* Requester actions */}
          {isRequester && contractState?.completed && !contractState?.paymentReleased && !contractState?.disputed && (
            <Button size="sm" onClick={releasePayment} disabled={isPending}>
              <CheckCircle className="w-4 h-4 mr-1" /> Release Payment
            </Button>
          )}

          {isRequester && contractState?.completed && !contractState?.paymentReleased && !contractState?.disputed && (
            <Button variant="destructive" size="sm" onClick={() => setDisputeDialogOpen(true)} disabled={isPending}>
              <AlertTriangle className="w-4 h-4 mr-1" /> Raise Dispute
            </Button>
          )}

          {booking.tx_hash && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${booking.tx_hash}`, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-1" /> View Tx
            </Button>
          )}
        </div>

        {/* Evidence Dialog */}
        <Dialog open={evidenceDialogOpen} onOpenChange={setEvidenceDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Work Evidence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Evidence Files</label>
                <Input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={(e) => setEvidenceFiles(Array.from(e.target.files || []))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Completion Notes</label>
                <Textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} rows={4} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={submitEvidence} disabled={!evidenceFiles.length || !completionNotes.trim()}>
                  Submit
                </Button>
                <Button variant="outline" onClick={() => setEvidenceDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dispute Dialog */}
        <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Raise Dispute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Evidence URL (IPFS or file link)</label>
                <Input value={disputeEvidenceUrl} onChange={(e) => setDisputeEvidenceUrl(e.target.value)} placeholder="ipfs://... or https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <Textarea value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} rows={4} />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" variant="destructive" onClick={raiseDispute} disabled={!disputeReason.trim() || !disputeEvidenceUrl.trim()}>
                  Submit Dispute
                </Button>
                <Button variant="outline" onClick={() => setDisputeDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EscrowManager;
