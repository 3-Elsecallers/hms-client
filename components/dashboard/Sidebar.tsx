"use client";

import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import RadioOutlinedIcon from "@mui/icons-material/RadioOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AuthContext } from "@/contexts/AuthContext";
import { signOut } from "@/api/auth";

export const SIDEBAR_WIDTH = 272;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  locked: boolean;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    heading: "Main",
    items: [
      { label: "Dashboard", icon: <DashboardOutlinedIcon />, href: "/dashboard", locked: false },
      { label: "Patients", icon: <PeopleOutlinedIcon />, href: "/patients", locked: true },
      { label: "Appointments", icon: <CalendarMonthOutlinedIcon />, href: "/appointments", locked: true },
      { label: "Schedule", icon: <ScheduleOutlinedIcon />, href: "/schedule", locked: true },
    ],
  },
  {
    heading: "Medical",
    items: [
      { label: "Pharmacy", icon: <MedicalServicesOutlinedIcon />, href: "/pharmacy", locked: true },
      { label: "Laboratory", icon: <ScienceOutlinedIcon />, href: "/laboratory", locked: true },
      { label: "Radiology", icon: <RadioOutlinedIcon />, href: "/radiology", locked: true },
    ],
  },
  {
    heading: "Administration",
    items: [
      { label: "Staff", icon: <GroupsOutlinedIcon />, href: "/staff", locked: true },
      { label: "Reports", icon: <AssessmentOutlinedIcon />, href: "/reports", locked: true },
      { label: "Settings", icon: <SettingsOutlinedIcon />, href: "/settings", locked: false },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, setUser, setLoggedIn } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

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

  const handleNavigate = (item: NavItem) => {
    if (item.locked) return;
    onClose?.();
    router.push(item.href);
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 68,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LocalHospitalIcon sx={{ color: "#FFF", fontSize: 22 }} />
        </Box>
        <Box sx={{ overflow: "hidden" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.15 }}>
            MediCare
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: "text.secondary", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            HMS
          </Typography>
        </Box>
      </Box>

      {/* User card */}
      <Box sx={{ px: 2, py: 2.5, borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "primary.main",
              fontSize: "0.9rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ overflow: "hidden", flex: 1 }}>
            <Typography
              sx={{ fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{ fontSize: "0.75rem", color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {/* {user.department} */}
            </Typography>
          </Box>
        </Box>
        <Chip
          label="Awaiting Approval"
          size="small"
          sx={{
            mt: 1.25,
            backgroundColor: "rgba(212, 168, 75, 0.12)",
            color: "warning.dark",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
          }}
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
        {NAV_SECTIONS.map((section) => (
          <Box key={section.heading} sx={{ mb: 0.5 }}>
            <Typography
              sx={{
                px: 2.5,
                py: 0.75,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.disabled",
              }}
            >
              {section.heading}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => {
                const active = pathname === item.href;
                const content = (
                  <ListItemButton
                    selected={active}
                    disabled={item.locked}
                    onClick={() => handleNavigate(item)}
                    sx={{
                      py: 1,
                      minHeight: 42,
                      opacity: item.locked ? 0.45 : 1,
                      "&.Mui-disabled": {
                        opacity: 0.45,
                        cursor: "not-allowed",
                        pointerEvents: "auto",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: active ? "primary.main" : "text.secondary",
                        "& svg": { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{ "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: active ? 600 : 400 } }}
                    />
                    {item.locked && (
                      <LockOutlinedIcon sx={{ fontSize: 14, color: "text.disabled", ml: 0.5 }} />
                    )}
                  </ListItemButton>
                );

                return item.locked ? (
                  <Tooltip key={item.label} title="Available after admin approval" placement="right" arrow>
                    <span>{content}</span>
                  </Tooltip>
                ) : (
                  <Box key={item.label}>{content}</Box>
                );
              })}
            </List>
            <Divider sx={{ mx: 2, mt: 1 }} />
          </Box>
        ))}
      </Box>

      {/* Logout */}
      <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: 2,
            py: 1,
            color: "error.main",
            "&:hover": { backgroundColor: "rgba(201, 112, 112, 0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit", "& svg": { fontSize: 20 } }}>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            sx={{ "& .MuiListItemText-primary": { fontSize: "0.875rem", fontWeight: 500 } }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
