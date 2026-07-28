import { Client } from "minio";

let minioClient: Client | null = null;

function getMinioClient(): Client {
  if (!minioClient) {
    minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || "localhost",
      port: parseInt(process.env.MINIO_PORT || "9000"),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
      secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
    });
  }
  return minioClient;
}

export async function ensureBucketExists(bucket: string): Promise<void> {
  const client = getMinioClient();
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket, "us-east-1");
    // Set public read policy for the bucket
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };
    await client.setBucketPolicy(bucket, JSON.stringify(policy));
  }
}

export async function uploadToMinio(
  bucket: string,
  key: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const client = getMinioClient();
  await ensureBucketExists(bucket);

  await client.putObject(bucket, key, buffer, buffer.length, {
    "Content-Type": mimeType,
  });

  const endpoint = process.env.MINIO_ENDPOINT || "localhost";
  const port = process.env.MINIO_PORT || "9000";
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const protocol = useSsl ? "https" : "http";

  return `${protocol}://${endpoint}:${port}/${bucket}/${key}`;
}

export async function deleteFromMinio(
  bucket: string,
  key: string
): Promise<void> {
  const client = getMinioClient();
  await client.removeObject(bucket, key);
}

export async function getMinioUrl(
  bucket: string,
  key: string
): Promise<string> {
  const endpoint = process.env.MINIO_ENDPOINT || "localhost";
  const port = process.env.MINIO_PORT || "9000";
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const protocol = useSsl ? "https" : "http";

  return `${protocol}://${endpoint}:${port}/${bucket}/${key}`;
}
