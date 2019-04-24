const plugin = {
    register: (server, options) => {
        server.route({
            path: '/',
            method: 'GET',
            options: {
                tags: ['api']
            },
            handler: (request, h) => {
                return h.view('welcome');
            }
        });
    },
    name: "home",
    version: "1.0.0"
};

module.exports = plugin;