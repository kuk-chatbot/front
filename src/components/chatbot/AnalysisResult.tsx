import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface AnalysisResultProps {
  open: boolean;
  onClose: () => void;
  result: string;
  resultImage: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ open, onClose, result, resultImage }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Analysis Result</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{result}</Typography>
        {resultImage && <img src={resultImage} alt="Analysis Result" style={{ width: '100%', marginTop: '10px' }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalysisResult;
