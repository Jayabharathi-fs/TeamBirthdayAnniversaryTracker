import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      textAlign="center"
    >
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" mb={2}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/login">
        Go to Login
      </Button>
    </Box>
  );
}

export default Notfound;
