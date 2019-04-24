'use strict';

function Exception() {
    return {
        errors: [],
        error_msg: '',
        success_msg: '',
        error: ''
    };
};

module.exports = {
    Exception: Exception
};