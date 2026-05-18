"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllUsers, getGuestUsers, assignRole } from "@/api/users";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/api/doctors";
import {
  getNurses,
  createNurse,
  updateNurse,
  deleteNurse,
} from "@/api/nurses";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "DOCTOR",
  "NURSE",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "RADIOLOGIST",
  "RECEPTIONIST",
];

const roleColors: Record<string, { bg: string; color: string }> = {
  SUPER_ADMIN: { bg: "rgba(74, 140, 133, 0.12)", color: "#2d7a72" },
  DOCTOR: { bg: "rgba(100, 130, 200, 0.12)", color: "#3d5a9e" },
  NURSE: { bg: "rgba(212, 100, 150, 0.12)", color: "#9e3d68" },
  PHARMACIST: { bg: "rgba(150, 100, 212, 0.12)", color: "#6a3d9e" },
  LAB_TECHNICIAN: { bg: "rgba(212, 168, 75, 0.12)", color: "#a07c20" },
  RADIOLOGIST: { bg: "rgba(75, 168, 212, 0.12)", color: "#1a7a9e" },
  RECEPTIONIST: { bg: "rgba(168, 212, 75, 0.12)", color: "#6a8a1a" },
  GUEST: { bg: "rgba(180, 180, 180, 0.12)", color: "#666" },
};

function RoleChip({ role }: { role: string }) {
  const colors = roleColors[role] ?? { bg: "rgba(180,180,180,0.12)", color: "#666" };
  return (
    <Chip
      label={role.replace(/_/g, " ")}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: "0.7rem",
      }}
    />
  );
}

// ─── All Users Tab ────────────────────────────────────────────────────────────

function AllUsersTab() {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res?.status === 200) setUsers(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <PageHeader title="All Users" subtitle="View every registered user in the system" />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Verified</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            backgroundColor: "primary.main",
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <RoleChip role={user.role} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.emailVerified ? "Verified" : "Unverified"}
                        size="small"
                        sx={{
                          backgroundColor: user.emailVerified
                            ? "rgba(74, 140, 133, 0.1)"
                            : "rgba(201, 112, 112, 0.1)",
                          color: user.emailVerified ? "primary.dark" : "error.main",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

// ─── Unassigned Users Tab ─────────────────────────────────────────────────────

function UnassignedTab() {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignTarget, setAssignTarget] = useState<IAdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await getGuestUsers();
    if (res?.status === 200) setUsers(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAssign = async () => {
    if (!assignTarget || !selectedRole) return;
    setAssignLoading(true);
    const res = await assignRole(assignTarget.id, selectedRole);
    setAssignLoading(false);
    if (res?.status === 200) {
      setAssignTarget(null);
      setSelectedRole("");
      fetchUsers();
    }
  };

  return (
    <>
      <PageHeader
        title="Unassigned Users"
        subtitle="Users awaiting role assignment (currently GUEST)"
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No unassigned users
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            backgroundColor: "warning.main",
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Assign Role">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setAssignTarget(user);
                            setSelectedRole("");
                          }}
                        >
                          <AssignmentIndOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Assign Role Dialog */}
      <Dialog
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Assign Role</DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          <Typography color="text.secondary" sx={{ fontSize: "0.9rem", mb: 2 }}>
            Select a role for{" "}
            <Typography component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              {assignTarget?.name}
            </Typography>
          </Typography>
          <TextField
            select
            label="Role"
            fullWidth
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setAssignTarget(null)}
            disabled={assignLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedRole || assignLoading}
            sx={{ minWidth: 90 }}
          >
            {assignLoading ? <CircularProgress size={18} color="inherit" /> : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ─── Doctors Tab ──────────────────────────────────────────────────────────────

const doctorSchema = yup.object({
  userId: yup.string().required("User is required"),
  specialization: yup.string().trim().required("Specialization is required"),
  licenseNumber: yup.string().trim().required("License number is required"),
  qualification: yup.string().trim().required("Qualification is required"),
  yearsOfExperience: yup
    .number()
    .typeError("Must be a number")
    .required("Years of experience is required")
    .min(0, "Cannot be negative"),
});

const doctorEditSchema = yup.object({
  specialization: yup.string().trim().required("Specialization is required"),
  licenseNumber: yup.string().trim().required("License number is required"),
  qualification: yup.string().trim().required("Qualification is required"),
  yearsOfExperience: yup
    .number()
    .typeError("Must be a number")
    .required("Years of experience is required")
    .min(0, "Cannot be negative"),
});

function DoctorsTab({ guestUsers }: { guestUsers: IAdminUser[] }) {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IDoctor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDoctor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const res = await getDoctors();
    if (res?.status === 200) setDoctors(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const formik = useFormik({
    initialValues: {
      userId: "",
      specialization: "",
      licenseNumber: "",
      qualification: "",
      yearsOfExperience: "" as unknown as number,
    },
    validationSchema: editing ? doctorEditSchema : doctorSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      if (editing) {
        const { userId: _uid, ...editData } = values;
        const res = await updateDoctor(editing.id, {
          ...editData,
          yearsOfExperience: Number(editData.yearsOfExperience),
        });
        setSubmitLoading(false);
        if (res?.status === 200) { handleClose(); fetchDoctors(); }
      } else {
        const res = await createDoctor({
          ...values,
          yearsOfExperience: Number(values.yearsOfExperience),
        });
        setSubmitLoading(false);
        if (res?.status === 201) { handleClose(); fetchDoctors(); }
      }
    },
  });

  const handleOpen = (doctor?: IDoctor) => {
    setEditing(doctor ?? null);
    formik.resetForm({
      values: {
        userId: doctor?.userId ?? "",
        specialization: doctor?.specialization ?? "",
        licenseNumber: doctor?.licenseNumber ?? "",
        qualification: doctor?.qualification ?? "",
        yearsOfExperience: doctor?.yearsOfExperience ?? ("" as unknown as number),
      },
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditing(null);
    formik.resetForm();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteDoctor(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    fetchDoctors();
  };

  return (
    <>
      <PageHeader
        title="Doctors"
        subtitle="Manage doctor profiles and specializations"
        action={{ label: "Add Doctor", onClick: () => handleOpen() }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Specialization</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>License No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Qualification</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No doctors found
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            backgroundColor: "rgba(100, 130, 200, 0.2)",
                            color: "#3d5a9e",
                          }}
                        >
                          {getInitials(doctor.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                            {doctor.name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                            {doctor.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{doctor.licenseNumber}</TableCell>
                    <TableCell>{doctor.qualification}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${doctor.yearsOfExperience} yrs`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(74, 140, 133, 0.1)",
                          color: "primary.dark",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(doctor)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(doctor)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editing ? "Edit Doctor" : "Add Doctor"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
          {!editing && (
            <TextField
              select
              label="User"
              fullWidth
              {...formik.getFieldProps("userId")}
              error={formik.touched.userId && Boolean(formik.errors.userId)}
              helperText={formik.touched.userId && formik.errors.userId}
            >
              {guestUsers.length === 0 ? (
                <MenuItem disabled>No unassigned users available</MenuItem>
              ) : (
                guestUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} — {u.email}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
          <TextField
            label="Specialization"
            fullWidth
            {...formik.getFieldProps("specialization")}
            error={formik.touched.specialization && Boolean(formik.errors.specialization)}
            helperText={formik.touched.specialization && formik.errors.specialization}
          />
          <TextField
            label="License Number"
            fullWidth
            {...formik.getFieldProps("licenseNumber")}
            error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
            helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
          />
          <TextField
            label="Qualification"
            fullWidth
            {...formik.getFieldProps("qualification")}
            error={formik.touched.qualification && Boolean(formik.errors.qualification)}
            helperText={formik.touched.qualification && formik.errors.qualification}
          />
          <TextField
            label="Years of Experience"
            type="number"
            fullWidth
            {...formik.getFieldProps("yearsOfExperience")}
            error={formik.touched.yearsOfExperience && Boolean(formik.errors.yearsOfExperience)}
            helperText={formik.touched.yearsOfExperience && formik.errors.yearsOfExperience}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={submitLoading}
            sx={{ minWidth: 90 }}
          >
            {submitLoading ? <CircularProgress size={18} color="inherit" /> : editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Doctor"
        message={`Are you sure you want to remove Dr. ${deleteTarget?.name} from the system? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Nurses Tab ───────────────────────────────────────────────────────────────

const SHIFT_OPTIONS: ShiftType[] = ["MORNING", "AFTERNOON", "NIGHT"];

const shiftColors: Record<ShiftType, { bg: string; color: string }> = {
  MORNING: { bg: "rgba(212, 168, 75, 0.12)", color: "#a07c20" },
  AFTERNOON: { bg: "rgba(74, 140, 133, 0.12)", color: "#2d7a72" },
  NIGHT: { bg: "rgba(100, 100, 180, 0.12)", color: "#3d3d9e" },
};

const nurseSchema = yup.object({
  userId: yup.string().required("User is required"),
  licenseNumber: yup.string().trim().required("License number is required"),
  ward: yup.string().trim().required("Ward is required"),
  shift: yup.string().oneOf(SHIFT_OPTIONS).required("Shift is required"),
});

const nurseEditSchema = yup.object({
  licenseNumber: yup.string().trim().required("License number is required"),
  ward: yup.string().trim().required("Ward is required"),
  shift: yup.string().oneOf(SHIFT_OPTIONS).required("Shift is required"),
});

function NursesTab({ guestUsers }: { guestUsers: IAdminUser[] }) {
  const [nurses, setNurses] = useState<INurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<INurse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<INurse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchNurses = useCallback(async () => {
    setLoading(true);
    const res = await getNurses();
    if (res?.status === 200) setNurses(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNurses();
  }, [fetchNurses]);

  const formik = useFormik({
    initialValues: {
      userId: "",
      licenseNumber: "",
      ward: "",
      shift: "MORNING" as ShiftType,
    },
    validationSchema: editing ? nurseEditSchema : nurseSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      if (editing) {
        const { userId: _uid, ...editData } = values;
        const res = await updateNurse(editing.id, editData);
        setSubmitLoading(false);
        if (res?.status === 200) { handleClose(); fetchNurses(); }
      } else {
        const res = await createNurse(values);
        setSubmitLoading(false);
        if (res?.status === 201) { handleClose(); fetchNurses(); }
      }
    },
  });

  const handleOpen = (nurse?: INurse) => {
    setEditing(nurse ?? null);
    formik.resetForm({
      values: {
        userId: nurse?.userId ?? "",
        licenseNumber: nurse?.licenseNumber ?? "",
        ward: nurse?.ward ?? "",
        shift: nurse?.shift ?? "MORNING",
      },
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditing(null);
    formik.resetForm();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await deleteNurse(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    fetchNurses();
  };

  return (
    <>
      <PageHeader
        title="Nurses"
        subtitle="Manage nursing staff, wards, and shifts"
        action={{ label: "Add Nurse", onClick: () => handleOpen() }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>License No.</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ward</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Shift</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nurses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No nurses found
                  </TableCell>
                </TableRow>
              ) : (
                nurses.map((nurse) => {
                  const shiftColor = shiftColors[nurse.shift];
                  return (
                    <TableRow key={nurse.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              backgroundColor: "rgba(212, 100, 150, 0.15)",
                              color: "#9e3d68",
                            }}
                          >
                            {getInitials(nurse.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                              {nurse.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                              {nurse.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{nurse.licenseNumber}</TableCell>
                      <TableCell>{nurse.ward}</TableCell>
                      <TableCell>
                        <Chip
                          label={nurse.shift}
                          size="small"
                          sx={{
                            backgroundColor: shiftColor.bg,
                            color: shiftColor.color,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpen(nurse)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(nurse)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editing ? "Edit Nurse" : "Add Nurse"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
          {!editing && (
            <TextField
              select
              label="User"
              fullWidth
              {...formik.getFieldProps("userId")}
              error={formik.touched.userId && Boolean(formik.errors.userId)}
              helperText={formik.touched.userId && formik.errors.userId}
            >
              {guestUsers.length === 0 ? (
                <MenuItem disabled>No unassigned users available</MenuItem>
              ) : (
                guestUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} — {u.email}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
          <TextField
            label="License Number"
            fullWidth
            {...formik.getFieldProps("licenseNumber")}
            error={formik.touched.licenseNumber && Boolean(formik.errors.licenseNumber)}
            helperText={formik.touched.licenseNumber && formik.errors.licenseNumber}
          />
          <TextField
            label="Ward"
            fullWidth
            {...formik.getFieldProps("ward")}
            error={formik.touched.ward && Boolean(formik.errors.ward)}
            helperText={formik.touched.ward && formik.errors.ward}
          />
          <TextField
            select
            label="Shift"
            fullWidth
            {...formik.getFieldProps("shift")}
            error={formik.touched.shift && Boolean(formik.errors.shift)}
            helperText={formik.touched.shift && formik.errors.shift}
          >
            {SHIFT_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={handleClose} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={submitLoading}
            sx={{ minWidth: 90 }}
          >
            {submitLoading ? <CircularProgress size={18} color="inherit" /> : editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Nurse"
        message={`Are you sure you want to remove ${deleteTarget?.name} from the system? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_ICONS = [
  <GroupOutlinedIcon key="all" sx={{ fontSize: 18 }} />,
  <PersonAddOutlinedIcon key="unassigned" sx={{ fontSize: 18 }} />,
  <LocalHospitalOutlinedIcon key="doctors" sx={{ fontSize: 18 }} />,
  <MedicalServicesOutlinedIcon key="nurses" sx={{ fontSize: 18 }} />,
];

const TAB_LABELS = ["All Users", "Unassigned", "Doctors", "Nurses"];

export default function StaffPage() {
  const [tab, setTab] = useState(0);
  const [guestUsers, setGuestUsers] = useState<IAdminUser[]>([]);

  useEffect(() => {
    getGuestUsers().then((res) => {
      if (res?.status === 200) setGuestUsers(res.data);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Staff Management
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: "0.92rem", mb: 3 }}>
        Manage users, assign roles, and maintain staff profiles
      </Typography>

      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            "& .MuiTab-root": { minHeight: 52, gap: 0.75, textTransform: "none", fontWeight: 500 },
            "& .Mui-selected": { fontWeight: 700 },
          }}
        >
          {TAB_LABELS.map((label, i) => (
            <Tab key={label} label={label} icon={TAB_ICONS[i]} iconPosition="start" />
          ))}
        </Tabs>
      </Paper>

      <Box hidden={tab !== 0}>
        <AllUsersTab />
      </Box>
      <Box hidden={tab !== 1}>
        <UnassignedTab />
      </Box>
      <Box hidden={tab !== 2}>
        <DoctorsTab guestUsers={guestUsers} />
      </Box>
      <Box hidden={tab !== 3}>
        <NursesTab guestUsers={guestUsers} />
      </Box>
    </Box>
  );
}
