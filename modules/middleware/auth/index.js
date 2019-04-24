const validate = (request, username, password) => {
    return true;
}



server.auth.strategy('simple', 'basic', {
    validate: validate
});

server.register(
    require('hapi-auth-cookie', (er) => {
        if (er) {
            throw er;
        }

        server.auth.strategy('session', 'cookie', {
            password: 'secret',
            cookie: 'session',
            redirectTo: 'login',
            isSecure: false,
            ttl: 24 * 60 * 60 * 1000
        });

        // Print some information about the incoming request for debugging purposes
        server.ext('onRequest', function (request, next) {
            console.log(request.path, request.query);
            next();
        });

        server.route(Routes.endpoints);

        // Start the server
        server.start(function () {
            console.log("The server has started on port: " + server.info.port);
        });
    }));