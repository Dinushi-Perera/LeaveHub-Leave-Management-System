'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { dashboardAPI, EmployeeDashboard, leaveAPI, LeaveRequest, ManagerDashboard } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [employeeDashboard, setEmployeeDashboard] = useState<EmployeeDashboard | null>(null);
  const [managerDashboard, setManagerDashboard] = useState<ManagerDashboard | null>(null);
  const [approvedLeaves, setApprovedLeaves] = useState<LeaveRequest[]>([]);
  const [rejectedLeaves, setRejectedLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboard = async () => {
      try {
        if (user.role === 'manager') {
          const [mData, approvedData, rejectedData] = await Promise.all([
            dashboardAPI.getManagerDashboard(),
            leaveAPI.getAllLeaves('approved'),
            leaveAPI.getAllLeaves('rejected'),
          ]);

          setManagerDashboard(mData);
          setApprovedLeaves(approvedData);
          setRejectedLeaves(rejectedData);
        }
        
        // Both roles might need employee dashboard view
        const eData = await dashboardAPI.getEmployeeDashboard();
        setEmployeeDashboard(eData);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboard();
  }, [user]);

  if (!user || isLoading || !employeeDashboard) return null;

  const stats = [
    {
      label: 'Total Leave Balance',
      value: `${employeeDashboard.stats.total_leaves} days`,
      color: 'from-blue-500 to-cyan-400',
      icon: '📅',
    },
    {
      label: 'Leave Used',
      value: `${employeeDashboard.stats.used_leaves} days`,
      color: 'from-purple-500 to-pink-400',
      icon: '✓',
    },
    {
      label: 'Remaining Days',
      value: `${employeeDashboard.stats.remaining_leaves} days`,
      color: 'from-green-500 to-emerald-400',
      icon: '🎯',
    },
    {
      label: 'Pending Requests',
      value: `${employeeDashboard.stats.pending_requests}`,
      color: 'from-orange-500 to-yellow-400',
      icon: '⏳',
    },
  ];

  const recentLeaves = employeeDashboard.recent_requests || [];
  const totalManagerDecisions = approvedLeaves.length + rejectedLeaves.length;

  return (
    <DashboardLayout title="Dashboard" activeTab="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/dashboard-banner.jpg"
            alt="Dashboard Banner"
            width={1200}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-blue-100 text-lg">
              Here's your leave management overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-3 mb-4 w-fit`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Apply Leave Card */}
          {user.role === 'employee' && (
            <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all group cursor-pointer">
              <Link href="/apply-leave">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Apply for Leave</h3>
                    <p className="text-gray-600 mt-1">
                      Submit a new leave request easily
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {/* View Leaves Card */}
          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/my-leaves">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">My Leave Requests</h3>
                  <p className="text-gray-600 mt-1">
                    Check status of your leave applications
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Profile Card */}
          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/profile">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">My Profile</h3>
                  <p className="text-gray-600 mt-1">View and update personal details</p>
                </div>
              </div>
            </Link>
          </Card>

          {/* Help Card */}
          <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all group cursor-pointer">
            <Link href="/help">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Help & Guide</h3>
                  <p className="text-gray-600 mt-1">Learn about the leave system</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Recent Leaves */}
        {recentLeaves.length > 0 && (
          <Card className="p-6 border-0 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Requests</h3>
            <div className="space-y-3">
              {recentLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                    </p>
                    <p className="text-sm text-gray-600">
                        {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {leave.status === 'approved' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          Approved
                        </span>
                      )}
                      {leave.status === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          Pending
                        </span>
                      )}
                      {leave.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                          Rejected
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Manager Previous Decisions */}
        {user.role === 'manager' && managerDashboard && (
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Previous Leave Decisions</h3>
              <Link
                href="/approve-leaves"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage requests
              </Link>
            </div>

            <p className="text-sm text-gray-600 mb-5">
              You have processed {totalManagerDecisions} leave requests so far.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <h4 className="text-lg font-bold text-green-800 mb-3">
                  Approved ({approvedLeaves.length})
                </h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {approvedLeaves.length === 0 && (
                    <p className="text-sm text-green-700">No approved leave history yet.</p>
                  )}
                  {approvedLeaves.slice(0, 12).map((leave) => (
                    <div key={`approved-${leave.id}`} className="rounded-lg bg-white p-3 border border-green-100">
                      <p className="font-semibold text-gray-800">
                        {leave.user?.name || `Employee #${leave.user_id}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <h4 className="text-lg font-bold text-red-800 mb-3">
                  Rejected ({rejectedLeaves.length})
                </h4>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {rejectedLeaves.length === 0 && (
                    <p className="text-sm text-red-700">No rejected leave history yet.</p>
                  )}
                  {rejectedLeaves.slice(0, 12).map((leave) => (
                    <div key={`rejected-${leave.id}`} className="rounded-lg bg-white p-3 border border-red-100">
                      <p className="font-semibold text-gray-800">
                        {leave.user?.name || `Employee #${leave.user_id}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
