export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // In a real app, this would integrate with a toast library like react-hot-toast
  // For now, we'll just log to console
  console.log(`[${type.toUpperCase()}] ${message}`);
};
