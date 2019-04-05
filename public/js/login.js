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
    ele.removeClass("is-invalid").addClass('is-valid');
  },
  submitHandler: function(form) {
    console.log("in here");
    form.submit();
  }
});

$(function() {
  validator.form();
});
