import type { NextFunction, Request, Response } from "express";

export function validateMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "messages must be a non-empty array" });
  }
  next(); // valid → continue to the route
}
