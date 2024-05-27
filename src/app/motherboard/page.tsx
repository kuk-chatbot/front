import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/motherboard/overview/budget';
import { LatestOrders } from '@/components/motherboard/overview/latest-orders';
import { LatestProducts } from '@/components/motherboard/overview/latest-products';
import { Sales } from '@/components/motherboard/overview/sales';
import { TasksProgress } from '@/components/motherboard/overview/tasks-progress';
import { Totalsummary } from '@/components/motherboard/overview/total-summary';
import { TotalProfit } from '@/components/motherboard/overview/total-profit';
import { Traffic } from '@/components/motherboard/overview/traffic';

export const metadata = { title: `Overview | motherboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="148" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <Totalsummary diff={16} trend="down" sx={{ height: '100%' }} value="10" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={70.2} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="GOOD" />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['KUK-001', 'KUK-002', 'KUK-003']} sx={{ height: '100%' }} />
      </Grid>
      
    
    </Grid>
  );
}
