'use client';

import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Summary {
  name: string;
  cause: string;
  modelName: string;
  cpuFanNoScrews: number;
  cpuFanPortDetached: number;
  cpuFanScrewsLoose: number;
  incorrectScrews: number;
  looseScrews: number;
  noScrews: number;
  scratch: number;
  id: number;
}

interface SummaryTableProps {
  count?: number;
  page?: number;
  rows?: Summary[];
  rowsPerPage?: number;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: SummaryTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((summary) => summary.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [data, setData] = React.useState<Summary[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('custom-auth-token');

      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/motherboard/customers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setData(response.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      }
    };

    fetchData();
  }, []);

  const handleImageClick = async (id: number) => {
    try {
      const token = localStorage.getItem('custom-auth-token');

      if (!token) {
        setError('No token found');
        return;
      }

      console.log(`Fetching image for ID: ${id}`);
      const response = await axios.get(`http://localhost:8000/motherboard/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'text' // Ensure response is treated as text
      });

      if (response.status === 200) { // 응답 바디가 base64 문자열
        console.log(`Received image data: ${response.data}`);
        setImageSrc(`data:image/;base64,${response.data}`);
        console.log(`Set imageSrc: data:image/jpeg;base64,${response.dataa}`);
        setOpen(true);
      } else {
        console.error('Failed to fetch image', response);
        setError('Failed to fetch image');
      }
    } catch (err) {
      console.error('An error occurred while fetching image', err);
      setError('An error occurred while fetching image');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImageSrc(null);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        selectAll();
                      } else {
                        deselectAll();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>사용자 이름</TableCell>
                <TableCell>증상</TableCell>
                <TableCell>모델 이름</TableCell>
                <TableCell>결함 정보</TableCell>
                <TableCell>결함 이미지 확인</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                const isSelected = selected?.has(row.id);
                const defects = [
                  { label: 'CPU Fan No Screws', value: row.cpuFanNoScrews },
                  { label: 'CPU Fan Port Detached', value: row.cpuFanPortDetached },
                  { label: 'CPU Fan Screws Loose', value: row.cpuFanScrewsLoose },
                  { label: 'Incorrect Screws', value: row.incorrectScrews },
                  { label: 'Loose Screws', value: row.looseScrews },
                  { label: 'No Screws', value: row.noScrews },
                  { label: 'Scratch', value: row.scratch },
                ].filter(defect => defect.value !== 0);

                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.id);
                          } else {
                            deselectOne(row.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </TableCell>
                    <TableCell>{row.cause}</TableCell>
                    <TableCell>{row.modelName}</TableCell>
                    <TableCell>
                      {defects.map(defect => (
                        <div key={defect.label}>
                          {defect.label}: {defect.value}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Link href="#" onClick={() => handleImageClick(row.id)}>View Image</Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={count}
          onPageChange={noop}
          onRowsPerPageChange={noop}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          {imageSrc && <img src={imageSrc} alt="Defect" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </Box>
      </Modal>
    </>
  );
}
