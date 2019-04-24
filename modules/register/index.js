'use strict';
const Registration = require('./handler').register;
const Exception = require('../common/exception').Exception;
const Joi = require('joi');
const pkg = require('./package')

const plugin = {
    register: (server, options) => {
        server.route({
            method: 'GET',
            path: '/register',
            config: {
                tags: ['api']
            },
            handler: (request, h) => h.view('register', {
                ...new Exception()
            })
        });

        server.route({
            method: 'POST',
            path: '/register',
            config: {
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(1).max(254).required(),
                        email: Joi.string().email().required(), // email validation sucks
                        password: Joi.string().strip().required(),
                        passConfirm: Joi.ref('password')
                    }).options({
                        stripUnknown: true
                    })
                }
            },
            handler: async (request, h) => await new Registration().handle(request, h)
        });
    },
    name: pkg.name,
    version: pkg.version
};

module.exports = plugin;