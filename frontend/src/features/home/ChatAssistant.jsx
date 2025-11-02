import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useApiCall } from "../../hooks/useApiCall";

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const { callApi } = useApiCall({
    method: "GET",
  });
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I'm OptiAssistant! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const endRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    const response = await callApi({
      url: `/response?search=${input}&type=invoice`,
      method: "GET",
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessages((prev) => [...prev, { from: "bot", text: response }]);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Chat Bubble */}
      {!open && (
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "white",
            boxShadow: 3,
            "&:hover": { bgcolor: "primary.dark" },
            zIndex: 1300,
          }}
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      )}

      {/* Chat Box */}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: isMobile ? 0 : 80,
            right: isMobile ? 0 : 24,
            width: isMobile ? "100%" : 380,
            height: isMobile ? "100vh" : 500,
            borderRadius: isMobile ? 0 : 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1301,
          }}
        >
          {/* Blue Header */}
          <Box
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              OptiAssistant
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "#f5f5f5",
            }}
          >
            <Stack spacing={1.5}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                    bgcolor: msg.from === "user" ? "primary.main" : "grey.300",
                    color: msg.from === "user" ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </Box>
              ))}
              <div ref={endRef} />
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              borderTop: "1px solid #ddd",
              bgcolor: "white",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}
