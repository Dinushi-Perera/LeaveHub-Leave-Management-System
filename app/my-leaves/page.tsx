'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { leaveAPI, LeaveRequest } from '@/lib/api';

export default function MyLeavesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await leaveAPI.getMyLeaves();
        setLeaves(data);
      } catch (error) {
        console.error('Failed to fetch leaves', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLeaves();
    }
  }, [user]);

  if (!user || loading) return null;

  const userLeaves = leaves;
  const filteredLeaves =
    filter === 'all'
      ? userLeaves
      : userLeaves.filter((l) => l.status === filter as any);

  const statusColors = {
    approved: 'from-green-100 to-emerald-100',
    pending: 'from-yellow-100 to-amber-100',
    rejected: 'from-red-100 to-rose-100',
  };

  const statusBgColors = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const leaveTypeEmojis = {
    sick: '🏥',
    casual: '🎯',
    annual: '✈️',
    unpaid: '💼',
  };

  return (
    <DashboardLayout title="My Leave Requests" activeTab="My Leaves">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {status === 'all' ? 'All Requests' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaves List */}
        {filteredLeaves.length > 0 ? (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => (
              <Card
                key={leave.id}
                className={`p-6 border-0 shadow-md hover:shadow-lg transition-all border-l-8 border-gradient-to-b from-blue-400 to-purple-400 bg-gradient-to-br ${
                  statusColors[leave.status]
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Leave Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{leaveTypeEmojis[leave.type]}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Applied on: {new Date(leave.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Date Range and Days */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
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
                        <p className="text-gray-600 font-medium">Duration</p>
                        <p className="font-semibold text-gray-800">
                          {Math.ceil(Math.abs(new Date(leave.end_date).getTime() - new Date(leave.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Reason:</p>
                      <p className="text-gray-800">{leave.reason}</p>
                    </div>

                    {/* Approval Info */}
                    {leave.approved_by && (
                      <div className="text-sm">
                        <p className="text-gray-600 font-medium">
                          {leave.status === 'approved'
                            ? 'Approved by'
                            : 'Reviewed by'}
                          :
                        </p>
                        <p className="text-gray-800">Manager ID: {leave.approved_by}</p>
                      </div>
                    )}

                    {/* Comment/Rejection Reason */}
                    {leave.comment && (
                      <div className={`mt-3 p-3 rounded ${leave.status === 'rejected' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50 border-l-4 border-gray-500'}`}>
                        <p className={`${leave.status === 'rejected' ? 'text-red-700' : 'text-gray-700'} font-medium`}>
                          {leave.status === 'rejected' ? 'Rejection Reason:' : 'Manager Comment:'}
                        </p>
                        <p className={leave.status === 'rejected' ? 'text-red-600' : 'text-gray-600'}>{leave.comment}</p>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-4 py-2 rounded-full font-bold text-center ${
                        statusBgColors[leave.status]
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                    {leave.status === 'pending' && (
                      <p className="text-xs text-gray-600 text-center">Awaiting approval</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 border-0 shadow-md text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Leave Requests</h3>
            <p className="text-gray-600">
              You haven't submitted any leave requests
              {filter !== 'all' ? ` with status "${filter}"` : ''} yet.
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
