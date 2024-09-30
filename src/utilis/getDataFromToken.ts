import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
    };
    return decodedToken.id;
  } catch (e: unknown) {
    const error = e as Error;
    throw new Error(error.message);
  }
};
