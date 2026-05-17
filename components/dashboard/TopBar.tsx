"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { SIDEBAR_WIDTH } from "./Sidebar";
import { AuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/api/auth";

interface TopBarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TopBar({ onMenuClick, pageTitle }: TopBarProps) {
  const { setLoggedIn, user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSignOut = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await signOut(refreshToken);

        if (response.status === 204) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setLoggedIn?.(false);
          setUser?.(undefined)
          router.push("/login");
        }
      }
    } catch (error: unknown) {
      if (error) {
        console.log({ error });
      }
    }
  };

  if (!user) return null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: "68px !important", px: { xs: 2, sm: 3 } }}>
        {/* Mobile hamburger */}
        <IconButton
          onClick={onMenuClick}
          edge="start"
          sx={{ display: { md: "none" }, color: "text.secondary" }}
          aria-label="open navigation"
        >
          <MenuOutlinedIcon />
        </IconButton>

        {/* Page title */}
        {pageTitle && (
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            {pageTitle}
          </Typography>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Notifications (disabled pending approval) */}
        <Tooltip title="Notifications available after approval">
          <span>
            <IconButton disabled sx={{ color: "text.secondary" }}>
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>

        {/* User menu */}
        <Tooltip title="Account">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                backgroundColor: "primary.main",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {user.name}
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} disabled sx={{ gap: 1.5, py: 1.25 }}>
            <ListItemIcon sx={{ minWidth: "auto" }}>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleSignOut}
            sx={{ gap: 1.5, py: 1.25, color: "error.main" }}
          >
            <ListItemIcon sx={{ minWidth: "auto", color: "error.main" }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
