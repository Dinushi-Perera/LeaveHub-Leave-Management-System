const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: string;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  status: string;
  comment: string;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  total: number;
  used: number;
  remaining: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  total_leaves: number;
  used_leaves: number;
  remaining_leaves: number;
  pending_requests: number;
}

export interface EmployeeDashboard {
  stats: DashboardStats;
  recent_requests: LeaveRequest[];
  is_on_leave_today: boolean;
}

export interface ManagerDashboard {
  pending_requests: LeaveRequest[];
  employees_off_today: Array<{
    id: number;
    name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
  }>;
  approved_this_month: number;
}

// Helper function to get auth header
function getAuthHeader() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  return {};
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  },
};

// User Profile API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (data: {
    name: string;
    phone: string;
    department: string;
    designation: string;
  }) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },
};

// Leave API
export const leaveAPI = {
  applyLeave: async (data: {
    start_date: string;
    end_date: string;
    type: string;
    reason: string;
  }) => {
    const response = await fetch(`${API_URL}/leaves/apply`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to apply leave');
    }

    return response.json();
  },

  getMyLeaves: async (): Promise<LeaveRequest[]> => {
    const response = await fetch(`${API_URL}/leaves/my`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }

    const data = await response.json();
    return data || [];
  },

  getAllLeaves: async (status?: string): Promise<LeaveRequest[]> => {
    const url = status ? `${API_URL}/leaves/all?status=${status}` : `${API_URL}/leaves/all`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }

    const data = await response.json();
    return data || [];
  },

  approveLeave: async (leaveId: number, status: string, comment: string) => {
    const response = await fetch(`${API_URL}/leaves/${leaveId}/approve`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, comment }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process leave');
    }

    return response.json();
  },
};

// Dashboard API
export const dashboardAPI = {
  getEmployeeDashboard: async (): Promise<EmployeeDashboard> => {
    const response = await fetch(`${API_URL}/dashboard/employee`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee dashboard');
    }

    return response.json();
  },

  getManagerDashboard: async (): Promise<ManagerDashboard> => {
    const response = await fetch(`${API_URL}/dashboard/manager`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch manager dashboard');
    }

    return response.json();
  },

  getTodayStatus: async () => {
    const response = await fetch(`${API_URL}/dashboard/today-status`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch today status');
    }

    return response.json();
  },
};
