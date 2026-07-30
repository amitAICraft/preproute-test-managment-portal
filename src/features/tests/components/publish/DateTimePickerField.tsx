//DateTimePickerField
import { useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';


// Native input — full-area, functionally active, visually invisible browser chrome
const NATIVE_INPUT_BASE =
  'block h-12 w-full rounded-lg border bg-white px-4 pr-10 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#7489FF]/50 cursor-pointer ' +
  '[color-scheme:light] ' +
  // hide the native calendar / clock button Chrome/Edge/Safari
  '[&::-webkit-calendar-picker-indicator]:opacity-0 ' +
  '[&::-webkit-calendar-picker-indicator]:absolute ' +
  '[&::-webkit-calendar-picker-indicator]:inset-0 ' +
  '[&::-webkit-calendar-picker-indicator]:w-full ' +
  '[&::-webkit-calendar-picker-indicator]:h-full ' +
  '[&::-webkit-calendar-picker-indicator]:cursor-pointer ' +
  // hide inner spin button (Chrome time AM/PM spinner)
  '[&::-webkit-inner-spin-button]:hidden ' +
  '[&::-webkit-clear-button]:hidden';

const OVERLAY_BASE =
  'pointer-events-none absolute inset-0 flex items-center px-4 pr-10 text-sm select-none';
//icon wrapper
const ICON_WRAPPER =
  'absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none';

//Date picker field
export interface DatePickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

export function DatePickerField({
  id,
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
  className,
}: DatePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <div className="relative w-full">
        {/* Native input — functional picker, browser chrome hidden via CSS */}
        <input
          ref={inputRef}
          type="date"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          className={cn(
            NATIVE_INPUT_BASE,
            error ? 'border-red-400' : 'border-slate-200',
            // When no value, make the native date segments transparent so our overlay shows
            !value ? 'text-transparent' : 'text-slate-800',
          )}
        />

        {/* Custom placeholder — visible only when no value selected */}
        {!value && (
          <div className={cn(OVERLAY_BASE, 'text-slate-400')} aria-hidden="true">
            {placeholder}
          </div>
        )}

        {/* Calendar icon — right-aligned, vertically centred */}
        <div className={ICON_WRAPPER}>
          <Calendar className="size-5" />
        </div>
      </div>

      {/* Reserve a fixed-height row for validation message so layout never jumps */}
      <div className="flex h-4 items-start">
        {error && errorMessage && (
          <p className="text-xs leading-none text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}



//TimePickerField

export interface TimePickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
  errorMessage?: string;
  className?: string;
}

export function TimePickerField({
  id,
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
  className,
}: TimePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <div className="relative w-full">
        {/* Native input — functional picker, browser chrome hidden via CSS */}
        <input
          ref={inputRef}
          type="time"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={openPicker}
          className={cn(
            NATIVE_INPUT_BASE,
            error ? 'border-red-400' : 'border-slate-200',
            !value ? 'text-transparent' : 'text-slate-800',
          )}
        />

        {/* Custom placeholder — visible only when no value selected */}
        {!value && (
          <div className={cn(OVERLAY_BASE, 'text-slate-400')} aria-hidden="true">
            {placeholder}
          </div>
        )}

        {/* ChevronDown icon — right-aligned, vertically centred */}
        <div className={ICON_WRAPPER}>
          <ChevronDown className="size-5" />
        </div>
      </div>

      {/* Reserve a fixed-height row for validation message so layout never jumps */}
      <div className="flex h-4 items-start">
        {error && errorMessage && (
          <p className="text-xs leading-none text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
