// components/Alert.tsx
'use client';
// hola
import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

type AlertProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
};

export default function Alert({
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
}: AlertProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, onClose]);

  const alertClasses = {
    success: 'bg-emerald-50 border-emerald-500 text-emerald-700',
    error: 'bg-red-50 border-red-500 text-red-700',
    warning: 'bg-amber-50 border-amber-500 text-amber-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
  };

  const alertIcons = {
    success: <CheckCircle size={20} className="mr-2 flex-shrink-0" />,
    error: <AlertCircle size={20} className="mr-2 flex-shrink-0" />,
    warning: <AlertTriangle size={20} className="mr-2 flex-shrink-0" />,
    info: <Info size={20} className="mr-2 flex-shrink-0" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative border-l-4 p-4 mb-4 rounded-md shadow-sm ${alertClasses[type]}`}
      role="alert"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
      <div className="flex items-start">
        {alertIcons[type]}
        <p className="font-medium flex-1">{message}</p>
      </div>
    </motion.div>
  );
}