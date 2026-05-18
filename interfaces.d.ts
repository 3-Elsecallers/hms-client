interface IAuthContext {
  authLoading?: boolean;
  loggedIn?: boolean;
  setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  setUser?: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

interface IJWTPayload {
  realm_access: {
    roles: string[];
  };
  data: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: string;
  };
  iat: number;
  iss: string;
  aud: string;
  sub: string;
  exp: number;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
}

interface ISignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// ── Admin user (full listing from API, richer than JWT payload) ──────────────
interface IAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

// ── Departments module ────────────────────────────────────────────────────────
interface IDepartment {
  id: string;
  name: string;
  description: string;
  staff: IAdminUser[];
}

interface IWard {
  id: string;
  name: string;
  departmentId: string;
  department?: IDepartment;
  floorNumber: number;
  beds: IBed[];
}

type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

interface IBed {
  id: string;
  wardId: string;
  ward?: IWard;
  bedNumber: string;
  bedStatus: BedStatus;
}

// ── Staff module ──────────────────────────────────────────────────────────────
interface IDoctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  yearsOfExperience: number;
}

type ShiftType = "MORNING" | "AFTERNOON" | "NIGHT";

interface INurse {
  id: string;
  userId: string;
  name: string;
  email: string;
  licenseNumber: string;
  ward: string;
  shift: ShiftType;
}
