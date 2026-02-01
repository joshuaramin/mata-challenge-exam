import z from "zod";

export const UserSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const ProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const CreateCustomerSchema = UserSchema.extend(ProfileSchema.shape);
