import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '80vh'
      }}
    >
      <Box sx={{
        fontSize: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p>Loading...</p>
        <CircularProgress color="inherit" />
      </Box>
    </Box>
  );
} 