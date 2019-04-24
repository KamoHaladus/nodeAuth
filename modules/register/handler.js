'use strict';
const User = require('../../models/User');
const Boom = require('boom');
const exception = require('../common/exception');
const service = require('../../services/securityService');
const Exception = exception.Exception;
const SecurityService = service.SecurityService;

function registrationHandler() {
    this.handle = async (request, h) => {
        // użyć joi??
        const { email, name, password, passConfirm } = request.payload;
        const er = new Exception();
        // wycignac do walidatora
        if (!email || !name || !password || !passConfirm) {
            er.errors.push({ msg: 'Fill it all' });
        }
        // sprawdzić poprawnośćhaseł w walidatorz ?? lub bcrypt.compare
        if (password !== passConfirm) {
            er.errors.push({ msg: 'Password mismatch' });
        }
        // chyba zmienię syganturę exception
        if (er.errors.length > 0) {
            return h.view('register', { ...er, email: email, name: name, password: password, password2: passConfirm });
        }

        let security = new SecurityService();
        let hashed = await security.getHash(password);
        const promise = await new Promise((resolve, reject) => {
            User.findOne({ email: email }).then((user) => {
                if (user) {
                    const er = new Exception();
                    er.errors.push({ msg: 'user exist' });

                    resolve(h.view('register', { ...er, email: email, name: name }));
                } else {
                    const newUser = new User({ name: name, email: email, password: hashed });

                    newUser.save()
                        .then(() => {
                            resolve(h.redirect('login', { email, password }));
                        }).catch((ex) => {
                            if (ex) {
                                reject(Boom.notFound('db error'));
                            }
                        });
                }
            });
        });

        return promise;
    }
}

module.exports = {
    register: registrationHandler
};