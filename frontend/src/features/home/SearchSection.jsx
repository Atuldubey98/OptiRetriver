import { Box } from "@mui/material";
import FilterSelect from "./FilterSelect";
import SearchBar from "./SearchBar";

export default function SearchSection({ query, filter, onQueryChange, onFilterChange }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        maxWidth: 650,
        width: "100%",
      }}
    >
      <FilterSelect value={filter} onChange={onFilterChange} />
      <SearchBar value={query} onChange={onQueryChange} />
    </Box>
  );
}
