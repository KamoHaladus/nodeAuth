'use strict';
const pkg = require('./package')

const plugin = {
    register: (server, options) => {
        server.route({
            method: 'GET',
            path: '/login',
            config: {
                tags: ['api']
            },
            handler: (request, h) => h.view('login')
        });

        server.route({
            method: 'POST',
            path: '/login',
            options: {
                tags: ['api']
            },
            handler: (request, h) => h.view('login')
        });
    },
    name: pkg.name,
    version: pkg.version
};

module.exports = plugin;