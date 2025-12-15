// components/Toast.tsx
'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ 
  message, 
  type, 
  duration = 3000,
  onClose 
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${bgColor} text-white animate-fadeIn`}>
      {message}
    </div>
  );
}