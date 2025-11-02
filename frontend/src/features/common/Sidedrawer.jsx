import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AssistantIcon from "@mui/icons-material/Assistant";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
export default function Sidedrawer(props) {
  function DrawerList() {
    const navigate = useNavigate()
    return (
      <Box sx={{ width: 250 }} role="presentation" onClick={props.onClose}>
        <List>
          {[
            { icon: <SearchOutlined />, label: "Search everything", path: "/" },
            { path: "/ask", icon: <AssistantIcon />, label: "OptiAssistant" },
          ].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => {
                navigate("/ask")
              }}>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }
  return (
    <Drawer open={props.open} onClose={props.onClose}>
      <DrawerList />
    </Drawer>
  );
}
