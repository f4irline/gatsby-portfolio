const LAMBDA_DEV_URL = '';

export const getCvUrl = async () => {
    const response = await fetch(
        `${
            process.env.NODE_ENV === 'development'
                ? LAMBDA_DEV_URL
                : process.env.GATSBY_LAMBDA_ENDPOINT
        }/cv_url`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    const { fileUrl } = await response.json();
    return fileUrl;
};

export const getCvBlob = async (url: string) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    });
    return response.blob();
};
