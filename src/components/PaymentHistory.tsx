import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Wallet, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Hash,
  User
} from "lucide-react";
import { useAccount } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { formatTokenAmount, getTokenInfo, formatPriceForDisplay } from '@/lib/paymentUtils';
import { toast } from "sonner";

interface PaymentTransaction {
  id: string;
  booking_id: string;
  tx_hash: string;
  amount: string;
  token_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  booking: {
    requirements: string;
    status: string;
    payment_status: string;
    skills: {
      title: string;
      price: string;
    };
  };
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: string;
  pendingPayments: number;
  completedPayments: number;
}

export const PaymentHistory: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalAmount: '0',
    pendingPayments: 0,
    completedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchPaymentHistory();
    }
  }, [isConnected, address]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings with payment information
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          requirements,
          status,
          payment_status,
          created_at,
          tx_hash,
          token_address,
          skills (
            title,
            price
          )
        `)
        .eq('requester_id', address)
        .not('tx_hash', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Failed to load payment history');
        return;
      }

      if (data) {
        // Transform data to match our interface
        const transformedTransactions: PaymentTransaction[] = data.map(booking => {
          const skills = Array.isArray(booking.skills) ? booking.skills[0] : booking.skills;
          return {
            id: booking.id,
            booking_id: booking.id,
            tx_hash: booking.tx_hash,
            amount: skills?.price || '0',
            token_address: booking.token_address || '0x0000000000000000000000000000000000000000',
            status: booking.payment_status === 'paid' ? 'confirmed' : 
                   booking.payment_status === 'escrowed' ? 'pending' : 'failed',
            created_at: booking.created_at,
            booking: {
              requirements: booking.requirements,
              status: booking.status,
              payment_status: booking.payment_status,
              skills: skills || { title: 'Unknown', price: '0' }
            }
          };
        });

        setTransactions(transformedTransactions);
        calculateStats(transformedTransactions);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions: PaymentTransaction[]) => {
    const totalPayments = transactions.length;
    const pendingPayments = transactions.filter(t => t.status === 'pending').length;
    const completedPayments = transactions.filter(t => t.status === 'confirmed').length;
    
    // Calculate total amount (assuming ETH for now, you might want to convert all to a common currency)
    const totalAmount = transactions
      .filter(t => t.status === 'confirmed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      .toFixed(4);

    setStats({
      totalPayments,
      totalAmount,
      pendingPayments,
      completedPayments
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTokenInfo = (tokenAddress: string) => {
    const token = getTokenInfo(tokenAddress);
    return token || { symbol: 'ETH', logo: '🔷', name: 'Ethereum' };
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Please connect your wallet to view payment history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          Payment History
        </h2>
        <Button
          onClick={fetchPaymentHistory}
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold">{stats.totalPayments}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold">{formatPriceForDisplay(stats.totalAmount)}</p>
              </div>
              <Wallet className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedPayments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment transactions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const token = getTokenInfo(transaction.token_address);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.booking.skills.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {transaction.booking.requirements}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{token.logo}</span>
                          <span className="font-medium">
                            {formatPriceForDisplay(transaction.amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(transaction.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Hash className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transaction.tx_hash}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Service</p>
                  <p className="font-medium">{selectedTransaction.booking.skills.title}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTransaction.status)}
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">
                    {formatPriceForDisplay(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedTransaction.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Requirements</p>
                <p className="text-sm mt-1">{selectedTransaction.booking.requirements}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Transaction Hash</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                  {selectedTransaction.tx_hash}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${selectedTransaction.tx_hash}`, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Etherscan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 