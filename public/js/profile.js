var profile = this;

var validator = $("#profileForm").validate({
  rules: {
    profileImage: {
      accept: "image/*"
    },
    profileFirstName: {
      maxlength: 50
    },
    profileLastName: {
      maxlength: 50
    },
    profileInterests: {
      maxlength: 2000
    },
    profileLocality: {
      maxlength: 52
    }
  },
  ignore: [],
  highlight: function(element) {
    var ele = $(element);
    ele.removeClass('is-valid').addClass('is-invalid');
  },
  unhighlight: function(element) {
    var ele = $(element);
    ele.removeClass('is-invalid').removeClass('is-valid');
    if (ele.val()) ele.addClass('is-valid');
  },
  errorPlacement: function(error, element) {
    var ele = $(element);
    if (ele.attr('name') !== 'profileImage') error.insertBefore(element);
  },
  submitHandler: function(form) {
    $.ajax({
      url: form.action,
      type: form.method,
      data: new FormData(),
      success: function(response) {
        console.log(response);
      }
    });
  }
});

$(function() {
  // validator.form();
  $('#profileFirstName').focus();
});
