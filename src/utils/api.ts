export const getCvUrl = async () => {
    // const response = await fetch(`${process.env.LAMBDA_ENDPOINT_URL}/cv_url`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/pdf',
    //     },
    // });
    const response = await fetch(
        'https://dypbcd1pl9.execute-api.eu-central-1.amazonaws.com/cv_url',
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
