import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Checkbox,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useApiCall } from "../../hooks/useApiCall";

export default function ListResultsGrid({ results = [], onDeleted }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const {
    callApi: deleteCall,
    loading: deleting,
    SnackbarElement,
  } = useApiCall({
    method: "DELETE",
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(results.map((r) => r._id));
    } else {
      setSelected([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;

    const payload = results
      .filter((r) => selected.includes(r._id))
      .map(({ _id, type }) => ({ _id, type }));

    await deleteCall({
      url: "/list",
      method: "DELETE",
      data: payload,
      headers: { "Content-Type": "application/json" },
    });

    setSelected([]);
    if (onDeleted) onDeleted();
  };

  // Filter results by search query (name, type, or mimeType)
  const filteredResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return results;
    return results.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.mimeType?.toLowerCase().includes(q)
    );
  }, [results, search]);

  if (!results.length) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          No documents found
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%">
      {SnackbarElement}

      {/* Top Action Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={2}
        flexWrap="wrap"
      >
        <Typography variant="h6" fontWeight={600}>
          Uploaded Documents
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            disabled={!selected.length || deleting}
          >
            {deleting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Delete Selected"
            )}
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selected.length > 0 &&
                    selected.length === filteredResults.length
                  }
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filteredResults.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>MIME Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredResults.length ? (
              filteredResults.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row._id)}
                      onChange={() => handleRowSelect(row._id)}
                    />
                  </TableCell>

                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.mimeType}</TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.8rem", color: "#666" }}
                  >
                    {row._id}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No matching documents found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
