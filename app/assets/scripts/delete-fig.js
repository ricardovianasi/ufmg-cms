$(document).ready(function(){
  $(".fig-delete").on('click', function(event) {
    console.log('adsdaas');
    event.preventDefault();
    $(this).parent('figure').remove();
  });
});
