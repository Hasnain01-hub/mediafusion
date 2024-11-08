// types/custom.d.ts

import { NextApiRequest } from "next";
import { Multer } from "multer";

declare module "next" {
  interface NextApiRequest {
    file?: Express.Multer.File; // Add the file property
    files?: Express.Multer.File[]; // Add files property if needed
  }
}
