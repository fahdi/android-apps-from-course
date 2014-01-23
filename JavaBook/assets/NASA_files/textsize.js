(jQuery)(document).ready(function(){
  // Increase Font Size
  (jQuery)(".increaseFont").click(function(){
    var currentFontSize = (jQuery)('.resize-txt').css('font-size');
    var currentFontSizeNum = parseFloat(currentFontSize, 10);
    var newFontSize = currentFontSizeNum*1.2;
   (jQuery)('.resize-txt').css('font-size', newFontSize);
    return false;
  });
  // Decrease Font Size
  (jQuery)(".decreaseFont").click(function(){
    var currentFontSize = (jQuery)('.resize-txt').css('font-size');
    var currentFontSizeNum = parseFloat(currentFontSize, 10);
    var newFontSize = currentFontSizeNum*0.8;
    (jQuery)('.resize-txt').css('font-size', newFontSize);
    return false;
  });
});