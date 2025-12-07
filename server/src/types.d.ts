// 1. Declare the missing module to fix the TS7016 error
declare module 'multer-s3-v3';

// 2. Enhance Express Request types for Multer files (Optional, but recommended)
// This lets you use `req.file.key` without using `as any` every time.
declare namespace Express {
    interface Request {
        file: {
            key: string;
            location: string;
            // Add other properties you might use from req.file
        } | undefined;
    }
}