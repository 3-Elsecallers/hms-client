"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "@/contexts/AuthContext";

const DEPARTMENTS = [
  "Administration",
  "Cardiology",
  "Emergency Medicine",
  "General Practice",
  "Laboratory",
  "Neurology",
  "Nursing",
  "Oncology",
  "Pediatrics",
  "Pharmacy",
  "Radiology",
  "Surgery",
  "Other",
];

interface PasswordRule {
  label: string;
  met: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", met: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", met: (pw) => /[A-Z]/.test(pw) },
  { label: "One number", met: (pw) => /\d/.test(pw) },
];

export default function RegisterPage() {
  const { user, isLoading: authLoading, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      if (!user.emailVerified) router.replace("/verify-email");
      else router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const passwordValid = PASSWORD_RULES.every((r) => r.met(password));
  const confirmMatch = confirmPassword !== "" && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await register({ name, email, password, department });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Registration failed.");
      return;
    }
    router.push("/verify-email");
  };

  if (authLoading) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Left branding panel ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "42%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #2D6E68 0%, #1C4845 60%, #142F2D 100%)",
          p: 5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", bottom: -120, left: -60, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.035)" }} />

        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "relative" }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LocalHospitalIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.1 }}>MediCare</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Hospital Management</Typography>
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Typography variant="h3" sx={{ color: "#FFFFFF", fontWeight: 700, lineHeight: 1.2, mb: 2, fontSize: { md: "1.8rem", lg: "2.1rem" } }}>
            Join Our Healthcare
            <br />
            Professional Network
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 4, fontSize: "0.95rem", lineHeight: 1.7 }}>
            Create your account and start managing patient care more efficiently.
          </Typography>

          <Stack spacing={2}>
            {[
              "Unified patient records across all departments",
              "Integrated appointment and schedule management",
              "Role-based access tailored to your position",
            ].map((text, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: "rgba(255,255,255,0.7)", fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Typography sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", position: "relative" }}>
          © 2026 MediCare HMS. All rights reserved.
        </Typography>
      </Box>

      {/* ── Right form panel ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 5 },
          backgroundColor: "background.default",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LocalHospitalIcon sx={{ color: "#FFF", fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>MediCare HMS</Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 440, py: { xs: 2, md: 0 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.75, color: "text.primary" }}>
            Create account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3.5, fontSize: "0.95rem" }}>
            Fill in your details to request system access
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Full name"
                fullWidth
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email address"
                type="email"
                fullWidth
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Department"
                select
                fullWidth
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>

              <Box>
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                            {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {password && (
                  <Stack direction="row" sx={{ mt: 1.25, gap: "6px 16px", flexWrap: "wrap" }}>
                    {PASSWORD_RULES.map((rule) => {
                      const met = rule.met(password);
                      return (
                        <Box key={rule.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {met ? (
                            <CheckCircleIcon sx={{ fontSize: 13, color: "success.main" }} />
                          ) : (
                            <CheckCircleOutlinedIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                          )}
                          <Typography sx={{ fontSize: "0.75rem", color: met ? "success.main" : "text.disabled" }}>
                            {rule.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              <TextField
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                fullWidth
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== "" && !confirmMatch}
                helperText={confirmPassword !== "" && !confirmMatch ? "Passwords do not match" : ""}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end" size="small">
                          {showConfirm ? <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ py: 1.5, mt: 0.5 }}>
                {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Create account"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Box component="span" sx={{ color: "primary.main", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                  Sign in
                </Box>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
