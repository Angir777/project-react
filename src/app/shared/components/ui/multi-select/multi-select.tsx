import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shadcn/components/ui/command';
import { cn } from '@/shadcn/lib/utils';

interface MultiSelectProps<T> {
  id?: string;
  items: T[];
  /** Selected values (Angular ng-select `bindValue`). */
  value: string[];
  onChange: (value: string[]) => void;
  /** Value of an item (Angular ng-select `bindValue`). */
  bindValue: (item: T) => string;
  /** Label of an item (Angular ng-select `bindLabel`). */
  bindLabel: (item: T) => string;
  /** Option template (Angular `ng-option-tmp`). */
  renderOption?: (item: T) => ReactNode;
  loading?: boolean;
  notFoundText: string;
  loadingText: string;
}

/**
 * Searchable multi-select with removable chips (Angular: `ng-select [multiple]="true"`).
 */
export function MultiSelect<T>({
  id,
  items,
  value,
  onChange,
  bindValue,
  bindLabel,
  renderOption,
  loading = false,
  notFoundText,
  loadingText,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedItems = items.filter((item) => value.includes(bindValue(item)));

  const toggle = (itemValue: string) => {
    onChange(
      value.includes(itemValue) ? value.filter((v) => v !== itemValue) : [...value, itemValue],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id={id}
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className={cn(
            'relative flex min-h-9 w-full cursor-pointer items-center gap-1 rounded-[4px] border border-[#ccc] bg-background py-1 dark:border-zinc-800 pr-14 pl-2 text-sm text-foreground outline-none',
            open &&
              'border-ring shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_50%,transparent)]',
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <span
                key={bindValue(item)}
                className="inline-flex items-center overflow-hidden rounded-sm border border-border bg-accent text-xs text-accent-foreground"
              >
                <button
                  type="button"
                  className="cursor-pointer border-r border-border px-1.5 py-0.5 hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(bindValue(item));
                  }}
                  aria-label="Remove"
                >
                  ×
                </button>
                <span className="px-1.5 py-0.5">{bindLabel(item)}</span>
              </span>
            ))}
          </div>

          {value.length > 0 && (
            <button
              type="button"
              aria-label="Clear all"
              className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation();
                onChange([]);
              }}
            >
              <X className="size-3.5" />
            </button>
          )}

          <span className="absolute top-1/2 right-3 h-0 w-0 -translate-y-1/2 border-x-[5px] border-t-[5px] border-b-[2.5px] border-x-transparent border-t-[#999] border-b-transparent" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={2}
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput />
          <CommandList>
            {loading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</div>
            ) : (
              <>
                <CommandEmpty>{notFoundText}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    const itemValue = bindValue(item);
                    const isSelected = value.includes(itemValue);

                    return (
                      <CommandItem
                        key={itemValue}
                        value={bindLabel(item)}
                        onSelect={() => toggle(itemValue)}
                        className={cn('cursor-pointer', isSelected && 'bg-accent/60')}
                      >
                        {renderOption ? renderOption(item) : bindLabel(item)}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
