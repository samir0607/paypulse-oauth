// import multer from "multer";
// import path from "node:path";
// import minioClient from "./MinioClient";
// import multerS3 from "multer-s3";
// import { Request } from "express";

// const USE_MINIO = process.env.USE_MINIO === "true";
// const MINIO_BUCKET = process.env.MINIO_BUCKET || "paypulse";

export const getDate = () => {
    return new Date();
}

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../../public/uploads');
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//     },
// })

// function createS3Storage(prefix: string) {
//     if (!USE_MINIO) {
//       throw new Error("createS3Storage called but USE_MINIO is not enabled");
//     }
    
//     return multerS3({
//       s3: minioClient(),
//       bucket: MINIO_BUCKET,
//       key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
//         const timestamp = Date.now();
//         const random = Math.random().toString(36).slice(2);
//         const ext = path.extname(file.originalname);
//         const filename = `${file.fieldname}-${timestamp}-${random}${ext}`;
//         const key = prefix ? `${prefix}/${filename}` : filename;
//         cb(null, key);
//       },
//       contentType: (req: Request, file: Express.Multer.File, cb: (error: any, contentType?: string) => void) => {
//         cb(null, file.mimetype);
//       },
//       metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//     });
//   }

// function getStorage() {
//     if (USE_MINIO) {
//         return createS3Storage("");
//     }
//     return storage;
// }

// export function generatePassword(length: number) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * chars.length);
//       password += chars[randomIndex];
//     }
//     return password;
// }

// export const upload = multer({ storage: getStorage(), limits: { fileSize: 1048576 } });