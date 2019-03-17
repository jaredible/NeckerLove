var usernameAvailable = true;
var validating = false;

var validator = $("#registrationForm").validate({
  rules: {
    registrationUsername: {
      required: true,
      maxlength: 50,
      hasEmailFormat: true,
      checkUsernameAvailable: true
    },
    registrationPassword: {
      required: true
    }
  },
  highlight: function(element) {
    var ele = $(element);
    ele.removeClass('is-valid').addClass('is-invalid');
  },
  unhighlight: function(element) {
    var ele = $(element);
    ele.removeClass('is-invalid').addClass('is-valid');
  },
  errorPlacement: function(error, element) {
    error.insertBefore(element);
  },
  submitHandler: function(form) {
    $.ajax({
      url: form.action,
      type: form.method,
      data: $(form).serialize(),
      success: function(response) {
        if (response) {
          var obj = JSON.parse(response);
          var status = obj.status;

          if (status === 1) {
            window.location.href = '/login';
          } else if (status === 2) {
            usernameAvailable = false;
          }
        }

        validator.form();
      }
    });
  }
});

$(function() {
  validator.form();
  $('#registrationUsername').focus();
});

$.validator.addMethod('hasEmailFormat', function(value, element) {
  return this.optional(element) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{1,5})$/.test(value);
}, 'Please enter a valid email address.');

$.validator.addMethod('checkUsernameAvailable', function(value, element) {
  // TODO: getting called too frequently

  if (!validating) {
    $.ajax({
      url: '/getUsernameStatus',
      type: 'POST',
      data: JSON.stringify({
        userName: element.value
      }),
      success: function(response) {
        validating = false;

        if (response) {
          var obj = JSON.parse(response);
          var status = obj.status;

          var previousUsernameAvailable = usernameAvailable;

          if (status === 1) {
            usernameAvailable = true;
          } else if (status === 2) {
            usernameAvailable = false;
          }

          if (usernameAvailable !== previousUsernameAvailable) validator.form();
        }
      }
    });
  }

  validating = true;

  return usernameAvailable;
}, 'Username already exists!');
