'use client';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import * as React from 'react';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  const handleUnselect = React.useCallback(
    (item: string) => {
      onChange(selected.filter(i => i !== item));
    },
    [onChange, selected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '' && selected.length > 0) {
            onChange(selected.slice(0, -1));
          }
        }
        if (e.key === 'Escape') {
          setOpen(false);
          input.blur();
        }
        if (e.key === 'Enter' && inputValue === '') {
          // Close dropdown on Enter if no search value
          setOpen(false);
        }
      }
    },
    [onChange, selected, inputValue]
  );

  // Filter options based on input value if there's any search input
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const onValueChangeHandler = React.useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter(item => item !== value));
      } else {
        onChange([...selected, value]);
      }
      setInputValue(''); // Clear input after selection
      // Keep the dropdown open for multiple selections
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange, selected]
  );

  return (
    <Command
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map(item => {
            const option = options.find(opt => opt.value === item);
            if (!option) return null;
            return (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={e => {
              // Only close if focus is moving outside the component
              if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                setTimeout(() => setOpen(false), 100);
              }
            }}
            onFocus={() => setOpen(true)}
            placeholder={
              selected.length === 0
                ? placeholder
                : open
                ? 'Type to search or press Escape to close...'
                : undefined
            }
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            disabled={disabled}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-60">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onValueChangeHandler(option.value);
                      }}
                      onMouseDown={e => {
                        // Prevent the input from losing focus
                        e.preventDefault();
                      }}
                      disabled={option.disabled}
                      className="cursor-pointer"
                    >
                      <div
                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                          selected.includes(option.value)
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50'
                        }`}
                      >
                        {selected.includes(option.value) && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })
              ) : (
                <div className="py-2 px-3 text-sm text-muted-foreground">
                  {inputValue ? 'No options found' : 'No options available'}
                </div>
              )}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
