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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ChatIcon from "@mui/icons-material/Chat";

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

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: "block", md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Link href="/" passHref>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <img src="/logo.svg" alt="IPA System" style={{ height: 40 }} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold", color: "primary.main" }}>
                IPA System
              </Typography>
            </Box>
          </Link>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {menuItems.map(({ text, path }) => (
              <Link key={path} href={path} passHref>
                <Typography
                  sx={{
                    mx: 2,
                    py: 1,
                    cursor: "pointer",
                    fontWeight: isActive(path) ? "bold" : "normal",
                    color: isActive(path) ? "primary.main" : "gray",
                    "&:hover": { color: "primary.dark" },
                  }}
                >
                  {text}
                </Typography>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Sidebar Drawer */}
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
              <Link href={path} passHref>
                <ListItemButton
                  selected={isActive(path)}
                  onClick={() => setMobileOpen(false)}
                  sx={{ "&.Mui-selected": { bgcolor: "primary.light", color: "white" } }}
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
