import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Modal,
  IconButton,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { useApiCall } from "../../hooks/useApiCall";
import SearchSection from "./SearchSection";
import ResultsGrid from "./ResultsGrid";
import ChatAssistant from "./ChatAssistant";
import FilterSelect from "./FilterSelect";
import ListResultsGrid from "./ListResultsGrid";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("general");
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadFilter, setUploadFilter] = useState("general");
  const [tabValue, setTabValue] = useState(0);

  const {
    data: results = [],
    loading,
    callApi,
    SnackbarElement,
  } = useApiCall({ method: "GET" });

  const {
    data: list,
    loading: listLoading,
    callApi: callListApi,
  } = useApiCall({ method: "GET" });

  const {
    callApi: postCall,
    loading: uploading,
    SnackbarElement: UploadSnackBar,
  } = useApiCall({ method: "POST" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    callApi({
      url: "/query",
      params: { type: filter, search: query },
    });
    setTabValue(0);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadFilter);

      await postCall({
        url: `/upload?type=${uploadFilter}`,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      callListApi({ url: `/list` });
      setFile(null);
    } catch (error) {
      throw error;
    } finally {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    callListApi({ url: `/list` });
  }, []);

  const handleRemoveFile = () => setFile(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
      mt={3}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <SearchSection
          query={query}
          filter={filter}
          onQueryChange={(e) => setQuery(e.target.value)}
          onFilterChange={(e) => setFilter(e.target.value)}
        />
        <IconButton color="primary" onClick={() => setOpenModal(true)}>
          <UploadFileIcon />
        </IconButton>
      </form>

      {SnackbarElement}

      {/* Tabs */}
      <Box sx={{ width: "100%", mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Search Results" />
          <Tab label="Uploaded Documents" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box sx={{ width: "100%", mt: 2 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ResultsGrid results={results || []} search={query} />
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ width: "100%", mt: 2 }}>
          {listLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box maxWidth={"95%"} margin={"auto"}>
              <ListResultsGrid results={list || []} onDeleted={()=>{
                callListApi({ url: `/list` });
              }}/>
            </Box>
          )}
        </Box>
      )}

      {/* Upload Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            width: 400,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Upload Document
          </Typography>
          {UploadSnackBar}
          <form
            onSubmit={handleFileUpload}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Button variant="contained" component="label">
              Select File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>

            {file && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    mr: 1,
                  }}
                >
                  {file.name}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleRemoveFile}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <FilterSelect
              value={uploadFilter}
              onChange={(e) => setUploadFilter(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!file || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </Box>
      </Modal>

      <ChatAssistant />
    </Box>
  );
}
