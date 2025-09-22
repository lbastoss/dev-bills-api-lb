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

export const getTransactionsSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      message: "Invalid transaction type",
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      message: "Invalid category ID",
    })
    .optional(),
});

export const getTransactionsSummarySchema = z.object({
  month: z.string({ message: "Month is required" }),
  year: z.string({ message: "Year is required" }),
});

export const deleteTransactionSchema = z.object({
  id: z.string().refine(isValidObjectId, {
    message: "Invalid ID",
  }),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
