import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const bucketName = process.env.R2_BUCKET_NAME!

export interface UploadParams {
  file: File
  folder?: string
  fileName?: string
  key?: string // when provided, folder/fileName is ignored
  cacheControl?: string
  contentDisposition?: string
  metadata?: Record<string, string>
}

export interface UploadResult {
  key: string
  url: string
  publicUrl: string
  size: number
  type: string
}

/**
 * Upload file to Cloudflare R2
 */
export async function uploadToR2({ file, folder = 'uploads', fileName, key: providedKey, cacheControl = 'public, max-age=31536000, immutable', contentDisposition, metadata }: UploadParams): Promise<UploadResult> {
  const timestamp = Date.now()
  const safeName = fileName || `${timestamp}-${file.name}`
  const key = providedKey || `${folder}/${safeName}`

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
    ContentLength: file.size,
    CacheControl: cacheControl,
    ContentDisposition: contentDisposition,
    Metadata: metadata,
  })

  await r2Client.send(command)

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`

  return {
    key,
    url: publicUrl,
    publicUrl,
    size: file.size,
    type: file.type,
  }
}

/**
 * Generate signed URL for private file access
 */
export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * Delete file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  await r2Client.send(command)
}

/**
 * Generate presigned upload URL for direct client uploads
 */
export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 })
}