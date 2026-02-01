import { LoginInput } from "@/lib/interface/auth.interface";
import { CreateCustomerData } from "@/lib/interface/customer.interface";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const PostLogin = async (data: LoginInput) => {
  const user = await prisma.customer.findUnique({
    where: { email: data.email },
    include: { Profile: true },
  });

  if (!user)
    throw new Error("Invalid Email Address or Password. Please try again!");

  const valid = await bcrypt.compare(data.password, user.password);

  if (!valid)
    throw new Error("Invalid Email Address or Password. Please try again");

  const token = jwt.sign(
    { user_id: user.customer_id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  return { token, user };
};

export const RegisterCustomer = async (data: CreateCustomerData) => {
  const pass = await bcrypt.hash(data.password, 12);

  return await prisma.customer.create({
    data: {
      email: data.email,
      password: pass,
      Profile: {
        create: { first_name: data.first_name, last_name: data.last_name },
      },
    },
  });
};
