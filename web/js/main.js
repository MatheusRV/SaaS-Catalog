$('.tabs li').click(function() {
  id = ($(this).attr('id')).split('-');
  $('.tabs li').removeClass('current');
  $('section').removeClass('current');
  $('#t-' + id[1]).addClass('current');
  $('#s-' + id[1]).addClass('current');
});

// Outdated-Browser - http://outdatedbrowser.com
$(document).ready(function() {
  outdatedBrowser({
    bgColor: '#f25648',
    color: '#ffffff',
    lowerThan: 'transform',
    languagePath: 'lang/pt-br.html'
  })
})