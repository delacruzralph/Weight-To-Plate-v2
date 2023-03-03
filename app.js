$(document).ready(function () {
  $(document).on('click', '.btn-toggle', function (event) {
    event.preventDefault();
    $(this).find('.btn').toggleClass('active');

    if ($(this).find('.btn-primary').length > 0) {
      $(this).find('.btn').toggleClass('btn-primary');
    }
    if ($(this).find('.btn-danger').length > 0) {
      $(this).find('.btn').toggleClass('btn-danger');
    }
    if ($(this).find('.btn-success').length > 0) {
      $(this).find('.btn').toggleClass('btn-success');
    }
    if ($(this).find('.btn-info').length > 0) {
      $(this).find('.btn').toggleClass('btn-info');
    }

    $(this).find('.btn').toggleClass('btn-default');


  });
  $(document).on('click', '#more-settings-btn', function (event) {
    event.preventDefault();
    console.log("settings");
    // your code to handle the button click goes here
  });
});