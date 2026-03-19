'use client';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

export default function HelpPage() {
  const { user } = useAuth();
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  if (!user) return null;

  const generalFaqs = [
    {
      id: 'g1',
      question: 'How do I apply for leave?',
      answer:
        'To apply for leave, click on "Apply Leave" from the sidebar menu. Select your leave type, choose the dates, and provide a reason. Then submit the form. Your manager will review and approve or reject your request.',
      category: 'general',
    },
    {
      id: 'g2',
      question: 'What are the different types of leave available?',
      answer:
        'We have four types of leave: Casual Leave (for personal reasons), Sick Leave (for health issues), Annual Leave (vacation), and Unpaid Leave. Each has its own balance and approval process.',
      category: 'general',
    },
    {
      id: 'g3',
      question: 'How can I check my leave balance?',
      answer:
        'Your leave balance is displayed on the Dashboard. It shows your total leave days, used days, and remaining days. You can also see detailed breakdowns on your Profile page.',
      category: 'general',
    },
    {
      id: 'g4',
      question: 'What should I do if my leave is rejected?',
      answer:
        'If your leave request is rejected, check the rejection reason provided by your manager. You can apply again with adjustments or on different dates. Contact your manager if you need clarification.',
      category: 'general',
    },
  ];

  const employeeFaqs = [
    {
      id: 'e1',
      question: 'Can I edit my leave request after submitting?',
      answer:
        'Currently, you cannot edit submitted leave requests. If you need changes, you can reject your own request (if possible) and resubmit with new details. Contact your manager for assistance.',
      category: 'employee',
    },
    {
      id: 'e2',
      question: 'How long does it take for leave approval?',
      answer:
        'Leave requests are typically reviewed within 1-2 business days. Your manager will notify you once a decision is made. Urgent requests may be prioritized.',
      category: 'employee',
    },
    {
      id: 'e3',
      question: 'Can I apply for leave on weekends?',
      answer:
        'The system accepts leave applications for any dates, but weekends may not count towards your leave balance depending on company policy. Check with your HR department for specific guidelines.',
      category: 'employee',
    },
  ];

  const managerFaqs = [
    {
      id: 'm1',
      question: 'How do I approve or reject leave requests?',
      answer:
        'Navigate to "Approve Leaves" from the sidebar. You will see all pending leave requests from your team. Click "Approve" to accept or "Reject" to deny with a reason.',
      category: 'manager',
    },
    {
      id: 'm2',
      question: 'Can I see leave history for my team?',
      answer:
        'You can view pending leave requests in the "Approve Leaves" section. For historical data and team analytics, contact your HR administrator.',
      category: 'manager',
    },
    {
      id: 'm3',
      question: 'What happens when I reject a leave request?',
      answer:
        'When you reject a leave request, the employee is notified with the rejection reason you provided. They can then resubmit with different dates or reasons.',
      category: 'manager',
    },
  ];

  const allFaqs =
    selectedCategory === 'general'
      ? generalFaqs
      : selectedCategory === 'employee'
        ? employeeFaqs
        : managerFaqs;

  const guideSteps = [
    {
      title: 'Access Dashboard',
      description: 'Log in with your credentials to access the main dashboard.',
      icon: '🔐',
      steps: ['Go to the login page', 'Enter your email and password', 'Click "Sign In"'],
    },
    {
      title: 'Navigate Your Profile',
      description: 'Update your personal information and view leave statistics.',
      icon: '👤',
      steps: [
        'Click "My Profile" in the sidebar',
        'View your personal details',
        'Click "Edit Profile" to make changes',
        'Save your updates',
      ],
    },
    {
      title: 'Manage Your Leaves',
      description: 'Apply for leaves and track their status.',
      icon: '📅',
      steps: [
        'Click "Apply Leave" (for employees) or "My Leaves" to view requests',
        'Select leave type, dates, and reason',
        'Submit the form',
        'Check status in "My Leaves"',
      ],
    },
    {
      title: 'Manager Approval Process',
      description: 'Review and approve/reject team member leave requests.',
      icon: '✅',
      steps: [
        'Go to "Approve Leaves"',
        'Review pending requests with team member details',
        'Click "Approve" or "Reject"',
        'Provide rejection reason if needed',
      ],
    },
  ];

  return (
    <DashboardLayout title="Help & Guide" activeTab="Help & Guide">
      <div className="space-y-8">
        {/* Getting Started Guide */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Getting Started Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guideSteps.map((step) => (
              <Card
                key={step.title}
                className="p-6 border-0 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{step.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    <ol className="space-y-2 text-sm">
                      {step.steps.map((stepItem, idx) => (
                        <li key={idx} className="flex gap-2 text-gray-700">
                          <span className="font-bold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                          <span>{stepItem}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'general', label: 'General', icon: '❓' },
              { id: 'employee', label: 'For Employees', icon: '👥' },
              { id: 'manager', label: 'For Managers', icon: '👔' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {allFaqs.map((faq) => (
              <Card
                key={faq.id}
                className="p-0 border-0 shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors text-left"
                >
                  <h3 className="font-bold text-gray-800 pr-4">{faq.question}</h3>
                  <div
                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform ${
                      expandedFaqId === faq.id ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                {expandedFaqId === faq.id && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Video Tutorials Section */}
        <Card className="p-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🎥</span>
            <h2 className="text-2xl font-bold text-gray-800">Video Tutorials</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Video tutorials coming soon! We're preparing comprehensive guides to help you navigate
            the system more effectively.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
              <p className="font-semibold text-gray-800">How to Apply for Leave</p>
              <p className="text-gray-600 text-sm mt-1">Coming Soon</p>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
              <p className="font-semibold text-gray-800">Managing Leave Requests (Manager)</p>
              <p className="text-gray-600 text-sm mt-1">Coming Soon</p>
            </div>
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-8 border-0 shadow-md bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">📞</span>
            <h2 className="text-2xl font-bold text-gray-800">Need More Help?</h2>
          </div>
          <p className="text-gray-700 mb-4">
            If you can't find the answer you're looking for, please reach out to our HR team:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Email:</span> hr@company.com
            </p>
            <p>
              <span className="font-semibold">Phone:</span> +1 (555) 123-4567
            </p>
            <p>
              <span className="font-semibold">Office Hours:</span> Monday - Friday, 9 AM - 5 PM
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
