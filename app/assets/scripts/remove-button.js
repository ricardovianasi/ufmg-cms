// Remove Button

$(document).on('mouseenter', '.figure-removable', function() {
  $(this).append('<span class="remove-button btn btn-danger" style="position:absolute; right:10px; bottom: 0px;">x Remover</span>');
});
$(document).on('mouseleave', '.figure-removable', function() {
  $('.remove-button').remove();
});
$(document).on('click', '.remove-button', function (event) {
  $(this).closest('.figure-removable').remove();
});


