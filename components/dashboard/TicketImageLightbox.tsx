'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
};

export function TicketImageLightbox({
  imageUrl,
  alt,
  isOpen,
  onClose,
}: Props) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ maxWidth: '24rem', maxHeight: '24rem', scale: 0.8 }}
            animate={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              scale: 1,
            }}
            exit={{ maxWidth: '24rem', maxHeight: '24rem', scale: 0.8 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative flex flex-col overflow-hidden rounded-lg',
              'bg-white shadow-2xl ring-1 ring-black/10',
            )}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1.5 text-white hover:bg-black/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt}
              className="max-h-[90vh] w-auto max-w-[90vw] object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

