$.validator.setDefaults({});

var validator = $("#form-login").validate({
  errorElement: "div",
  errorClass: "invalid-response",
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
  highlight: function(element, errorClass) {
    var ele = $(element);
    ele.removeClass("is-valid").addClass("is-invalid");
  },
  unhighlight: function(element, errorClass) {
    var ele = $(element);
    ele.removeClass("is-invalid");
  },
  submitHandler: function(form) {
    console.log("in here");
  }
});

$(function() {
  validator.form();
});
