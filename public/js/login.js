$.validator.setDefaults({
  debug: false
});

var validator = $("#form-login").validate({
  errorElement: "div",
  errorClass: "text-danger",
  rules: {
    inputEmail: {
      required: true,
      maxlength: 50,
      email: true
    },
    inputPassword: {
      required: true
    }
  },
  messages: {
    inputEmail: {
      required: "Email is required."
    },
    inputPassword: {
      required: "Password is required."
    }
  },
  highlight: function(element, errorClass) {
    var ele = $(element);
    ele.removeClass("is-valid").addClass("is-invalid");
  },
  unhighlight: function(element, errorClass) {
    var ele = $(element);
    ele.removeClass("is-invalid");
  },
  errorPlacement: function(error, element) {
    error.insertBefore(element);
  },
  submitHandler: function(form) {
    $.ajax({
      type: form.method,
      url: "/account/authenticate",
      data: $(form).serialize(),
      success: function(data) {
        if (data) form.submit();
        else {
          validator.showErrors({
            "inputEmail": "The username or password is incorrect.",
            "inputPassword": ""
          });
        }
      },
      error: function(data) {
        console.error(data);
      }
    });
  }
});
