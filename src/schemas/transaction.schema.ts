import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.coerce.date().refine((d) => !Number.isNaN(d.getTime()), {
    message: "Invalid date",
  }),
  categoryId: z.string().refine(isValidObjectId, {
    message: "Invalid category ID",
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    message: "Invalid transaction type",
  }),
});
