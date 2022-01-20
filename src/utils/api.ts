export const getCvBlob = async () => {
    const response = await fetch(
        'http://www.africau.edu/images/default/sample.pdf',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        }
    );
    return response.blob();
};
