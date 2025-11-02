import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
export default function Sidedrawer(props) {
  function DrawerList() {
    return (
      <Box sx={{ width: 250 }} role="presentation" onClick={props.onClose}>
        <List>
          {[{ icon: <SearchOutlined />, label: "Search everything" }].map(
            (text) => (
              <ListItem
                key={text}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>{text.icon}</ListItemIcon>
                  <ListItemText primary={text.label} />
                </ListItemButton>
              </ListItem>
            )
          )}
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
