import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '@/shadcn/lib/utils';

/**
 * Switch built on Radix, styled to match `ngx-ui-switch` used by the Angular app
 * (`<ui-switch size="small">`: white track with #dfdfdf border, green rgb(100,189,99) when checked,
 * white knob with shadow).
 */
function Switch({
  className,
  size = 'small',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'small' | 'medium' | 'large';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-[#dfdfdf] bg-white transition-all duration-300 ease-out outline-none dark:bg-transparent focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800',
        'data-[state=checked]:border-[rgb(100,189,99)] data-[state=checked]:bg-[rgb(100,189,99)] dark:data-[state=checked]:bg-[rgb(100,189,99)]',
        'data-[size=small]:h-5 data-[size=small]:w-[33px] data-[size=medium]:h-[30px] data-[size=medium]:w-[50px] data-[size=large]:h-10 data-[size=large]:w-[60px]',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none absolute left-0 block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-all duration-300 ease-out',
          'group-data-[size=small]/switch:size-5 group-data-[size=medium]/switch:size-[30px] group-data-[size=large]/switch:size-10',
          'data-[state=checked]:left-[calc(100%-20px)] group-data-[size=medium]/switch:data-[state=checked]:left-[calc(100%-30px)] group-data-[size=large]/switch:data-[state=checked]:left-[calc(100%-40px)]',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
