import { Response } from "express";

export class ResponseHandler {
  static sendSuccessResponse(res: Response, message: string, data?: any) {
    res.status(200).send({
      status: "success",
      message,
      data,
    });
  }
}
