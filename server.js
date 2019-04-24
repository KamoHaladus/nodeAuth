'use strict'
const Path = require('path');
const Glue = require('glue');
const Ejs = require('ejs');
const Mongoose = require('mongoose');
const Package = require('./package')
const PORT = process.env.PORT || 5000;
const db = require('./config/keys').MongoURI;

Mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


const manifest = {
    server: {
        port: PORT,
        host: 'localhost',
        routes: { // this is probably wrong approach for medium size systems 
            validate: {
                failAction: async (request, h, err) => {
                    if (process.env.NODE_ENV === 'production') {
                        // In prod, log a limited error message and throw the default Bad Request error.
                        console.error('ValidationError:', err.message); // Better to use an actual logger here.
                        throw Boom.badRequest(`Invalid request payload input`);
                    } else {
                        // During development, log and respond with the full error.
                        console.error(err);
                        throw err;
                    }
                }
            }
        }
    },
    register: {
        plugins: [{
                plugin: './modules/home'
            },
            {
                plugin: './modules/login'
            },
            {
                plugin: './modules/register'
            },
            {
                plugin: require('inert')
            },
            {
                plugin: require('vision')
            },
            {
                plugin: require('hapi-swagger'),
                options: {
                    info: {
                        title: 'Test API Documentation',
                        version: Package.version
                    }
                }
            }
        ]
    }
};

const options = {
    relativeTo: `${__dirname}`
};

const startServer = async () => {
    try {
        const server = await Glue.compose(manifest, options);
        const viewPath = Path.resolve(__dirname, 'views')

        await server.views({
            engines: {
                ejs: Ejs
            },
            relativeTo: __dirname,
            path: viewPath,
            partialsPath: Path.resolve(viewPath, 'partials'),
            allowAbsolutePaths: true,
            layout: true
        });

        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

startServer();