import { Response } from "express";

export default function ErrorHandler(error: unknown, res: Response) {
  if (error instanceof Error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
  return res
    .status(500)
    .json({ status: "failed", message: "Internal Server Error" });
}
