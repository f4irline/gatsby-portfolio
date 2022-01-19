module.exports = {
    plugins: [
        'gatsby-plugin-sass',
        {
            resolve: `gatsby-plugin-s3`,
            options: {
                bucketName: 'tommilepola.fi',
            },
        },
    ],
};
