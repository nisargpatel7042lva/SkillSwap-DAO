import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  BarChart3,
  History,
  Settings
} from "lucide-react";
import { useAccount } from 'wagmi';
import { PaymentHistory } from './PaymentHistory';
import BookingManagement from './BookingManagement';
import { toast } from "sonner";

interface PaymentStats {
  totalEarnings: string;
  totalSpent: string;
  pendingPayments: number;
  completedTransactions: number;
  averageRating: number;
}

export const PaymentDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<PaymentStats>({
    totalEarnings: "0",
    totalSpent: "0",
    pendingPayments: 0,
    completedTransactions: 0,
    averageRating: 0
  });

  const handleRefresh = () => {
    toast.success("Refreshing payment data...");
    // This would trigger a refresh of all payment data
    // Implementation would depend on your data fetching strategy
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Payment Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-500 mb-6">
              Connect your wallet to view your payment history and manage transactions.
            </p>
            <Badge variant="outline" className="text-sm">
              🔗 Wallet Connection Required
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-600" />
            Payment Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your payments, track transactions, and monitor your earnings
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalEarnings} ETH</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSpent} ETH</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completedTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Payment Released</p>
                        <p className="text-xs text-gray-500">Web Development Service</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">0.05 ETH</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Payment Pending</p>
                        <p className="text-xs text-gray-500">UI/UX Design Service</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">0.03 ETH</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Service Booked</p>
                        <p className="text-xs text-gray-500">Smart Contract Audit</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">0.1 ETH</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Payment Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Transaction</span>
                    <span className="font-medium">0.045 ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{stats.averageRating.toFixed(1)}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Services</span>
                    <span className="font-medium">{stats.completedTransactions}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Payment Security</p>
                      <p className="text-xs">
                        All payments are secured by smart contract escrow. Funds are only released after service completion.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Default Payment Token</p>
                    <p className="text-sm text-gray-500">Choose your preferred payment method</p>
                  </div>
                  <Badge variant="outline">🔷 ETH</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Release Payments</p>
                    <p className="text-sm text-gray-500">Automatically release payments after service completion</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Payment Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications for payment events</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Transaction History</p>
                    <p className="text-sm text-gray-500">Keep detailed records of all transactions</p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 