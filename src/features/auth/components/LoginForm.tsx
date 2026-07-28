import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { useLoginMutation } from '@/services/authApi';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '../authSlice';
import { authStorage } from '../authStorage';
import { TextField } from '@/components/forms/TextField';
import { PasswordField } from '@/components/forms/PasswordField';
import { LoadingButton } from '@/components/common/LoadingButton';
import { ErrorState } from '@/components/common/ErrorState';
import { MESSAGES } from '@/constants/messages';
import { ROUTES } from '@/constants/routes';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials({ token: response.token, user: response.user }));
      authStorage.setAuth(response.token, response.user);

      toast.success(MESSAGES.LOGIN.SUCCESS);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err: any) {
      const errMsg = err?.status === 'FETCH_ERROR'
        ? 'Network connection failed. Please check your internet connection.'
        : (err?.data?.message || MESSAGES.LOGIN.ERROR);
      toast.error(errMsg);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      if (error.status === 'FETCH_ERROR') {
        return 'Network connection failed. Please check your internet connection.';
      }
      if (error.status === 500) {
        return 'An unexpected server error occurred. Please try again later.';
      }
      const data = error.data as { message?: string } | undefined;
      return data?.message ?? MESSAGES.LOGIN.INVALID_CREDENTIALS;
    }
    return 'An unexpected error occurred.';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 w-full">
      <TextField
        label={MESSAGES.LOGIN.USER_ID_LABEL}
        placeholder={MESSAGES.LOGIN.USER_ID_PLACEHOLDER}
        autoComplete="username"
        disabled={isLoading}
        error={errors.userId?.message}
        className="h-12 rounded-lg text-sm"
        {...register('userId')}
      />

      <PasswordField
        label={MESSAGES.LOGIN.PASSWORD_LABEL}
        placeholder={MESSAGES.LOGIN.PASSWORD_PLACEHOLDER}
        disabled={isLoading}
        error={errors.password?.message}
        className="h-12 rounded-lg text-sm"
        {...register('password')}
      />

      {/* Forgot password — Figma: blue, regular weight, left-aligned */}
      <div className="flex justify-start mt-2">
        <a
          href="#"
          className="text-sm font-normal text-blue-500 hover:text-blue-600 hover:underline underline-offset-4 transition-colors"
        >
          {MESSAGES.LOGIN.FORGOT_PASSWORD}
        </a>
      </div>

      {error && (
        <ErrorState message={getErrorMessage()} />
      )}

      {/* Button disabled until form is valid — reuses react-hook-form isValid */}
      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText={MESSAGES.LOGIN.BUTTON_LOADING}
        disabled={!isValid || isLoading}
        className="w-full h-12 mt-1 text-base font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {MESSAGES.LOGIN.BUTTON_DEFAULT}
      </LoadingButton>
    </form>
  );
}
