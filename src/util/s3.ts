import * as Aws from 'aws-sdk';
import { s3Credentials } from './cli-config';

export function S3(opts: { region: string }) {
  return new Aws.S3({
    region: opts.region,
    ...JSON.parse(Buffer.from(s3Credentials, 'base64').toString('utf-8')),
  });
}
