'use strict';

export function getCvUrl() {
    const fileName = 'resume_tommi-lepola.pdf';
    return new Promise((resolve, reject) =>
        process.env.BUCKET && process.env.REGION
            ? resolve({
                  fileUrl: `https://s3.${process.env.REGION}.amazonaws.com/${process.env.BUCKET}/${fileName}`,
              })
            : reject(new Error('Bucket or region not defined.'))
    );
}
