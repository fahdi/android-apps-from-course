jQuery.noConflict();
(function($) {
  $(document).ready(function () {
    $.get('/sites/default/themes/NASAPortal/templates/footer.html',function(data){
      $('#section-footer-inner').html(data);
      $('#page-updated-info').prependTo('#section-footer-inner #footercol1');
      tagRouterUtility.parseDom('#section-footer-inner');
    },'html');
    $.get('/sites/default/themes/NASAPortal/templates/header-menu.html',function(data){
      $('#section-header-menu-container').html(data);
      tagRouterUtility.parseDom('#section-header-menu-container');
      var usasearch_config = { siteHandle:"nasa" };
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//search.usa.gov/javascripts/remote.loader.js";
      document.getElementsByTagName("head")[0].appendChild(script); 
  
      $("#menu-accordion").accordion({
        event: 'hoverintent',
        collapsible: true,
        active: false,
        icons: {
          "header": "yourIconClassClosed",
          "headerSelected": "yourIconClassOpen"
        },
        beforeActivate: function (event, ui) {
          if (!$.isEmptyObject( ui.oldHeader)) {
            ui.oldHeader.next().stop(true, true).slideUp('fast');
          }
          if (!$.isEmptyObject( ui.newHeader)) {
            ui.newHeader.next().stop(true, true).slideDown('fast');
          }
        }
      }).mouseleave(function () {
        setTimeout(function(){$('#menu-accordion').accordion("option", "active", false);},250);
      }).children('li').mouseenter(function () {
        $(this).find('h3').trigger('click');
      });
    },'html');
    
    if ($('body.node-type-feature')[0]) {
      var imageTokenFields = $('.field-name-field-image-token');
      var contentDiv = $('#feature-content .field-item');
      
      $.each(imageTokenFields, function(key, value) {
        /* the entire field that will replace the token */
        var imgField = $(this).closest('.field-item');
        /* the token itself */
        var token = $(this).find('.field-item').html();
      
        /* empty the token */
        $(this).html('');
        /* remove the image field from the DOM and get just the html of it */
        imgField = imgField.detach().html();
        /* replace the html of the content div, substituting any tokens for their respective image field */
        $(contentDiv).html($(contentDiv).html().replace(token, imgField));
      });
  
      /* add an id to the before-after image field */
      $('.field-name-field-before-and-after-image .field-items').each(function(index){
        $(this).attr('id', 'baimage' + index);
        /* initialize beforeafter plugin on the wrapper */
        $(this).beforeAfter({
          imagePath: '/sites/default/themes/NASAPortal/images/',
        });
      });

      contentDiv.find('.field-collection-view').each(function() {
        $(this).addClass('featureimage');
        if($(this).has('.field-collection-item-field-side-images').length != 0) {
          $(this).addClass('featureimage-side');
        }
        if($(this).has('.field-collection-item-field-top-images').length != 0) {
          $(this).addClass('featureimage-top');
        }
        if($(this).has('.field-collection-item-field-before-and-after-images').length != 0) {
          $(this).addClass('featureimage-beforeafter');
        }
      });

      /* if youtube ID is set, override other fields and replace with the video */
      /* if an animated gif is uploaded, override other fields and replace with the gif */
      var animatedGif = contentDiv.find(".field-name-field-animated-gif .field-item");
      var youtube = contentDiv.find(".field-name-field-youtube-embed .field-item");
      if(youtube) {
        youtube.each(function(index) {
          var ytWidth = 0;
          var ytHeight = 0;
          if ($(this).closest('.featureimage').hasClass('featureimage-top')) {
            ytWidth = 673;
            ytHeight = 480;
          }
          if ($(this).closest('.featureimage').hasClass('featureimage-side')) {
            ytWidth = 226;
            ytHeight = 170;
          }
          $(this).html('<iframe src="https://www.youtube.com/embed/' + youtube.text() + '?enablejsapi=1&rel=0" height="' + ytHeight + '" width="' + ytWidth + '" frameborder="0" allowfullscreen=""></iframe>');
          $(this).closest('.content').find('.field-type-image').hide();
        });
      }
      if (animatedGif) {
        animatedGif.each(function(index) {
          var gifWidth = 0;
          var gifHeight = 0;
          if ($(this).closest('.featureimage').hasClass('featureimage-top')) {
            gifWidth = 673;
            gifHeight = 480;
          }
          if ($(this).closest('.featureimage').hasClass('featureimage-side')) {
            gifWidth = 226;
            gifHeight = 170;
          }
          $(this).closest('.content').find('.field-name-field-featuresideimages').hide();
        });
      }
    }

  });

})(jQuery);