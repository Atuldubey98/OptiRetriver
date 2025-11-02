import { Select, MenuItem } from "@mui/material";

export default function FilterSelect({ value, onChange }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        minWidth: 120,
        borderRadius: "10px",
        height: "40px",
      }}
    >
      <MenuItem value="general">General</MenuItem>
      <MenuItem value="invoice">Invoices</MenuItem>
    </Select>
  );
}
