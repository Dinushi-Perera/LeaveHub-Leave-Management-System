# Leave Management System - Features

## Overview
A modern, user-friendly leave management system built with React, Next.js, and Tailwind CSS. Features a professional blue/purple color scheme with separate interfaces for employees and managers.

## Demo Credentials

### Employee Account
- **Email:** employee@example.com
- **Password:** password123

### Manager Account
- **Email:** manager@example.com
- **Password:** password123

## Key Features

### 1. **Authentication & Authorization**
- User login with email and password validation
- Role-based access control (Employee vs Manager)
- Persistent authentication state using Context API
- Two-factor demo logins for easy testing

### 2. **Login Page**
- Beautiful hero image/video showcase
- Professional gradient background (blue to purple)
- Email and password input with validation icons
- Show/hide password toggle
- Demo account quick-fill buttons
- Error message display
- Responsive design for mobile and desktop

### 3. **Employee Dashboard**
- Welcome banner with dashboard image
- Leave balance statistics with color-coded cards
- Quick action cards (Apply Leave, View Leaves, Profile, Help)
- Recent leave requests display
- Leave type breakdown (Approved, Used, Pending, Rejected)

### 4. **Leave Management**

#### Apply Leave (Employee)
- Select from 4 leave types: Casual, Sick, Annual, Unpaid
- Visual leave type selector with emoji icons
- Date range picker with validation
- Reason/description textarea
- Real-time leave summary calculation
- Available balance checker
- Form validation with detailed error messages
- Success confirmation with redirect

#### My Leaves (View & Track)
- Filter leaves by status (All, Approved, Pending, Rejected)
- Comprehensive leave details display
- Status badges with color coding
- Employee information display
- Rejection reason visibility (if rejected)
- Leave type with emoji indicators
- Responsive card layout

#### Approve Leaves (Manager Only)
- View all pending leave requests
- Employee information with avatar
- Leave details summary with color-coded background
- Approve button with success confirmation
- Reject button with mandatory reason input
- Statistics dashboard (Pending requests, Total days, Employee count)
- Leave type and duration overview
- Smart UI that disables processed leaves temporarily

### 5. **User Profile Management**
- View profile with personal details
- Edit mode for updating information
- Full form validation
  - Name, Email, Phone, Department, Designation
  - Email format validation
  - Phone number format validation
  - Required field validation
- Success message on update
- Leave statistics display
  - Total leave balance
  - Leave used
  - Remaining balance with color-coded cards
- Avatar with role-based gradient colors

### 6. **Help & Guide Section**
- **Getting Started Guide** with 4 comprehensive guides
  1. Access Dashboard
  2. Navigate Your Profile
  3. Manage Your Leaves
  4. Manager Approval Process
- **Frequently Asked Questions**
  - General FAQs (common questions for all users)
  - Employee-specific FAQs
  - Manager-specific FAQs
  - Expandable FAQ cards for easy reading
  - Category filtering
- **Video Tutorials Section** (placeholder for future videos)
- **Contact Support Information**
  - Email, Phone, Office Hours
  - Professional support section

### 7. **Dashboard Layout**
- Sticky navigation bar with:
  - Logo and app name
  - Page title
  - User info (name and role)
  - User avatar
  - Logout button
- Responsive sidebar with:
  - Navigation menu
  - Active tab highlighting
  - Icon-based menu items
  - Smooth transitions
  - Mobile toggle on smaller screens
- Main content area with gradient background

### 8. **Visual Design**
- **Color Scheme:** Professional Blue/Purple Theme
  - Primary Blue: oklch(0.55 0.25 286.4)
  - Secondary Purple: oklch(0.65 0.2 270)
  - Accent colors for different sections
  - Gradient backgrounds throughout
- **Responsive Design:**
  - Mobile-first approach
  - Tablet and desktop optimizations
  - Flexible grid layouts
  - Responsive sidebars and navbars
- **Visual Elements:**
  - Emoji icons for leave types and categories
  - Color-coded status badges
  - Gradient cards and buttons
  - Hero images on dashboard and login
  - Icons for navigation
  - Shadow effects for depth

### 9. **Form Validations**
- Email format validation
- Required field validation
- Date range validation
- Minimum character length validation
- Leave balance validation
- Phone number format validation
- Real-time error clearing on input change
- Comprehensive error messages

### 10. **User Experience**
- Loading states on form submission
- Success confirmations with animations
- Smooth transitions between pages
- Hover effects on interactive elements
- Expandable FAQ sections
- Filter tabs for organizing data
- Empty states with helpful messages
- Clear visual hierarchy
- Consistent spacing and typography

## File Structure

```
/app
  /login           - Login page
  /dashboard       - Employee/Manager dashboard
  /my-leaves       - View leave requests
  /apply-leave     - Apply new leave (Employee)
  /approve-leaves  - Approve leaves (Manager)
  /profile         - User profile and edit
  /help            - Help and FAQ guide
  layout.tsx       - Root layout with AuthProvider
  page.tsx         - Root redirect

/components
  DashboardLayout.tsx  - Shared dashboard layout
  /ui             - shadcn UI components

/context
  AuthContext.tsx  - Authentication state management with mock data

/lib
  utils.ts        - Utility functions
  toast.ts        - Toast notification utility
```

## Authentication Context

The app uses a React Context API for state management with the following features:
- User state management
- Login/logout functionality
- Leave request management
- Profile update functionality
- Mock user data (no backend required)
- Mock leave data for demonstration

## How to Use

1. **First Login:**
   - Click on demo buttons or enter credentials manually
   - Employee: employee@example.com / password123
   - Manager: manager@example.com / password123

2. **Apply Leave (Employees):**
   - Go to Dashboard → Apply Leave
   - Select leave type
   - Choose dates
   - Provide reason
   - Submit

3. **Approve Leaves (Managers):**
   - Go to Dashboard → Approve Leaves
   - Review pending requests
   - Click Approve or Reject
   - (For rejection) Provide reason

4. **Update Profile:**
   - Go to My Profile
   - Click Edit Profile
   - Update details
   - Save changes

5. **View Leave Status:**
   - Go to My Leaves
   - Use filters to view by status
   - Check approval details

## Technical Stack

- **Frontend Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** React Context API
- **Validation:** Custom validation logic
- **Images:** Next.js Image component with dynamic generation

## Features Summary

✓ Beautiful, professional UI with blue/purple theme
✓ Full form validation with error messages
✓ Employee and Manager roles with different views
✓ Leave application workflow
✓ Leave approval workflow
✓ Profile management with editing
✓ Comprehensive help and FAQ section
✓ Leave balance tracking
✓ Status filtering and sorting
✓ Responsive design for all devices
✓ Smooth animations and transitions
✓ Color-coded status indicators
✓ Empty states and loading states
✓ Mock data integration (no backend needed)

## Future Enhancements

- Database integration (Supabase/PostgreSQL)
- Email notifications
- Video tutorials in Help section
- Advanced leave analytics
- Team leave calendar view
- Bulk leave import
- API integration with backend
- Dark mode support
- Multi-language support
