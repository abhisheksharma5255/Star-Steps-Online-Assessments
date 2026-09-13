const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const r2 = new S3Client({
  region: "auto",

  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId:
      process.env.R2_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucketName =
  process.env.R2_BUCKET_NAME;

/*
=====================================================
UPLOAD FILE TO CLOUDFLARE R2
=====================================================
*/

async function uploadToR2({
  key,
  body,
  contentType,
  contentLength,
}: {
  key: string;
  body: any;
  contentType?: string;
  contentLength?: number;
}) {
  if (!bucketName) {
    throw new Error(
      "R2_BUCKET_NAME is not configured"
    );
  }

  const command =
    new PutObjectCommand({
      Bucket: bucketName,

      Key: key,

      Body: body,

      ContentType:
        contentType || "video/webm",

      ...(contentLength
        ? {
            ContentLength:
              contentLength,
          }
        : {}),
    });

  await r2.send(command);

  return key;
}

/*
=====================================================
GET FILE FROM CLOUDFLARE R2
=====================================================
*/

async function getFromR2(key: string) {
  if (!bucketName) {
    throw new Error(
      "R2_BUCKET_NAME is not configured"
    );
  }

  const command =
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

  return await r2.send(command);
}

/*
=====================================================
DELETE FILE FROM CLOUDFLARE R2
=====================================================
*/

async function deleteFromR2(key: string) {
  if (!bucketName) {
    throw new Error(
      "R2_BUCKET_NAME is not configured"
    );
  }

  const command =
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

  await r2.send(command);

  return true;
}

/*
=====================================================
EXPORTS
=====================================================
*/

module.exports = {
  uploadToR2,
  getFromR2,
  deleteFromR2,
};

export {};