'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { leaveAPI, LeaveRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const calculateDays = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default function ApproveLeavesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [showRejectForm, setShowRejectForm] = useState<Record<number, boolean>>({});
  const [processedLeaves, setProcessedLeaves] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const leaves = await leaveAPI.getAllLeaves('pending');
        setPendingLeaves(leaves);
      } catch (error) {
        console.error('Failed to fetch pending leaves:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'manager') {
      fetchLeaves();
    }
  }, [user]);

  if (!user || user.role !== 'manager') {
    return null;
  }

  const handleApprove = async (leaveId: number) => {
    try {
      await leaveAPI.approveLeave(leaveId, 'approved', '');
      
      toast({
        title: "Leave Approved",
        description: "The leave request has been approved successfully.",
        variant: "default",
      });

      setProcessedLeaves([...processedLeaves, leaveId]);
      setTimeout(() => {
        setProcessedLeaves(processedLeaves.filter((id) => id !== leaveId));
        setPendingLeaves(pendingLeaves.filter((l) => l.id !== leaveId));
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve leave",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (leaveId: number) => {
    if (!rejectionReason[leaveId] || rejectionReason[leaveId].trim().length === 0) {
      return;
    }

    try {
      await leaveAPI.approveLeave(leaveId, 'rejected', rejectionReason[leaveId]);
      
      toast({
        title: "Leave Rejected",
        description: "The leave request has been rejected.",
        variant: "default",
      });

      setProcessedLeaves([...processedLeaves, leaveId]);
      setShowRejectForm({ ...showRejectForm, [leaveId]: false });
      setRejectionReason({ ...rejectionReason, [leaveId]: '' });
      setTimeout(() => {
        setProcessedLeaves(processedLeaves.filter((id) => id !== leaveId));
        setPendingLeaves(pendingLeaves.filter((l) => l.id !== leaveId));
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject leave",
        variant: "destructive",
      });
    }
  };

  const leaveTypeEmojis: Record<string, string> = {
    sick: '🏥',
    casual: '🎯',
    annual: '✈️',
    unpaid: '💼',
  };

  const stats = [
    {
      label: 'Pending Requests',
      value: pendingLeaves.length,
      color: 'from-yellow-400 to-yellow-600',
      icon: '⏳',
    },
    {
      label: 'Total Days Pending',
      value: pendingLeaves.reduce((sum, leave) => sum + calculateDays(leave.start_date, leave.end_date), 0),
      color: 'from-orange-400 to-orange-600',
      icon: '📅',
    },
    {
      label: 'Employees',
      value: new Set(pendingLeaves.map((l) => l.user_id)).size,
      color: 'from-blue-400 to-blue-600',
      icon: '👥',
    },
  ];

  return (
    <DashboardLayout title="Approve Leaves" activeTab="Approve Leaves">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 border-0 shadow-md">
              <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-3 mb-4 w-fit`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Pending Leaves List */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : pendingLeaves.length > 0 ? (
          <div className="space-y-4">
            {pendingLeaves.map((leave) => {
              const employeeName = leave.user?.name || 'Unknown User';
              const days = calculateDays(leave.start_date, leave.end_date);
              
              return (
              <Card
                key={leave.id}
                className={`p-6 border-0 shadow-md transition-all border-l-8 border-yellow-400 ${
                  processedLeaves.includes(leave.id)
                    ? 'opacity-50 pointer-events-none'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  {/* Employee Info and Leave Details */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* Employee Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                          {employeeName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {employeeName}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Applied on: {new Date(leave.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Leave Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div>
                          <p className="text-gray-600 font-medium">Type</p>
                          <p className="font-semibold text-gray-800 flex items-center gap-2">
                            <span>{leaveTypeEmojis[leave.type.toLowerCase()] || leaveTypeEmojis.casual}</span>
                            {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">From</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(leave.start_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">To</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(leave.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Days</p>
                          <p className="font-semibold text-orange-600 text-lg">{days}</p>
                        </div>
                      </div>

                      {/* Reason */}
                      <div>
                        <p className="text-gray-600 font-medium text-sm">Reason:</p>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg mt-1">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {!showRejectForm[leave.id] ? (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleApprove(leave.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Approve
                      </Button>
                      <Button
                        onClick={() => setShowRejectForm({ ...showRejectForm, [leave.id]: true })}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <p className="font-semibold text-gray-800">Provide Rejection Reason:</p>
                      <textarea
                        value={rejectionReason[leave.id] || ''}
                        onChange={(e) =>
                          setRejectionReason({
                            ...rejectionReason,
                            [leave.id]: e.target.value,
                          })
                        }
                        placeholder="Please explain why you are rejecting this leave request..."
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReject(leave.id)}
                          disabled={!rejectionReason[leave.id] || rejectionReason[leave.id].trim().length === 0}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded-lg"
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          onClick={() =>
                            setShowRejectForm({ ...showRejectForm, [leave.id]: false })
                          }
                          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
            })}
          </div>
        ) : (
          <Card className="p-12 border-0 shadow-md text-center">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">
              There are no pending leave requests to review at the moment.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
