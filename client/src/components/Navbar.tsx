import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const menuItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Documents", path: "/documents", icon: <ArticleIcon /> },
  { text: "Workflows", path: "/workflows", icon: <WorkOutlineIcon /> },
  { text: "Chatbot", path: "/chatbot", icon: <ChatIcon /> },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For user menu dropdown

  const isActive = (path: string) => router.pathname === path;

  // Handle user menu dropdown
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", boxShadow: "none" }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open menu"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "block", md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Brand Name */}
          <Link href="/" passHref legacyBehavior>
            <Box
              component="a"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none", // Remove underline
              }}
            >
              <img src="/logo.svg" alt="IPA System" style={{ height: 40 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold", color: "primary.main" }}>
                IPA System
              </Typography>
            </Box>
          </Link>

          {/* Desktop Menu Items */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {menuItems.map(({ text, path }) => (
              <Link key={path} href={path} passHref legacyBehavior>
                <Typography
                  component="a" // Use <a> for proper link behavior
                  sx={{
                    mx: 2,
                    py: 1,
                    cursor: "pointer",
                    fontWeight: isActive(path) ? "bold" : "normal",
                    color: isActive(path) ? "primary.main" : "gray",
                    borderBottom: isActive(path) ? "2px solid" : "none",
                    textDecoration: "none", // Remove underline
                    "&:hover": { color: "primary.dark" },
                  }}
                >
                  {text}
                </Typography>
              </Link>
            ))}
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              px: 2,
              py: 1,
              mr: 3,
            }}
          >
            <SearchIcon sx={{ color: "gray", mr: 1 }} />
            <InputBase
              placeholder="Search..."
              sx={{ color: "black", width: 200 }}
            />
          </Box>

          {/* Notifications and User Menu */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 2 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>U</Avatar>
            </IconButton>

            {/* User Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { width: 250 },
        }}
      >
        <List>
          {menuItems.map(({ text, path, icon }) => (
            <ListItem key={path} disablePadding>
              <Link href={path} passHref legacyBehavior>
                <ListItemButton
                  component="a" // Use <a> for proper link behavior
                  selected={isActive(path)}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    "&.Mui-selected": { bgcolor: "primary.light", color: "white" },
                    textDecoration: "none", // Remove underline
                  }}
                >
                  {icon}
                  <ListItemText primary={text} sx={{ ml: 1 }} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;