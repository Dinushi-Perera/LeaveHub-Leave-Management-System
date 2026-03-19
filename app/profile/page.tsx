'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { userAPI, dashboardAPI, DashboardStats } from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    designation: user?.designation || '',
  });

  useEffect(() => {
    if (user?.role === 'employee') {
      dashboardAPI.getEmployeeDashboard().then(res => setStats(res.stats)).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await userAPI.updateProfile(formData);
      setUser(prev => prev ? { ...prev, ...formData } : null);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch(err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      designation: user.designation,
    });
    setErrors({});
    setIsEditing(false);
  };

  const roleColors: Record<string, string> = {
    employee: 'from-blue-400 to-blue-600',
    manager: 'from-purple-400 to-purple-600',
  };

  return (
    <DashboardLayout title="My Profile" activeTab="My Profile">
      <div className="max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card className="p-8 border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div
              className={`w-24 h-24 bg-gradient-to-br ${roleColors[user.role] || 'from-gray-400 to-gray-600'} rounded-full flex items-center justify-center text-white shadow-lg`}
            >
              <span className="text-5xl font-bold">{user.name.charAt(0)}</span>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-600">
                <span className="font-semibold text-lg">{user.designation}</span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span className="font-semibold">{user.department}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1 bg-gradient-to-r ${roleColors[user.role] || 'from-gray-400 to-gray-600'} text-white rounded-full text-sm font-semibold`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Active
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-md"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Success Message */}
        {success && (
          <Card className="p-4 border-0 shadow-md bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-700 font-semibold">Profile updated successfully!</p>
            </div>
          </Card>
        )}

        {/* Profile Details */}
        <Card className="p-8 border-0 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Details</h2>

          {!isEditing ? (
            // View Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-semibold">Full Name</p>
                  <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {user.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-semibold">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-semibold">Phone Number</p>
                  <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {user.phone}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-semibold">Department</p>
                  <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {user.department}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm font-semibold">Designation</p>
                  <p className="text-lg font-semibold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {user.designation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-semibold text-gray-800">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: '' });
                    }}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                  {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-semibold text-gray-800">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: '' });
                    }}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                  {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="font-semibold text-gray-800">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setErrors({ ...errors, phone: '' });
                    }}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                  {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="font-semibold text-gray-800">
                    Department
                  </label>
                  <Input
                    id="department"
                    type="text"
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      setErrors({ ...errors, department: '' });
                    }}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                  {errors.department && (
                    <p className="text-red-600 text-sm">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label htmlFor="designation" className="font-semibold text-gray-800">
                    Designation
                  </label>
                  <Input
                    id="designation"
                    type="text"
                    value={formData.designation}
                    onChange={(e) => {
                      setFormData({ ...formData, designation: e.target.value });
                      setErrors({ ...errors, designation: '' });
                    }}
                    className="border-2 border-gray-200 focus:border-blue-500"
                  />
                  {errors.designation && (
                    <p className="text-red-600 text-sm">{errors.designation}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-md"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-all shadow-md"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Leave Statistics */}
        {stats && (
          <Card className="p-8 border-0 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-600 font-semibold text-sm">Total Leave Balance</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total_leaves}</p>
                <p className="text-gray-600 text-sm mt-2">days per year</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-600 font-semibold text-sm">Leave Used</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">{stats.used_leaves}</p>
                <p className="text-gray-600 text-sm mt-2">days used</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-600 font-semibold text-sm">Remaining Balance</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {stats.remaining_leaves}
                </p>
                <p className="text-gray-600 text-sm mt-2">days available</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
