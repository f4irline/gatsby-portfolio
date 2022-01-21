'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');
const client = new AWS.S3({
    region: 'eu-central-1',
});

export function getCvUrl() {
    return client
        .getObject({
            Bucket: process.env.BUCKET,
            Key: 'resume_tommi-lepola.pdf',
        })
        .promise();
}
