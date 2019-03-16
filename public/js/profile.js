$('#tokenfield').tokenfield({
  limit: 12
});

$(function() {
  var count = $(".tokenfield").children(".token").length;
  console.log(count);
});
