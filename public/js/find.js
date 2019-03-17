$(function() {
  $('#findForm').submit(function(e) {
    e.preventDefault();

    var searchOption = $('#findInterests').is(':checked') ? 1 : 2;
    var searchText = $('#findSearch').val().replace(/\s*,\s*/g, '|').trim();

    $.ajax({
      url: '/find',
      type: 'POST',
      data: JSON.stringify({
        searchOption: searchOption,
        searchText: searchText
      }),
      success: function(response) {
        console.log(response);

        $('html').html(response);
      }
    });
  });
});
