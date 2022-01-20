'use strict';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({ region: 'eu-central-1' });

module.exports.getCvUrl = async () => {
    return client.send(
        new GetObjectCommand({
            Bucket: process.env.BUCKET,
            Key: 'resume_tommi-lepola.pdf',
        })
    );
};
