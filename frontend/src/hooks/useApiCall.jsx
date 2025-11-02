import { useState, useCallback } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function useApiCall(initialConfig) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const callApi = useCallback(async (overrideConfig) => {
    setLoading(true);
    try {
      const config = { ...initialConfig, ...overrideConfig };
      const response = await api(config);
      setData(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      setSnackbar({ open: true, message });
    } finally {
      setLoading(false);
    }
  }, [initialConfig]);

  const snackbarAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const SnackbarElement = (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={snackbar.message}
      action={snackbarAction}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );

  return { data, loading, callApi, SnackbarElement };
}
