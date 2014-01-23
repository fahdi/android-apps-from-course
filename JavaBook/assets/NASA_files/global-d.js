/* Javascript for feature page image placement */

jQuery(document).ready(function($) { 
  if ($('body.node-type-feature')[0]) {
/*
    parentelement = 'div#top-images>div>div>div>div.field-items, div#side-images>div>div>div>div.field-items';
    var imageselement = 'div.embedded-images>div>div>div>div.field-items';
    var contentelement = '#feature-content>div>div>div>div.field-item';
    $(imageselement).children().each(function () {
      imgtoken = $(this).find("div[class*='field-name-field-image-token']").children().children().html(); //user-defined token(s)
      if ($(this).find("div[class*='field-name-field-featuresideimages']").children().children().children("img").length > 0) {
        imagesrc = $(this).find("div[class*='field-name-field-featuresideimages']").children().children().children("img").attr("src").replace('/styles/226xvariable_height/public/', '/').replace('/styles/673xvariable_height/public/', '/');
        imagetag = $(this).find("div[class*='field-name-field-featuresideimages']").children().children().html();
        $(this).find("div[class*='field-name-field-featuresideimages']").children().children().html('<a href="' + imagesrc + '">' + imagetag + '</a>');
      }
      animation = $(this).find("div[class*='field-name-field-animated-gif']").children().children().children("img").attr("src");
      youtube = $(this).find("div[class*='field-name-field-youtube-embed']").children().children().html();
      $(this).children().addClass('featureimage');
      if ($(this).parent().parent().parent().parent().parent('#top-images').length > 0) {
        $(this).children().addClass('featureimage-top');
        animationsize = '673';
        youtubesize = 'width="673" height="480"';
      } else {
        $(this).children().addClass('featureimage-side');
        animationsize = '226';
        youtubesize = 'width="226" height="170"';
      }
      if (animation) {
        animation = '<a href="' + animation + '"><img width="' + animationsize +'" src="' + animation + '"></a>';
        $(this).find("div[class*='field-name-field-animated-gif']").children().children().html(animation);
        $(this).find("div[class*='field-name-field-featuresideimages']").children().remove();
      }
      if (youtube) {
        youtube = '<iframe src="https://www.youtube.com/embed/' + youtube + '?enablejsapi=1&rel=0" ' + youtubesize + ' frameborder="0" allowfullscreen=""></iframe>'
        //youtube = '<object ' + youtubesize + '> <param name="movie" value="https://www.youtube.com/v/' + youtube + '?version=3&autoplay=0&rel=0"></param> <param name="allowScriptAccess" value="always"></param> <embed src="https://www.youtube.com/v/' + youtube + '?version=3&autoplay=0" type="application/x-shockwave-flash" allowscriptaccess="always" ' + youtubesize + ' ></embed></object>';
        $(this).find("div[class*='field-name-field-youtube-embed']").children().children().html(youtube);
        $(this).find("div[class*='field-name-field-featuresideimages']").children().remove();
        $(this).find("div[class*='field-name-field-animated-gif']").children().remove();
      }
      divhtml = $(this).html().replace(imgtoken, '');
      $(contentelement).html($(contentelement).html().replace(imgtoken, divhtml));
      $(contentelement).html($(contentelement).html().replace(imgtoken, divhtml));
      $(this).remove();

    });
*/
    
      /* Before and After Image Placement 
      $('.field-collection-item-field-before-and-after-images').parent().addClass('featureimage').addClass('featureimage-top');
      var baimgtoken = $('div.field-collection-item-field-before-and-after-images .field-name-field-image-token .field-item').html(); // user-defined token(s)
      var baimgcontainer = $('.field-name-field-before-and-after-images .featureimage').parent();
      console.log($(contentelement));
      baimgcontainer.detach().appendTo($(contentelement).find('baimgtoken'));
      $(contentelement).html($(contentelement).html().replace (baimgtoken, $(baimgcontainer).html())) ;
      
/*      baimgcontainer.append(baimgtoken);
      document.baimgtoken.prependChild(document.baimgcontainer);
*/
     
/*      $('.pane-node-field-before-and-after-images').html(''); */
    
  }


  if ($('body.node-type-press-release')[0]) {
    parentelement = 'div.pane-node-field-top-images>div>div>div>div.field-items, div.pane-node-field-side-images>div>div>div>div.field-items';
    $('.pane-node-field-top-images').addClass('embedded-images');
    $('.pane-node-field-side-images').addClass('embedded-images');
    var imageselement = 'div.embedded-images>div>div>div>div.field-items';
    $('.pane-node-field-content').attr('id','pressrelease-content');
    var contentelement = 'div.pane-node-field-content>div>div>div>div.field-item';
    $(imageselement).children().each(function () {
      imgtoken = $(this).find("div[class*='field-name-field-image-token']").children().children().html(); //user-defined token(s)
      if ($(this).find("div[class*='field-name-field-featuresideimages']").children().children().children("img").length > 0) {
        imagesrc = $(this).find("div[class*='field-name-field-featuresideimages']").children().children().children("img").attr("src").replace('/styles/226xvariable_height/public/', '/').replace('/styles/673xvariable_height/public/', '/');
        imagetag = $(this).find("div[class*='field-name-field-featuresideimages']").children().children().html();
        $(this).find("div[class*='field-name-field-featuresideimages']").children().children().html('<a href="' + imagesrc + '">' + imagetag + '</a>');
      }
      animation = $(this).find("div[class*='field-name-field-animated-gif']").children().children().children("img").attr("src");
      youtube = $(this).find("div[class*='field-name-field-youtube-embed']").children().children().html();
      $(this).children().addClass('featureimage');
      if ($(this).parent().parent().parent().parent().parent('.pane-node-field-top-images').length > 0) {
        $(this).children().addClass('featureimage-top'); 
        animationsize = '673';
        youtubesize = 'width="673" height="480"';
      } else {
        $(this).children().addClass('featureimage-side');
        animationsize = '226';
        youtubesize = 'width="226" height="170"';
      }
      if (animation) {
        animation = '<a href="' + animation + '"><img width="' + animationsize +'" src="' + animation + '"></a>';
        $(this).find("div[class*='field-name-field-animated-gif']").children().children().html(animation);
        $(this).find("div[class*='field-name-field-sideimages']").children().remove();
      }
      if (youtube) {
        youtube = '<iframe src="https://www.youtube.com/embed/' + youtube + '?enablejsapi=1&rel=0" ' + youtubesize + ' frameborder="0" allowfullscreen=""></iframe>'
        $(this).find("div[class*='field-name-field-youtube-embed']").children().children().html(youtube);
        $(this).find("div[class*='field-name-field-sideimages']").children().remove();
        $(this).find("div[class*='field-name-field-animated-gif']").children().remove();
      }
      divhtml = $(this).html().replace(imgtoken, '');
      $(contentelement).html($(contentelement).html().replace(imgtoken, divhtml));
      $(contentelement).html($(contentelement).html().replace(imgtoken, divhtml));
      $(this).remove();
    });
  }


  if ( ($('body.node-type-feature')[0]) || ($('body.node-type-press-release')[0])) {
    // Force all "F n, Y" PHP date formats into Associated Press standard
    var FeatureDate = $('span.date-display-single').html();
    if (FeatureDate) {
       var APMonth = {'January':'Jan.','February':'Feb.','August':'Aug.','September':'Sept','October':'Oct.','November':'Nov.','December':'Dec.'};
       for (var Month in APMonth) 
          { FeatureDate = FeatureDate.replace(Month,APMonth[Month]); }
       $('span.date-display-single').html(FeatureDate);
       }
  }

});