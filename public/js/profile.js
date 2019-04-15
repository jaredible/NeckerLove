$(function() {
  setupFileInput();

  $("#profileImage").delay(100).fadeIn(1000);
  $("#inputFirstName").delay(200).fadeIn(1000);
  $("#inputLastName").delay(300).fadeIn(100);
  $("#inputInterests").delay(400).fadeIn(1000);
  $("#inputState").delay(500).fadeIn(1000);
  $("#inputSubmit").delay(600).fadeIn(1000);

  $('#inputImage').on('fileerror', function() {
    setTimeout(function() {
      $('#kv-error-2').fadeOut(500, function() {
        $('#inputImage').fileinput('reset');
        $('.lazy').Lazy();
      });
    }, 5000);

    $('.kv-error-close').on('click', function() {
      refreshFileInput();
    });

    $('.fileinput-remove-button').on('click', function() {
      refreshFileInput();
    });
  });

  $('.saved-close').on('click', function() {
    $('#saved').fadeOut(500);
  });
});

$.validator.setDefaults({
  debug: false
});

var validator = $("#form-profile").validate({
  errorElement: "div",
  errorClass: "text-danger",
  rules: {
    inputFirstName: {
      maxlength: 50
    },
    inputLastName: {
      maxlength: 50
    },
    inputInterests: {
      maxlength: 2000
    },
    inputState: {
      maxlength: 52
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
      method: form.method,
      url: form.action,
      data: new FormData(form),
      cache: false,
      contentType: false,
      processData: false,
      success: function() {
        refreshFileInput();
        showSaveConfirmation();
      },
      error: function(data) {
        console.error(data);
      }
    });
  }
});

function setupFileInput() {
  $("#inputImage").fileinput({
    overwriteInitial: true,
    maxFileSize: 10000,
    showClose: false,
    showCaption: false,
    showBrowse: false,
    browseOnZoneClick: true,
    removeLabel: '',
    removeIcon: '<i class="fas fa-times"></i>',
    removeTitle: 'Cancel or reset changes',
    previewZoomButtonIcons: {
      toggleheader: '<i class="fas fa-arrows-alt-v"></i>',
      fullscreen: '<i class="fas fa-expand-arrows-alt"></i>',
      borderless: '<i class="fas fa-expand"></i>',
      close: '<i class="fas fa-times"></i>'
    },
    elErrorContainer: '#kv-error-2',
    msgErrorClass: 'alert alert-block alert-danger',
    defaultPreviewContent: '<img class="lazy" src="/img/defaultProfileImage.jpg" alt="profile picture" data-src="/account/findProfileImageBySession?n=' + (new Date()).getTime() + '" style="width:100%; margin: auto;">',
    layoutTemplates: {
      main2: '{preview} {remove} {browse}'
    },
    allowedFileExtensions: ["jpg", "jpeg", "png", "gif"],
    purifyHtml: true,
    fileActionSettings: {
      zoomIcon: '<i class="fas fa-search"></i>'
    }
  });

  $('.lazy').Lazy();
}

function refreshFileInput() {
  $("#inputImage").fileinput('clear');
  $("#inputImage").fileinput('destroy');
  setupFileInput();
}

function showSaveConfirmation() {
  $('#saved').fadeIn(500, function() {
    setTimeout(function() {
      $('#saved').fadeOut(500);
    }, 5000);
  });
}
