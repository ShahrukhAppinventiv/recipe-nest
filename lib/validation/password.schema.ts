import * as Yup from "yup";

export const passwordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/,
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
  );