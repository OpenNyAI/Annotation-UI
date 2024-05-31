import { Box, Grid, Typography } from "@mui/material";
export const NotFound = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      alignItems="center"
      gap={6}
    >
      <Grid item xs>
        <Box />
      </Grid>
      <Grid item xs>
        <Box />
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ padding: 1, textAlign: "center" }}>
          <Typography variant="h1" mb={2}>
            <span className="introduction-jiva-heading">404</span>
          </Typography>
          <Typography variant="h3" fontWeight={800} mb={2}>
            Page Not Found
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Error;
