import { FormField } from './FormField';
import { RadioGroup, type RadioOption } from '@/components/ui/radio-group';

export interface RadioGroupFieldProps {
  label: string;
  name: string;
  error?: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
// Reusable Radiogroup field
export function RadioGroupField({
  label,
  name,
  error,
  options,
  value,
  onChange,
  className,
}: RadioGroupFieldProps) {
  return (
    <FormField label={label} name={name} error={error} className={className}>
      <RadioGroup options={options} value={value} onChange={onChange} name={name} />
    </FormField>
  );
}
