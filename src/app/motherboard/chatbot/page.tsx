import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

/*센드버드 UI kit*/

import '@sendbird/uikit-react/dist/index.css';

/*----*/
import dayjs from 'dayjs';

import { config } from '@/config';
import { summaryTable } from '@/components/motherboard/chatbot/chatbot';
import { summaryFilters } from '@/components/motherboard/summary/summary-filters';
import type { Customer } from '@/components/motherboard/summary/summary-table';

export const metadata = { title: `summary | motherboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  // const paginatedsummary = applyPagination(summary, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">summary</Typography>
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
      <summaryFilters />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
