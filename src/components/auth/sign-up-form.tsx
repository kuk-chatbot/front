'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLabel, MenuItem, Radio, RadioGroup, Select, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  userName: zod.string().min(1, { message: 'User name is required' }),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  role: zod.string().min(1, { message: 'Role is required' }),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
  concurrentUserCount: zod.string().min(1, { message: 'input number!' }),
  availableRAM: zod.string().min(1, { message: 'check' }),
  cpuType: zod.string().min(1, { message: 'check' }),
  cpuCount: zod.string().min(1, { message: 'check' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  userName: '',
  password: '',
  role: '',
  terms: false,
  concurrentUserCount: '',
  availableRAM: '',
  cpuType: '',
  cpuCount: '',
} satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { error } = await authClient.signUp(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router
      // After refresh, GuestGuard will handle the redirect
      router.refresh();
    },
    [checkSession, router, setError]
  );

  const role = watch('role');

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.userName)}>
                <InputLabel>User Name</InputLabel>
                <OutlinedInput {...field} label="User Name" />
                {errors.userName ? <FormHelperText>{errors.userName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <FormControl>
                <InputLabel>Role</InputLabel>
                <Select {...field} label="Role">
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {role === 'enterprise' && (
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                Design your service performance
              </Typography>
              <Controller
                control={control}
                name="concurrentUserCount"
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>동시 사용자 수</InputLabel>
                    <OutlinedInput {...field} type="number" label="동시 사용자 수" />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="availableRAM"
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>메모리</InputLabel>
                    <Select {...field} label="메모리">
                      <MenuItem value="1GiB">1 GiB 메모리</MenuItem>
                      <MenuItem value="2GiB">2 GiB 메모리</MenuItem>
                      <MenuItem value="4GiB">4 GiB 메모리</MenuItem>
                      <MenuItem value="8GiB">8 GiB 메모리</MenuItem>
                      <MenuItem value="16GiB">16 GiB 메모리</MenuItem>
                      <MenuItem value="32GiB">32 GiB 메모리</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="cpuType"
                render={({ field }) => (
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">CPU 아키텍처</FormLabel>
                    <RadioGroup
                      row
                      {...field}
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="64비트(x86)"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel value="64비트(x86)" control={<Radio />} label="64비트(x86)" />
                      <FormControlLabel value="64비트(Arm)" control={<Radio />} label="64비트(Arm)" />
                    </RadioGroup>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="cpuCount"
                render={({ field }) => (
                  <FormControl>
                    <InputLabel>가상 CPU 수</InputLabel>
                    <Select {...field} label="가상 CPU 수">
                      <MenuItem value="1vCPU">1 vCPU</MenuItem>
                      <MenuItem value="2vCPU">2 vCPU</MenuItem>
                      <MenuItem value="4vCPU">4 vCPU</MenuItem>
                      <MenuItem value="8vCPU">8 vCPU</MenuItem>
                      <MenuItem value="16vCPU">16 vCPU</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>
          )}

          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      I have read the <Link>terms and conditions</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
      <Alert color="warning">Created users are not persisted</Alert>
    </Stack>
  );
}
