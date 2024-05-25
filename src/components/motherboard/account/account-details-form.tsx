'use client';

import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';

export function AccountDetailsForm(): React.JSX.Element {
  const [userlimit, setUserlimit] = React.useState<number | string>('');
  const [memory, setMemory] = React.useState<number | string>('');
  const [cores, setCores] = React.useState<number | string>('');
  const [sockets, setSockets] = React.useState<number | string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      setError('No token found');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:8000/motherboard/account',
        {
          userlimit: Number(userlimit),
          memory: Number(memory),
          cores: Number(cores),
          sockets: Number(sockets),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setSuccess('Details updated successfully');
      } else {
        setError('Failed to update details');
      }
    } catch (err) {
      setError('An error occurred while updating details');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>User Limit</InputLabel>
                <OutlinedInput
                  label="User Limit"
                  name="userlimit"
                  type="number"
                  value={userlimit}
                  onChange={(e) => setUserlimit(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Memory (GB)</InputLabel>
                <OutlinedInput
                  label="Memory"
                  name="memory"
                  type="number"
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Cores</InputLabel>
                <OutlinedInput
                  label="Cores"
                  name="cores"
                  type="number"
                  value={cores}
                  onChange={(e) => setCores(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Sockets</InputLabel>
                <OutlinedInput
                  label="Sockets"
                  name="sockets"
                  type="number"
                  value={sockets}
                  onChange={(e) => setSockets(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Save details</Button>
        </CardActions>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Card>
    </form>
  );
}
