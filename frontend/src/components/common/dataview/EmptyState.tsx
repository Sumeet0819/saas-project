'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'framer-motion';

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ElementType;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-12 text-center shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
    >
      <div className="w-12 h-12 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
        <Icon size={20} className="text-[#929994]" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">{title}</p>
      <p className="text-xs text-[#929994] max-w-sm mx-auto mb-5">{description}</p>
      {actionText && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="h-8 text-xs bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer shadow-sm gap-1"
        >
          {ActionIcon && <ActionIcon size={13} />}
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}
