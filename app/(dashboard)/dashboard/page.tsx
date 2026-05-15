"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
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
import { useAuth } from "@/contexts/AuthContext";

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

interface Step {
  icon: React.ReactNode;
  label: string;
  description: string;
  status: "done" | "active" | "pending";
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

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
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
          Welcome, {user.name.split(" ")[0]}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.95rem" }}>
          Your account is currently under review — here&apos;s a summary of your status.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ── Onboarding progress card ── */}
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
                      {/* Status indicator */}
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
                            color:
                              step.status === "done"
                                ? "success.main"
                                : step.status === "active"
                                ? "primary.main"
                                : "text.disabled",
                            "& svg": { fontSize: 20 },
                            position: "relative",
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
                              backgroundColor:
                                step.status === "done" ? "success.light" : "divider",
                              my: 0.5,
                              borderRadius: 1,
                            }}
                          />
                        )}
                      </Box>

                      {/* Content */}
                      <Box sx={{ pt: 0.5, pb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              color:
                                step.status === "pending" ? "text.disabled" : "text.primary",
                            }}
                          >
                            {step.label}
                          </Typography>
                          {step.status === "active" && (
                            <Chip
                              label="In progress"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.7rem",
                                backgroundColor: "rgba(212, 168, 75, 0.14)",
                                color: "warning.dark",
                                fontWeight: 600,
                              }}
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
                    {i < steps.length - 1 && <Box sx={{ ml: 7 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Profile summary card ── */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Account Summary
              </Typography>

              {/* Avatar + name */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    backgroundColor: "primary.main",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>{user.name}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                  Role pending assignment
                </Typography>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              <Stack spacing={2}>
                {[
                  {
                    icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} />,
                    label: "Email",
                    value: user.email,
                  },
                  {
                    icon: <BusinessOutlinedIcon sx={{ fontSize: 18 }} />,
                    label: "Department",
                    value: user.department,
                  },
                  {
                    icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />,
                    label: "Member since",
                    value: formatDate(user.createdAt),
                  },
                ].map(({ icon, label, value }) => (
                  <Box key={label} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        backgroundColor: "rgba(74,140,133,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "primary.main",
                        flexShrink: 0,
                        mt: 0.1,
                      }}
                    >
                      {icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", fontWeight: 500 }}>
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          wordBreak: "break-word",
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ── What happens next card ── */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              backgroundColor: "rgba(74, 140, 133, 0.04)",
              border: "1px solid rgba(74, 140, 133, 0.2)",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "rgba(74,140,133,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  <InfoOutlinedIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    What happens next?
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "0.9rem", lineHeight: 1.7, mb: 2.5 }}>
                    Our system administrators will review your registration and assign you an appropriate role
                    based on your department and qualifications. This process typically takes{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                      1–2 business days
                    </Box>
                    . You&apos;ll receive an email notification at{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: "primary.main" }}>
                      {user.email}
                    </Box>{" "}
                    once your account has been reviewed.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmailOutlinedIcon />}
                    href={`mailto:admin@medicare-hms.com?subject=Account%20Review%20Inquiry&body=Hello,%0A%0AI%20registered%20as%20${encodeURIComponent(user.name)}%20(${encodeURIComponent(user.email)})%20in%20the%20${encodeURIComponent(user.department)}%20department%20and%20would%20like%20to%20inquire%20about%20my%20account%20review%20status.%0A%0AThank%20you.`}
                    sx={{ borderRadius: 2 }}
                  >
                    Contact administrator
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
