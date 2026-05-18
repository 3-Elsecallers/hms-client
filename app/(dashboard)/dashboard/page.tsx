"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { AuthContext } from "@/contexts/AuthContext";
import { getDepartments } from "@/api/departments";
import { getBeds } from "@/api/beds";
import { getDoctors } from "@/api/doctors";
import { getGuestUsers } from "@/api/users";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ── Pending approval view (non-admin users) ───────────────────────────────────

interface Step {
  icon: React.ReactNode;
  label: string;
  description: string;
  status: "done" | "active" | "pending";
}

function PendingApprovalView({ user }: { user: IUser }) {
  const steps: Step[] = [
    {
      icon: <HowToRegOutlinedIcon />,
      label: "Account created",
      description: "Your account has been successfully registered.",
      status: "done",
    },
    {
      icon: <MarkEmailReadOutlinedIcon />,
      label: "Email verified",
      description: "Your email address has been confirmed.",
      status: "done",
    },
    {
      icon: <AdminPanelSettingsOutlinedIcon />,
      label: "Admin review",
      description: "Our administrators are reviewing your profile.",
      status: "active",
    },
    {
      icon: <AssignmentIndOutlinedIcon />,
      label: "Role assignment",
      description: "A role will be assigned based on your department.",
      status: "pending",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Welcome, {user.name.split(" ")[0]}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          Your account is currently under review — here&apos;s a summary of your status.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Onboarding Progress
                </Typography>
                <Chip
                  label="Step 3 of 4"
                  size="small"
                  sx={{ backgroundColor: "rgba(74,140,133,0.1)", color: "primary.dark", fontWeight: 600, fontSize: "0.75rem" }}
                />
              </Box>

              <Stack spacing={0}>
                {steps.map((step, i) => (
                  <Box key={step.label}>
                    <Box sx={{ display: "flex", gap: 2, py: 2 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor:
                              step.status === "done"
                                ? "rgba(107, 174, 149, 0.15)"
                                : step.status === "active"
                                ? "rgba(74, 140, 133, 0.12)"
                                : "rgba(0,0,0,0.04)",
                            "& svg": { fontSize: 20 },
                          }}
                        >
                          {step.status === "done" ? (
                            <CheckCircleIcon sx={{ fontSize: "22px !important", color: "success.main" }} />
                          ) : step.status === "active" ? (
                            <HourglassTopOutlinedIcon sx={{ color: "primary.main" }} />
                          ) : (
                            <RadioButtonUncheckedIcon sx={{ color: "text.disabled" }} />
                          )}
                        </Box>
                        {i < steps.length - 1 && (
                          <Box
                            sx={{
                              width: 2,
                              flex: 1,
                              minHeight: 20,
                              backgroundColor: step.status === "done" ? "success.light" : "divider",
                              my: 0.5,
                              borderRadius: 1,
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ pt: 0.5, pb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              color: step.status === "pending" ? "text.disabled" : "text.primary",
                            }}
                          >
                            {step.label}
                          </Typography>
                          {step.status === "active" && (
                            <Chip
                              label="In progress"
                              size="small"
                              sx={{ height: 20, fontSize: "0.7rem", backgroundColor: "rgba(212, 168, 75, 0.14)", color: "warning.dark", fontWeight: 600 }}
                            />
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            color: step.status === "pending" ? "text.disabled" : "text.secondary",
                            lineHeight: 1.5,
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Account Summary
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ width: 72, height: 72, backgroundColor: "primary.main", fontSize: "1.5rem", fontWeight: 700, mb: 1.5 }}>
                  {getInitials(user.name)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>{user.name}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>Role pending assignment</Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />
              <Stack spacing={2}>
                {[
                  { icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} />, label: "Email", value: user.email },
                  { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />, label: "Role", value: user.role },
                ].map(({ icon, label, value }) => (
                  <Box key={label} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, backgroundColor: "rgba(74,140,133,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", flexShrink: 0 }}>
                      {icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", fontWeight: 500 }}>{label}</Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, wordBreak: "break-word" }}>{value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ backgroundColor: "rgba(74, 140, 133, 0.04)", border: "1px solid rgba(74, 140, 133, 0.2)" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: "rgba(74,140,133,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", flexShrink: 0 }}>
                  <InfoOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>What happens next?</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                    Our administrators will review your account and assign you an appropriate role. This typically takes{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>1–2 business days</Box>.
                    You&apos;ll be notified at{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>{user.email}</Box>.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  href: string;
}

function StatCard({ icon, label, value, color, href }: StatCardProps) {
  const router = useRouter();
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={() => router.push(href)} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: `${color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                "& svg": { fontSize: 24 },
              }}
            >
              {icon}
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            {label}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ── Admin overview ────────────────────────────────────────────────────────────

function AdminOverview({ user }: { user: IUser }) {
  const [stats, setStats] = useState({
    departments: 0,
    beds: 0,
    doctors: 0,
    unassigned: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const [deptRes, bedsRes, doctorsRes, guestRes] = await Promise.allSettled([
        getDepartments(),
        getBeds(),
        getDoctors(),
        getGuestUsers(),
      ]);

      setStats({
        departments:
          deptRes.status === "fulfilled" && deptRes.value?.data
            ? Array.isArray(deptRes.value.data)
              ? deptRes.value.data.length
              : deptRes.value.data.total ?? 0
            : 0,
        beds:
          bedsRes.status === "fulfilled" && bedsRes.value?.data
            ? Array.isArray(bedsRes.value.data)
              ? bedsRes.value.data.length
              : bedsRes.value.data.total ?? 0
            : 0,
        doctors:
          doctorsRes.status === "fulfilled" && doctorsRes.value?.data
            ? Array.isArray(doctorsRes.value.data)
              ? doctorsRes.value.data.length
              : doctorsRes.value.data.total ?? 0
            : 0,
        unassigned:
          guestRes.status === "fulfilled" && guestRes.value?.data
            ? Array.isArray(guestRes.value.data)
              ? guestRes.value.data.length
              : guestRes.value.data.total ?? 0
            : 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards: StatCardProps[] = [
    {
      icon: <ApartmentOutlinedIcon />,
      label: "Total Departments",
      value: loading ? "—" : stats.departments,
      color: "#4A8C85",
      href: "/departments",
    },
    {
      icon: <KingBedOutlinedIcon />,
      label: "Total Beds",
      value: loading ? "—" : stats.beds,
      color: "#5B8FA8",
      href: "/departments",
    },
    {
      icon: <LocalHospitalOutlinedIcon />,
      label: "Total Doctors",
      value: loading ? "—" : stats.doctors,
      color: "#6BAE95",
      href: "/staff",
    },
    {
      icon: <GroupAddOutlinedIcon />,
      label: "Unassigned Users",
      value: loading ? "—" : stats.unassigned,
      color: "#D4A84B",
      href: "/staff",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Welcome back, {user.name.split(" ")[0]}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          Here&apos;s an overview of the hospital management system.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard {...card} />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Card sx={{ backgroundColor: "rgba(74, 140, 133, 0.04)", border: "1px solid rgba(74, 140, 133, 0.2)" }}>
              <CardContent sx={{ p: 3.5 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: "rgba(74,140,133,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", flexShrink: 0 }}>
                    <ManageAccountsOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.75 }}>
                      Admin Controls
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                      Use the sidebar to manage{" "}
                      <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>Departments</Box>,{" "}
                      <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>Wards</Box>,{" "}
                      <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>Beds</Box>, and{" "}
                      <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>Staff</Box>.
                      Unassigned users require role assignment before they can access the system.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

// ── Page entry point ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return user.role === "SUPER_ADMIN" ? (
    <AdminOverview user={user} />
  ) : (
    <PendingApprovalView user={user} />
  );
}
