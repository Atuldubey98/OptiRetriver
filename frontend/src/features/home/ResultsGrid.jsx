import { Box, Grid, Typography } from "@mui/material";
import ResultCard from "./ResultCard";

export default function ResultsGrid({ results, search }) {
  return (
    <Box>
      <Grid container spacing={2}>
        {results.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ResultCard item={item} search={search} />
          </Grid>
        ))}

        {results.length === 0 && search && (
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
