"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 3,
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" sx={{ fontSize: "0.92rem" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          startIcon={action.icon ?? <AddOutlinedIcon />}
          sx={{ flexShrink: 0, mt: 0.5 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
