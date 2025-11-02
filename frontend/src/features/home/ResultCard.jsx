import { Box, Typography } from "@mui/material";

const highlightText = (text, search) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} style={{ backgroundColor: "#ffeb3b", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default function ResultCard({ item, search }) {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        backgroundColor: "#fafafa",
        height: "100%",
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {item.entity?.name || "Unknown Document"}
      </Typography>

      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          maxHeight: 150,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {highlightText(item.content || "", search)}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1 }}
      >
        Type: {item.entity?.type} | Score: {item.score?.toFixed(3) || "N/A"}
      </Typography>
    </Box>
  );
}
