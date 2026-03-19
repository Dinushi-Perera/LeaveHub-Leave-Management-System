'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { leaveAPI, dashboardAPI, DashboardStats } from '@/lib/api';

export default function ApplyLeavePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (user) {
      dashboardAPI.getEmployeeDashboard()
        .then(data => setStats(data.stats))
        .catch(err => console.error("Failed to fetch stats", err));
    }
  }, [user]);

  if (!user) return null;

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const days = calculateDays(formData.startDate, formData.endDate);
  const remainingDays = stats ? stats.remaining_leaves : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Leave type is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }
    if (days > remainingDays) {
      newErrors.days = `You only have ${remainingDays} days available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await leaveAPI.applyLeave({
        type: formData.type,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/my-leaves');
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to apply for leave');
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave', icon: '🎯', color: 'from-blue-400 to-blue-600' },
    { value: 'sick', label: 'Sick Leave', icon: '🏥', color: 'from-green-400 to-green-600' },
    { value: 'annual', label: 'Annual Leave', icon: '✈️', color: 'from-yellow-400 to-yellow-600' },
    { value: 'unpaid', label: 'Unpaid Leave', icon: '💼', color: 'from-purple-400 to-purple-600' },
  ];

  if (success) {
    return (
      <DashboardLayout title="Apply Leave" activeTab="Apply Leave">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-12 border-0 shadow-lg text-center max-w-md">
            <div className="text-6xl mb-4 animate-bounce">✓</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">
              Your leave request has been submitted successfully. Redirecting...
            </p>
            <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full overflow-hidden">
              <div className="h-full w-full bg-green-500 animate-pulse"></div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Apply Leave" activeTab="Apply Leave">
      <div className="max-w-4xl space-y-6">
        {errorMessage && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {errorMessage}
          </div>
        )}
        {/* Form */}
        <Card className="p-8 border-0 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type Selection */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800">Select Leave Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: type.value });
                      setErrors({ ...errors, type: '' });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.type === type.value
                        ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-md`
                        : 'border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{type.icon}</span>
                    <p className="font-semibold">{type.label}</p>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-600 text-sm">{errors.type}</p>}
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="font-semibold text-gray-800">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData({ ...formData, startDate: e.target.value });
                    setErrors({ ...errors, startDate: '' });
                  }}
                  className="border-2 border-gray-200 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <p className="text-red-600 text-sm">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="font-semibold text-gray-800">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData({ ...formData, endDate: e.target.value });
                    setErrors({ ...errors, endDate: '' });
                  }}
                  className="border-2 border-gray-200 focus:border-blue-500"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <p className="text-red-600 text-sm">{errors.endDate}</p>}
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <label htmlFor="reason" className="font-semibold text-gray-800">
                Reason for Leave
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => {
                  setFormData({ ...formData, reason: e.target.value });
                  setErrors({ ...errors, reason: '' });
                }}
                placeholder="Please provide a detailed reason for your leave..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.reason && <p className="text-red-600 text-sm">{errors.reason}</p>}
            </div>

            {/* Summary */}
            {formData.startDate && formData.endDate && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-gray-800 mb-3">Leave Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Days</p>
                    <p className="font-bold text-2xl text-blue-600">{days}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Balance</p>
                    <p className="font-bold text-2xl text-green-600">{remainingDays}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">After Request</p>
                    <p className={`font-bold text-2xl ${days <= remainingDays ? 'text-purple-600' : 'text-red-600'}`}>
                      {remainingDays - days}
                    </p>
                  </div>
                </div>
                {errors.days && <p className="text-red-600 text-sm mt-3">{errors.days}</p>}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Leave Request'
                )}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                className="px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
