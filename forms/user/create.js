
var Validation = require('validation')
  , validators = require('validation/validators');

module.exports = Validation.extend({
    init: function() {
        this._firstName();
        this._lastName();
        this._email();
        this._login();
        this._password();
    },
    _firstName: function() {
        this.add('firstName', validators.notEmpty, 'First name is required');
    },
    _lastName: function() {
        this.add('lastName', validators.notEmpty, 'Last name is required');
    },
    _email: function() {
        this.add('email', validators.notEmpty, 'Email is required', true)
            .add('email', validators.isEmail, 'Email is not correct');
    },
    _login: function() {
        this.add('login', validators.notEmpty, 'Login is required', true);
        this.add(
            'login',
            validators.noRecordExists('User', { login: this.values.login }),
            'Such User has been already registered'
        );
    },
    _password: function() {
        this.add('password', validators.notEmpty, 'Password is required', true)
            .add('password', validators.length(6), 'Password length should be greater than 6', true)
            .add('password', validators.equalField('passwordConfirmation'), 'Passwords should be matched');
    }
});
