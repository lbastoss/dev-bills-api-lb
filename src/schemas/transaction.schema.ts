import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransaction = z.object({
  categoryId: z.string().refine(isValidObjectId, {
    message: "Invalid category ID",
  }),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: "Invalid date",
  }),
  type: z.nativeEnum(TransactionType, {
    message: "Invalid transaction type",
  }),
});
