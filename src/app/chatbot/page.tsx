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
import { ChatbotTable } from '@/components/chatbot/chatbot';

import Layout from '../layout';

export const metadata = { title: `${config.site.name} | chatbot` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  // const paginatedsummary = applyPagination(summary, page, rowsPerPage);

  return <ChatbotTable />;
}
