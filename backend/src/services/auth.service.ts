import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { adminLoginSchema } from "../validators/auth.validators.js";

export const loginAdmin = async (rawBody: unknown) => {
  const body = adminLoginSchema.parse(rawBody);
  const admin = await prisma.adminUser.findUnique({ where: { email: body.email } });

  if (!admin) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(body.password, admin.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      role: admin.role
    },
    env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  };
};
