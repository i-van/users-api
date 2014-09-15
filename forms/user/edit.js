
var validators = require('validation/validators')
  , UserCreateValidation = require('./create');

module.exports = UserCreateValidation.extend({
    _password: function() {
        if (this.values.password) {
            UserCreateValidation.prototype._password.call(this);
        }
    },
    _login: function() {
        this.add('login', validators.notEmpty, 'Login is required', true);
        this.add(
            'login',
            validators.noRecordExists('User', { login: this.values.login, _id: { $ne: this.values.id } }),
            'Such User has been already registered'
        )
    }
});
