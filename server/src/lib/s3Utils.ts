import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT_URL, 
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

const CDN_BASE_URL = process.env.CDN_WORKER_URL

// export async function generateSignedUrl(key: string, bucketName: string): Promise<string> {
//   const getObjectCommand = new GetObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//   });

//   const signedUrl = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 }); 
//   console.log("Signed URL: ", signedUrl)
//   return signedUrl;
// }

export async function generateSignedUrl(key: string, bucketName: string): Promise<string> {
  console.log(`Signed URL: ${CDN_BASE_URL}/${key}`)
  return `${CDN_BASE_URL}/${key}`;
}