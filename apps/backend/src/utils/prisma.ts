import { PrismaClient } from "@prisma/client";

let client: PrismaClient;

export const getPrismaInstance = () => {
  if (!client) {
    client = new PrismaClient();
  }
  return client;
};
export default getPrismaInstance;
