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
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials({ token: response.token, user: response.user }));
      authStorage.setAuth(response.token, response.user);
      
      toast.success(MESSAGES.LOGIN.SUCCESS);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(MESSAGES.LOGIN.ERROR);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full max-w-sm">
      <TextField
        label={MESSAGES.LOGIN.USER_ID_LABEL}
        placeholder={MESSAGES.LOGIN.USER_ID_PLACEHOLDER}
        autoComplete="username"
        disabled={isLoading}
        error={errors.userId?.message}
        {...register('userId')}
      />

      <PasswordField
        label={MESSAGES.LOGIN.PASSWORD_LABEL}
        placeholder={MESSAGES.LOGIN.PASSWORD_PLACEHOLDER}
        disabled={isLoading}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex justify-start">
        <a href="#" className="text-sm text-primary hover:underline underline-offset-4">
          {MESSAGES.LOGIN.FORGOT_PASSWORD}
        </a>
      </div>

      {error && (
        <ErrorState message={MESSAGES.LOGIN.INVALID_CREDENTIALS} />
      )}

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        loadingText={MESSAGES.LOGIN.BUTTON_LOADING}
        className="w-full h-11 mt-2 text-base font-semibold bg-blue-600 hover:bg-blue-700"
      >
        {MESSAGES.LOGIN.BUTTON_DEFAULT}
      </LoadingButton>
    </form>
  );
}
