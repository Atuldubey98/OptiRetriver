import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ value, onChange }) {
  return (
    <Box sx={{ position: "relative", flex: 1 }}>
      <SearchIcon
        sx={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          color: "gray",
        }}
      />
      <InputBase
        placeholder="Search..."
        value={value}
        onChange={onChange}
        sx={{
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "10px",
          pl: 5,
          pr: 2,
          py: 0.8,
        }}
        inputProps={{ type: "text" }}
      />
      <button type="submit" style={{ display: "none" }}></button>
    </Box>
  );
}
