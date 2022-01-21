const LAMBDA_URL =
    process.env.NODE_ENV === 'development' ? '' : process.env.LAMBDA_ENDPOINT;

export const getCvUrl = async () => {
    const response = await fetch(`${LAMBDA_URL}/cv_url`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
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
