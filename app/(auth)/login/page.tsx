"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { signIn } from "@/api/auth";
import { AuthContext } from "@/contexts/AuthContext";

const features = [
  {
    icon: <SecurityOutlinedIcon sx={{ fontSize: 20 }} />,
    text: "Secure patient records with end-to-end encryption",
  },
  {
    icon: <TimelineOutlinedIcon sx={{ fontSize: 20 }} />,
    text: "Streamlined workflows for all medical staff",
  },
  {
    icon: <BarChartOutlinedIcon sx={{ fontSize: 20 }} />,
    text: "Real-time analytics and reporting dashboards",
  },
];

const validationSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
});

export default function LoginPage() {
  const { authLoading, user, setUser, setLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        setError("");
        setIsSubmitting(true);
        const response = await signIn({ email, password });
        setIsSubmitting(false);
        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          const payload = jwtDecode<IJWTPayload>(accessToken);
          setLoggedIn?.(true);
          setUser?.({
            id: payload.data.id,
            name: payload.data.name,
            email: payload.data.email,
            emailVerified: payload.data.emailVerified,
            role: payload.data.role,
          });
        } else if (response.status === 400 || response.status === 401) {
          setError(response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } catch (error) {
        if (error) {
          console.log({ error });
          setError("An error occurred. Please try again later.");
        }
      }
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      if (!user.emailVerified) {
        router.replace("/verify-email");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Left branding panel ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          width: "45%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #2D6E68 0%, #1C4845 60%, #142F2D 100%)",
          p: 5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -100, right: -100, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", bottom: -140, left: -80, width: 420, height: 420, borderRadius: "50%", background: "rgba(255,255,255,0.035)" }} />
        <Box sx={{ position: "absolute", top: "40%", right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.025)" }} />

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

        {/* Main copy + features */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="h3" sx={{ color: "#FFFFFF", fontWeight: 700, lineHeight: 1.2, mb: 2, fontSize: { md: "1.9rem", lg: "2.2rem" } }}>
            Streamlining Healthcare,
            <br />
            Improving Lives
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", mb: 5, fontSize: "0.98rem", lineHeight: 1.7 }}>
            A comprehensive platform for modern hospitals and clinics.
          </Typography>

          <Stack spacing={2.5}>
            {features.map((f, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                  {f.icon}
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {f.text}
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
        }}
      >
        {/* Mobile logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.5, mb: 5 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: 2, backgroundColor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LocalHospitalIcon sx={{ color: "#FFF", fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>MediCare HMS</Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 420 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.75, color: "text.primary" }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, fontSize: "0.95rem" }}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Email address"
                id="email"
                name="email"
                type="email"
                fullWidth
                required
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <TextField
                label="Password"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small" aria-label="toggle password visibility">
                          {showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />

              <Box sx={{ textAlign: "right", mt: -1 }}>
                <Typography component="span" sx={{ fontSize: "0.85rem", color: "primary.main", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                  Forgot password?
                </Typography>
              </Box>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ py: 1.5, mt: 0.5 }}>
                {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: "center", mt: 3.5 }}>
            <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" style={{ textDecoration: "none" }}>
                <Box component="span" sx={{ color: "primary.main", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}>
                  Create account
                </Box>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
