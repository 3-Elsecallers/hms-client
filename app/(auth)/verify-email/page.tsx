"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAuth, DEMO_OTP } from "@/contexts/AuthContext";
import OtpInput from "@/components/auth/OtpInput";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 120;

export default function VerifyEmailPage() {
  const { user, isLoading: authLoading, verifyEmail, logout } = useAuth();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.emailVerified) {
        router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_SECONDS);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setError("");
    setIsSubmitting(true);
    const result = await verifyEmail(otp);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || "Verification failed.");
      setOtp("");
      return;
    }
    router.push("/dashboard");
  };

  const handleResend = () => {
    setOtp("");
    setError("");
    startCountdown();
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (authLoading || !user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LocalHospitalIcon sx={{ color: "#FFF", fontSize: 26 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.1 }}>
            MediCare
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Hospital Management
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3.5, sm: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "rgba(74, 140, 133, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <MarkEmailReadOutlinedIcon sx={{ fontSize: 36, color: "primary.main" }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Verify your email
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 0.75, fontSize: "0.95rem" }}>
          We sent a {OTP_LENGTH}-digit code to
        </Typography>
        <Typography sx={{ fontWeight: 600, color: "primary.main", mb: 3.5, fontSize: "0.95rem" }}>
          {user.email}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: "left" }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <OtpInput
          value={otp}
          onChange={setOtp}
          length={OTP_LENGTH}
          disabled={isSubmitting}
          hasError={!!error}
        />

        {/* Countdown */}
        <Box sx={{ mt: 2.5, mb: 3 }}>
          {canResend ? (
            <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
              Didn&apos;t receive a code?{" "}
              <Box
                component="span"
                onClick={handleResend}
                sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
              >
                Resend code
              </Box>
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "0.88rem", color: "text.secondary" }}>
              Resend code in{" "}
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                {formatTime(countdown)}
              </Box>
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting || otp.length < OTP_LENGTH}
          onClick={handleVerify}
          sx={{ py: 1.5, mb: 2 }}
        >
          {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Verify email"}
        </Button>

        <Button
          variant="text"
          size="small"
          onClick={handleSignOut}
          sx={{ color: "text.secondary", fontSize: "0.85rem" }}
        >
          Sign in with a different account
        </Button>
      </Paper>

      {/* Demo hint */}
      <Chip
        icon={<InfoOutlinedIcon sx={{ fontSize: "16px !important" }} />}
        label={`Demo code: ${DEMO_OTP}`}
        variant="outlined"
        size="small"
        sx={{ mt: 3, color: "text.secondary", borderColor: "divider", fontSize: "0.8rem" }}
      />
    </Box>
  );
}
