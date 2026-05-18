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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import PageHeader from "@/components/admin/PageHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/api/departments";
import { getWards, createWard, updateWard, deleteWard } from "@/api/wards";
import { getBeds, createBed, updateBed, deleteBed } from "@/api/beds";

// ─── Departments Tab ──────────────────────────────────────────────────────────

const deptSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  description: yup.string().trim().required("Description is required"),
});

function DepartmentsTab() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IDepartment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDepartment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    const res = await getDepartments();
    if (res?.status === 200) setDepartments(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema: deptSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      const res = editing
        ? await updateDepartment(editing.id, values)
        : await createDepartment(values);
      setSubmitLoading(false);
      if (res?.status === 200 || res?.status === 201) {
        handleClose();
        fetchDepartments();
      }
    },
  });

  const handleOpen = (dept?: IDepartment) => {
    setEditing(dept ?? null);
    formik.resetForm({
      values: { name: dept?.name ?? "", description: dept?.description ?? "" },
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
    await deleteDepartment(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    fetchDepartments();
  };

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="Manage hospital departments"
        action={{ label: "Add Department", onClick: () => handleOpen() }}
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
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Staff Count</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{dept.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary", maxWidth: 320 }}>
                      {dept.description}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${dept.staff?.length ?? 0} staff`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(74, 140, 133, 0.1)",
                          color: "primary.dark",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(dept)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(dept)}
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
          {editing ? "Edit Department" : "Add Department"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
          <TextField
            label="Name"
            fullWidth
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...formik.getFieldProps("description")}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
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
        title="Delete Department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Wards Tab ────────────────────────────────────────────────────────────────

const wardSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  departmentId: yup.string().required("Department is required"),
  floorNumber: yup
    .number()
    .typeError("Must be a number")
    .required("Floor number is required")
    .min(1, "Must be at least 1"),
});

function WardsTab({ departments }: { departments: IDepartment[] }) {
  const [wards, setWards] = useState<IWard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IWard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IWard | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchWards = useCallback(async () => {
    setLoading(true);
    const res = await getWards();
    if (res?.status === 200) setWards(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const formik = useFormik({
    initialValues: { name: "", departmentId: "", floorNumber: "" as unknown as number },
    validationSchema: wardSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      const payload = { ...values, floorNumber: Number(values.floorNumber) };
      const res = editing
        ? await updateWard(editing.id, payload)
        : await createWard(payload);
      setSubmitLoading(false);
      if (res?.status === 200 || res?.status === 201) {
        handleClose();
        fetchWards();
      }
    },
  });

  const handleOpen = (ward?: IWard) => {
    setEditing(ward ?? null);
    formik.resetForm({
      values: {
        name: ward?.name ?? "",
        departmentId: ward?.departmentId ?? "",
        floorNumber: ward?.floorNumber ?? ("" as unknown as number),
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
    await deleteWard(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    fetchWards();
  };

  const getDeptName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? id;

  return (
    <>
      <PageHeader
        title="Wards"
        subtitle="Manage hospital wards"
        action={{ label: "Add Ward", onClick: () => handleOpen() }}
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
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Floor</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Beds</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No wards found
                  </TableCell>
                </TableRow>
              ) : (
                wards.map((ward) => (
                  <TableRow key={ward.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{ward.name}</TableCell>
                    <TableCell>{getDeptName(ward.departmentId)}</TableCell>
                    <TableCell>Floor {ward.floorNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${ward.beds?.length ?? 0} beds`}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(74, 140, 133, 0.1)",
                          color: "primary.dark",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen(ward)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(ward)}
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
          {editing ? "Edit Ward" : "Add Ward"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
          <TextField
            label="Ward Name"
            fullWidth
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            select
            label="Department"
            fullWidth
            {...formik.getFieldProps("departmentId")}
            error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
            helperText={formik.touched.departmentId && formik.errors.departmentId}
          >
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Floor Number"
            type="number"
            fullWidth
            {...formik.getFieldProps("floorNumber")}
            error={formik.touched.floorNumber && Boolean(formik.errors.floorNumber)}
            helperText={formik.touched.floorNumber && formik.errors.floorNumber}
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
        title="Delete Ward"
        message={`Are you sure you want to delete ward "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Beds Tab ─────────────────────────────────────────────────────────────────

const BED_STATUSES: BedStatus[] = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const bedStatusColors: Record<BedStatus, { bg: string; color: string }> = {
  AVAILABLE: { bg: "rgba(74, 140, 133, 0.1)", color: "#2d7a72" },
  OCCUPIED: { bg: "rgba(201, 112, 112, 0.1)", color: "#b94f4f" },
  MAINTENANCE: { bg: "rgba(212, 168, 75, 0.12)", color: "#a07c20" },
};

const bedSchema = yup.object({
  wardId: yup.string().required("Ward is required"),
  bedNumber: yup.string().trim().required("Bed number is required"),
  bedStatus: yup.string().oneOf(BED_STATUSES).required("Status is required"),
});

function BedsTab({ wards }: { wards: IWard[] }) {
  const [beds, setBeds] = useState<IBed[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IBed | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IBed | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBeds = useCallback(async () => {
    setLoading(true);
    const res = await getBeds();
    if (res?.status === 200) setBeds(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBeds();
  }, [fetchBeds]);

  const formik = useFormik({
    initialValues: { wardId: "", bedNumber: "", bedStatus: "AVAILABLE" as BedStatus },
    validationSchema: bedSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      const res = editing
        ? await updateBed(editing.id, values)
        : await createBed(values);
      setSubmitLoading(false);
      if (res?.status === 200 || res?.status === 201) {
        handleClose();
        fetchBeds();
      }
    },
  });

  const handleOpen = (bed?: IBed) => {
    setEditing(bed ?? null);
    formik.resetForm({
      values: {
        wardId: bed?.wardId ?? "",
        bedNumber: bed?.bedNumber ?? "",
        bedStatus: bed?.bedStatus ?? "AVAILABLE",
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
    await deleteBed(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    fetchBeds();
  };

  const getWardName = (id: string) => wards.find((w) => w.id === id)?.name ?? id;

  return (
    <>
      <PageHeader
        title="Beds"
        subtitle="Manage ward beds and availability"
        action={{ label: "Add Bed", onClick: () => handleOpen() }}
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
                <TableCell sx={{ fontWeight: 600 }}>Bed Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ward</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {beds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No beds found
                  </TableCell>
                </TableRow>
              ) : (
                beds.map((bed) => {
                  const colors = bedStatusColors[bed.bedStatus];
                  return (
                    <TableRow key={bed.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{bed.bedNumber}</TableCell>
                      <TableCell>{getWardName(bed.wardId)}</TableCell>
                      <TableCell>
                        <Chip
                          label={bed.bedStatus}
                          size="small"
                          sx={{
                            backgroundColor: colors.bg,
                            color: colors.color,
                            fontWeight: 600,
                            fontSize: "0.72rem",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpen(bed)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(bed)}
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
          {editing ? "Edit Bed" : "Add Bed"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "20px !important" }}>
          <TextField
            select
            label="Ward"
            fullWidth
            {...formik.getFieldProps("wardId")}
            error={formik.touched.wardId && Boolean(formik.errors.wardId)}
            helperText={formik.touched.wardId && formik.errors.wardId}
          >
            {wards.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Bed Number"
            fullWidth
            {...formik.getFieldProps("bedNumber")}
            error={formik.touched.bedNumber && Boolean(formik.errors.bedNumber)}
            helperText={formik.touched.bedNumber && formik.errors.bedNumber}
          />
          <TextField
            select
            label="Status"
            fullWidth
            {...formik.getFieldProps("bedStatus")}
            error={formik.touched.bedStatus && Boolean(formik.errors.bedStatus)}
            helperText={formik.touched.bedStatus && formik.errors.bedStatus}
          >
            {BED_STATUSES.map((s) => (
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
        title="Delete Bed"
        message={`Are you sure you want to delete bed "${deleteTarget?.bedNumber}"? This action cannot be undone.`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_ICONS = [
  <ApartmentOutlinedIcon key="dept" sx={{ fontSize: 18 }} />,
  <MeetingRoomOutlinedIcon key="ward" sx={{ fontSize: 18 }} />,
  <BedOutlinedIcon key="bed" sx={{ fontSize: 18 }} />,
];

const TAB_LABELS = ["Departments", "Wards", "Beds"];

export default function DepartmentsPage() {
  const [tab, setTab] = useState(0);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);

  useEffect(() => {
    getDepartments().then((res) => {
      if (res?.status === 200) setDepartments(res.data);
    });
    getWards().then((res) => {
      if (res?.status === 200) setWards(res.data);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Departments
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: "0.92rem", mb: 3 }}>
        Manage hospital departments, wards, and bed allocations
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
        <DepartmentsTab />
      </Box>
      <Box hidden={tab !== 1}>
        <WardsTab departments={departments} />
      </Box>
      <Box hidden={tab !== 2}>
        <BedsTab wards={wards} />
      </Box>
    </Box>
  );
}
