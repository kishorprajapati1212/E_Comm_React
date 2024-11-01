import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

const AlertPopup = ({ message, severity, open, setOpen }) => {
  const [progress, setProgress] = useState(0);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            // return 100;
          }
          return Math.min(oldProgress + 7, 100);
        });
      }, 100); // Adjust for smoothness
      return () => {
        clearInterval(timer);
      };
    }
  }, [open]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{mt: "60px"}}
    >
      <MuiAlert elevation={6} variant="filled" severity={severity} onClose={handleClose} sx={{  position: 'relative' }}>
        {message}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 4,
            backgroundColor: severity === 'error' ? '#ffcccc' : '#b3ffcc',
            '& .MuiLinearProgress-bar': {
              backgroundColor: severity === 'error' ? '#ff0000' : '#00b300',
            },
          }}
        />
      </MuiAlert>
    </Snackbar>
  );
};

export default AlertPopup;
