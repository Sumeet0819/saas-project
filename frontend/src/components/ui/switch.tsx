'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export function Switch({ className, ...props }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#079B68] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'data-[checked]:bg-[#079B68] bg-[#E6E9E7] dark:bg-white/20',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out',
          'data-[checked]:translate-x-4 translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}
