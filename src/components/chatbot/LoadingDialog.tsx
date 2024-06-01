import React from 'react';
import { CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface LoadingDialogProps {
  open: boolean;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Loading...</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" style={{ marginTop: 16 }}>
          AI 이미지 심층 분석 중입니다...
        </Typography>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
