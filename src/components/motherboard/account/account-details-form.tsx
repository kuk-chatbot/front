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
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function AccountDetailsForm(): React.JSX.Element {
  const [userlimit, setUserlimit] = React.useState<string>('');
  const [memory, setMemory] = React.useState<string>('');
  const [cores, setCores] = React.useState<string>('');
  const [sockets, setSockets] = React.useState<string>('');
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
        window.location.reload(); // 페이지 새로고침
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
                <Select
                  label="User Limit"
                  name="userlimit"
                  value={userlimit}
                  onChange={(e) => setUserlimit(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select User Limit</em>
                  </MenuItem>
                  <MenuItem value="25">25</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                  <MenuItem value="75">75</MenuItem>
                  <MenuItem value="100">100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Memory (GB)</InputLabel>
                <Select
                  label="Memory"
                  name="memory"
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select Memory</em>
                  </MenuItem>
                  <MenuItem value="8">8GB</MenuItem>
                  <MenuItem value="16">16GB</MenuItem>
                  <MenuItem value="32">32GB</MenuItem>
                  <MenuItem value="64">64GB</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Cores</InputLabel>
                <Select
                  label="Cores"
                  name="cores"
                  value={cores}
                  onChange={(e) => setCores(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select Cores</em>
                  </MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="16">16</MenuItem>
                  <MenuItem value="32">32</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Sockets</InputLabel>
                <Select
                  label="Sockets"
                  name="sockets"
                  value={sockets}
                  onChange={(e) => setSockets(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select Sockets</em>
                  </MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </Select>
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
