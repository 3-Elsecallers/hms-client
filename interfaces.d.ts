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