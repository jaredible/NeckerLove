$.validator.setDefaults({
  debug: false
});

var validator = $("#form-search").validate({
  errorElement: "div",
  errorClass: "text-danger",
  errorLabelContainer: "#search-error",
  rules: {
    searchQuery: {
      maxlength: 1000
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
    error.insertAfter(element);
  },
  submitHandler: function(form) {
    $.ajax({
      type: form.method,
      url: form.action,
      data: $(form).serialize(),
      success: function(data) {
        var profilesList = $("#profiles-wrapper");
        profilesList.empty();
        $.each(data, function(index) {
          var profile = data[index];

          var userName = profile.userName;
          var firstName = profile.firstName;
          var lastName = profile.lastName;
          var interests = profile.interests;
          var state = profile.state;

          var col = $("<div>", {
            class: "col-xs-12 col-sm-6 col-md-4 mt-3 mb-2 align-self-center justify-content-center"
          });
          var card = $("<div>", {
            class: "card rounded"
          });

          var cardBody = $("<div>", {
            class: "card-body shadow-lg text-center p-1 bg-light rounded"
          });
          var cardImage = $("<img>", {
            class: "card-img shadow-sm mb-1 lazy",
            src: "/img/defaultProfileImage.jpg",
            alt: `${firstName} ${lastName} profile picture`,
            "data-src": `/account/findProfileImageByUserName?email=${userName}`
          });
          var cardTitle = $("<h4>", {
            class: "card-text font-weight-bold text-dark p-1"
          }).text(`${firstName} ${lastName}`);
          var cardState = $("<p>", {
            class: "card-text font-weight-normal text-dark"
          }).text(state);
          var cardInterests = $("<p>", {
            class: "card-footer font-weight-light"
          }).text(interests);

          var likeBtn = $("<button>", {
            class: "btn btn-primary btn-sm shadow-sm font-weight-light ml-1 mr-1"
          });
          var thumbsUp = $("<i>", {
            class: "far fa-thumbs-up"
          });
          likeBtn.append('Like ');
          likeBtn.append(thumbsUp);

          var loveBtn = $("<button>", {
            class: "btn btn-danger btn-sm shadow-sm font-weight-light ml-1 mr-1"
          });
          var heart = $("<i>", {
            class: "far fa-heart"
          });
          loveBtn.append('Love ');
          loveBtn.append(heart);

          var messageBtn = $("<button>", {
            class: "btn btn-success btn-sm shadow-sm font-weight-light ml-1 mr-1"
          });
          var mail = $("<i>", {
            class: "far fa-envelope"
          });
          messageBtn.append('DM ');
          messageBtn.append(mail);

          if (userName) cardBody.append(cardImage);
          if (firstName || lastName) cardBody.append(cardTitle);
          if (state) cardBody.append(cardState);
          if (interests) cardBody.append(cardInterests);
          cardBody.append(likeBtn);
          cardBody.append(messageBtn);
          cardBody.append(loveBtn);

          card.append(cardBody);
          col.append(card);

          card.css("display", "none");
          card.delay(100 * index).fadeIn(1000);

          profilesList.append(col);
        });

        $('.lazy').Lazy({
          placeholder: "/img/loading.gif"
        });
      },
      error: function(data) {
        console.error(data);
      }
    });
  }
});

$(function() {
  $("#form-search").delay(100).fadeIn(1000);
});
