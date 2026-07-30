import { forwardRef } from 'react';
import { TextField, type TextFieldProps } from './TextField';

export type PasswordFieldProps = Omit<TextFieldProps, 'type'>;

// reusable password field for form login
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  return <TextField type="password" autoComplete="current-password" ref={ref} {...props} />;
});

PasswordField.displayName = 'PasswordField';
