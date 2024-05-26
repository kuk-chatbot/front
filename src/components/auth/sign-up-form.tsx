'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, Select, Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient, SignUpParams } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';

const schema = zod.object({
  username: zod.string().min(1, { message: 'User name is required' }),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  name: zod.string().min(1, { message: 'Name is required' }),
  role: zod.string().min(1, { message: 'Role is required' }),
  userlimit: zod.number().optional(),
  memory: zod.number().optional(),
  cores: zod.number().optional(),
  sockets: zod.number().optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  username: '',
  password: '',
  name: '',
  role: 'PERSONAL',
  userlimit: 0,
  memory: 0,
  cores: 0,
  sockets: 0,
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

      const { role, username, name, password, userlimit, memory, cores, sockets } = values;
      let signUpParams: Partial<SignUpParams> = { role, username, name, password };

      if (role === 'ENTERPRISE') {
        signUpParams = { ...signUpParams, userlimit, memory, cores, sockets };
      }

      const { error } = await authClient.signUp(signUpParams as SignUpParams);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      router.push(paths.auth.signIn);
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
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>User Name</InputLabel>
                <OutlinedInput {...field} label="User Name" />
                {errors.username ? <FormHelperText>{errors.username.message}</FormHelperText> : null}
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
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>Name</InputLabel>
                <OutlinedInput {...field} label="Name" />
                {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
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
                  <MenuItem value="PERSONAL">PERSONAL</MenuItem>
                  <MenuItem value="ENTERPRISE">ENTERPRISE</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {role === 'ENTERPRISE' && (
            <Stack spacing={2}>
              <Typography color="text.secondary" variant="body2">
                Design your service performance
              </Typography>
              <Controller
                control={control}
                name="userlimit"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.userlimit)}>
                    <InputLabel>User Limit</InputLabel>
                    <Select
                      {...field}
                      label="User Limit"
                    >
                      <MenuItem value="" disabled>
                    <em>Select Userlimit</em>
                      </MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={75}>75</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                    {errors.userlimit ? <FormHelperText>{errors.userlimit.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="memory"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.memory)}>
                    <InputLabel>Memory</InputLabel>
                    <Select
                      {...field}
                      label="Memory"
                      displayEmpty
                      renderValue={(selected) => (selected ? `${selected}GB` : '')}
                      onChange={(event) => field.onChange(parseInt(event.target.value as string))}
                    >
                      <MenuItem value="" disabled>
                        <em>Select Memory</em>
                      </MenuItem>
                      <MenuItem value={8}>8GB</MenuItem>
                      <MenuItem value={16}>16GB</MenuItem>
                      <MenuItem value={32}>32GB</MenuItem>
                      <MenuItem value={64}>64GB</MenuItem>
                    </Select>
                    {errors.memory ? <FormHelperText>{errors.memory.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="cores"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.cores)}>
                    <InputLabel>Cores</InputLabel>
                    <Select
                      {...field}
                      label="Cores"
                    >
                      <MenuItem value="" disabled>
                      <em>Select the number of cores</em>
                      </MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={16}>16</MenuItem>
                      <MenuItem value={32}>32</MenuItem>
                    </Select>
                    {errors.cores ? <FormHelperText>{errors.cores.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="sockets"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.sockets)}>
                    <InputLabel>Sockets</InputLabel>
                    <Select
                      {...field}
                      label="Sockets"
                    >
                      <MenuItem value="" disabled>
                      <em>Select the number of CPU</em>
                      </MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                    </Select>
                    {errors.sockets ? <FormHelperText>{errors.sockets.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Stack>
          )}
          <Button disabled={isPending} type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
