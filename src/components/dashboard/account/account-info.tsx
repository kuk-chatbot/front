'use client';

import * as React from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

interface User {
  id: number;
  username: string;
  name: string;
  role: string;
  userlimit: number;
  memory: number;
  cores: number;
  sockets: number;
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
        const response = await axios.get('http://localhost:8000/dashboard/account', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src="/assets/avatar.png" sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.city} {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.role}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
