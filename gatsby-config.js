module.exports = {
    plugins: [
        'gatsby-plugin-typescript',
        'gatsby-plugin-sass',
        {
            resolve: 'gatsby-plugin-eslint',
            options: {
                test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
                exclude: /(node_modules|.cache|public)/,
                stages: ['develop'],
                options: {
                    emitWarning: true,
                    failOnError: false,
                },
            },
        },
        {
            resolve: `gatsby-plugin-s3`,
            options: {
                bucketName: 'tommilepola.fi',
            },
        },
    ],
};
