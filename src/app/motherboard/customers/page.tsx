import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
/*센드버드 UI kit*/
import { App as SendbirdApp } from '@sendbird/uikit-react';

import '@sendbird/uikit-react/dist/index.css';

/*----*/
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/motherboard/customer/customers-filters';
import { CustomersTable } from '@/components/motherboard/customer/customers-table';
import type { Customer } from '@/components/motherboard/customer/customers-table';

export const metadata = { title: `Customers | motherboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    userName: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    phone: '908-691-3242',
    address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    phone: '415-907-2647',
    address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Jie Yan',
    avatar: '/assets/avatar-8.png',
    phone: '770-635-2682',
    address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    phone: '801-301-7894',
    address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Iulia Albu',
    avatar: '/assets/avatar-6.png',
    phone: '313-812-8947',
    address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    phone: '712-351-5711',
    address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },

  {
    userName: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    phone: '858-602-3409',
    address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    phone: '304-428-3097',
    address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    phone: '702-661-1654',
    address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    userName: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    phone: '972-333-4106',
    address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
