import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatTokenAmount, parseTokenAmount, getTokenInfo } from '@/lib/paymentUtils';

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount: string;
  token_address: string;
  gas_used?: string;
  gas_price?: string;
  status: 'pending' | 'confirmed' | 'failed';
  block_number?: number;
  created_at: string;
}

export interface EscrowEvent {
  id: string;
  booking_id: string;
  event_type: 'created' | 'released' | 'refunded';
  amount: string;
  token_address: string;
  tx_hash?: string;
  triggered_by: string;
  created_at: string;
}

export interface PaymentStats {
  totalEarnings: string;
  totalSpent: string;
  pendingPayments: number;
  completedTransactions: number;
  averageRating: number;
  totalServices: number;
}

export class PaymentService {
  /**
   * Create a new payment transaction record
   */
  static async createPaymentTransaction(
    bookingId: string,
    txHash: string,
    fromAddress: string,
    toAddress: string,
    amount: string,
    tokenAddress: string
  ): Promise<PaymentTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .insert({
          booking_id: bookingId,
          tx_hash: txHash,
          from_address: fromAddress,
          to_address: toAddress,
          amount: amount,
          token_address: tokenAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating payment transaction:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      return null;
    }
  }

  /**
   * Update payment transaction status
   */
  static async updateTransactionStatus(
    txHash: string,
    status: 'pending' | 'confirmed' | 'failed',
    blockNumber?: number,
    gasUsed?: string,
    gasPrice?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (blockNumber) updateData.block_number = blockNumber;
      if (gasUsed) updateData.gas_used = gasUsed;
      if (gasPrice) updateData.gas_price = gasPrice;

      const { error } = await supabase
        .from('payment_transactions')
        .update(updateData)
        .eq('tx_hash', txHash);

      if (error) {
        console.error('Error updating transaction status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  }

  /**
   * Create an escrow event
   */
  static async createEscrowEvent(
    bookingId: string,
    eventType: 'created' | 'released' | 'refunded',
    amount: string,
    tokenAddress: string,
    triggeredBy: string,
    txHash?: string
  ): Promise<EscrowEvent | null> {
    try {
      const { data, error } = await supabase
        .from('escrow_events')
        .insert({
          booking_id: bookingId,
          event_type: eventType,
          amount: amount,
          token_address: tokenAddress,
          triggered_by: triggeredBy,
          tx_hash: txHash
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating escrow event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating escrow event:', error);
      return null;
    }
  }

  /**
   * Get payment statistics for a user
   */
  static async getUserPaymentStats(userAddress: string): Promise<PaymentStats> {
    try {
      // Get user's bookings as requester (spent money)
      const { data: spentBookings, error: spentError } = await supabase
        .from('bookings')
        .select(`
          amount,
          payment_status,
          ratings (rating)
        `)
        .eq('requester_id', userAddress);

      if (spentError) {
        console.error('Error fetching spent bookings:', spentError);
      }

      // Get user's skills and their bookings (earned money)
      const { data: earnedBookings, error: earnedError } = await supabase
        .from('bookings')
        .select(`
          amount,
          payment_status,
          skills!inner(user_id)
        `)
        .eq('skills.user_id', userAddress);

      if (earnedError) {
        console.error('Error fetching earned bookings:', earnedError);
      }

      // Calculate statistics
      const totalSpent = spentBookings?.reduce((sum, booking) => {
        if (booking.payment_status === 'paid' && booking.amount) {
          return sum + parseFloat(booking.amount);
        }
        return sum;
      }, 0) || 0;

      const totalEarnings = earnedBookings?.reduce((sum, booking) => {
        if (booking.payment_status === 'paid' && booking.amount) {
          return sum + parseFloat(booking.amount);
        }
        return sum;
      }, 0) || 0;

      const pendingPayments = spentBookings?.filter(
        booking => booking.payment_status === 'escrowed'
      ).length || 0;

      const completedTransactions = spentBookings?.filter(
        booking => booking.payment_status === 'paid'
      ).length || 0;

      const totalServices = completedTransactions;

      // Calculate average rating
      const ratings = spentBookings?.flatMap(booking => 
        booking.ratings?.map(r => r.rating) || []
      ) || [];
      
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0;

      return {
        totalEarnings: (totalEarnings / 1e18).toFixed(4),
        totalSpent: (totalSpent / 1e18).toFixed(4),
        pendingPayments,
        completedTransactions,
        averageRating,
        totalServices
      };
    } catch (error) {
      console.error('Error calculating payment stats:', error);
      return {
        totalEarnings: "0",
        totalSpent: "0",
        pendingPayments: 0,
        completedTransactions: 0,
        averageRating: 0,
        totalServices: 0
      };
    }
  }

  /**
   * Get payment history for a user
   */
  static async getUserPaymentHistory(userAddress: string): Promise<PaymentTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          bookings!inner(requester_id)
        `)
        .eq('bookings.requester_id', userAddress)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Get escrow events for a booking
   */
  static async getEscrowEvents(bookingId: string): Promise<EscrowEvent[]> {
    try {
      const { data, error } = await supabase
        .from('escrow_events')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching escrow events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching escrow events:', error);
      return [];
    }
  }

  /**
   * Update booking payment status
   */
  static async updateBookingPaymentStatus(
    bookingId: string,
    paymentStatus: 'unpaid' | 'escrowed' | 'paid' | 'refunded'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: paymentStatus })
        .eq('id', bookingId);

      if (error) {
        console.error('Error updating booking payment status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating booking payment status:', error);
      return false;
    }
  }

  /**
   * Get transaction by hash
   */
  static async getTransactionByHash(txHash: string): Promise<PaymentTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('tx_hash', txHash)
        .single();

      if (error) {
        console.error('Error fetching transaction:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  /**
   * Format transaction amount for display
   */
  static formatTransactionAmount(amount: string, tokenAddress: string): string {
    const token = getTokenInfo(tokenAddress);
    if (!token) return `${amount} wei`;
    
    const amountBigInt = BigInt(amount);
    return `${formatTokenAmount(amountBigInt, token.decimals)} ${token.symbol}`;
  }

  /**
   * Validate payment amount
   */
  static validatePaymentAmount(amount: string, tokenAddress: string): boolean {
    try {
      const token = getTokenInfo(tokenAddress);
      if (!token) return false;
      
      const amountBigInt = BigInt(amount);
      return amountBigInt > 0n;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get payment summary for a booking
   */
  static async getBookingPaymentSummary(bookingId: string) {
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          payment_transactions(*),
          escrow_events(*)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError) {
        console.error('Error fetching booking payment summary:', bookingError);
        return null;
      }

      return booking;
    } catch (error) {
      console.error('Error fetching booking payment summary:', error);
      return null;
    }
  }
} 