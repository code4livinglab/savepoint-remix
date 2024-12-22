import { S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers'

const globalForS3 = globalThis as unknown as { s3Client: S3Client }

export const s3Client =
  globalForS3.s3Client || new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: process.env.BUCKET_REGION },
      identityPoolId: process.env.IDENTITY_POOL_ID as string,
    }),
  })

if (process.env.NODE_ENV !== 'production') globalForS3.s3Client = s3Client
