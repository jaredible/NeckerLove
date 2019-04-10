$.validator.setDefaults({
  debug: false
});

var validator = $("#form-register").validate({
  errorElement: "div",
  errorClass: "text-danger",
  rules: {
    inputEmail: {
      required: true,
      maxlength: 50,
      email: true,
      remote: {
        url: "findProfileByEmail",
        type: "post",
        data: {
          email: function() {
            return $('#form-register:input[name="inputEmail"]').val();
          }
        }
      }
    },
    inputPassword: {
      required: true
    },
    inputConfirm: {
      required: true,
      equalTo: "#inputPassword"
    }
  },
  messages: {
    inputEmail: {
      required: "Email is required.",
      remote: "Email already in use."
    },
    inputPassword: {
      required: "Password is required."
    },
    inputConfirm: {
      equalTo: "Please enter your password again."
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
    form.submit();
  }
});

$(function() {
  validator.form();
});
