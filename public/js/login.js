var validator = $("#loginForm").validate({
  rules: {
    loginUsername: {
      required: true,
      maxlength: 50,
      hasEmailFormat: true
    },
    loginPassword: {
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
        console.log(response);

        validator.form();
      }
    });
  }
});

$(function() {
  validator.form();
  $('#loginUsername').focus();
});

$.validator.addMethod('hasEmailFormat', function(value, element) {
  return this.optional(element) || /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{1,5})$/.test(value);
}, 'Please enter a valid email address.');
