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
      url: '/profile',
      type: 'POST',
      data: new FormData(),
      processData: true,
      success: function(response) {
        console.log(response);

        if (response) {
          var obj = JSON.parse(response);
          var status = obj.status;

          if (status === 1) {
            window.location.href = '/find'
          } else if (status === 2) {}
        }
      }
    });
  }
});

$(function() {
  $("#profileImage").change(function() {
    readURL(this);
  });
  $('#profileFirstName').focus();

  loadUserProfileData();
});

function loadUserProfileData(userName) {
  var userName = getCookie('userName');

  if (userName) {
    $.ajax({
      url: '/getUserProfile',
      type: 'POST',
      data: JSON.stringify({
        userName: userName
      }),
      success: function(response) {
        console.log(response);
      }
    });
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
    reader.readAsDataURL(input.files[0]);
  }
}
