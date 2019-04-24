'use strict';

const bcrypt = require("bcrypt");

function SecurityService() {

    this.hashPassword = async (password) => {
        const saltRounds = 10;

        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    reject(err);
                }

                resolve(hash);
            });
        })

        return hashedPassword;
    };

    return { getHash: this.hashPassword };
}

module.exports = {
    SecurityService: SecurityService
};