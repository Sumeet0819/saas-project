'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

interface DataGridProps<T> {
  data?: T[];
  keyExtractor?: (item: T) => string;
  renderItem?: (item: T, index: number) => React.ReactNode;
  children?: React.ReactNode;
  columnsClassName?: string;
  className?: string;
}

export function DataGrid<T>({
  data,
  keyExtractor,
  renderItem,
  children,
  columnsClassName = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  className = '',
}: DataGridProps<T>) {
  if (children) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`grid ${columnsClassName} gap-4 ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  if (!data || !renderItem) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${columnsClassName} gap-4 ${className}`}
    >
      {data.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item) : String(index);
        return (
          <motion.div key={key} variants={fadeItem}>
            {renderItem(item, index)}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
