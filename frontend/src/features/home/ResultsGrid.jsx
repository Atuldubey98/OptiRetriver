import { Box, Grid, Typography } from "@mui/material";
import ResultCard from "./ResultCard";

export default function ResultsGrid({ results, search }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mt: 4, px: 2 }}>
      <Grid container spacing={2}>
        {results.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ResultCard item={item} search={search} />
          </Grid>
        ))}

        {results.length === 0 && (
          <Box
            width="100%"
            alignItems="center"
            justifyContent="center"
            display="flex"
            mt={4}
          >
            <Typography color="textSecondary">No result found</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}
