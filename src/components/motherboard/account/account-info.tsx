'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  userlimit?: number;
  memory?: number;
  cores?: number;
  sockets?: number;
}

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('custom-auth-token');

      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/motherboard/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src="/assets/avatar.png" sx={{ height: 80, width: 80 }} />
          <Typography variant="h5">{user.name}</Typography>
          <Typography color="text.secondary" variant="body2">
            {user.username}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Role: {user.role}
          </Typography>
        </Stack>
        {user.role !== 'PERSONAL' && (
          <>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  User Limit
                </Typography>
                <Typography variant="h6">{user.userlimit}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Memory
                </Typography>
                <Typography variant="h6">{user.memory} GB</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Cores
                </Typography>
                <Typography variant="h6">{user.cores}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Sockets
                </Typography>
                <Typography variant="h6">{user.sockets}</Typography>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="contained">
          Upload Picture
        </Button>
      </CardActions>
    </Card>
  );
}
