var number_of_videos_to_show = 5;
var gallery_slider = '';
var featured_slider = '';
var fps_slider_paused = false;
var casini_slider = '';
var play_pause_html = '';
var latest_featured_slider = '';
var multicontent_slider = '';
var feature_slider_paused = false;
var casini_paused = false;
var multimedia_ajax_count = 0;
var timeout,request;
var processing = false;
var usasearch_config = { siteHandle:"nasa" };
var tagRouterUtility;

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

function get_services_url() {
    var return_url = '';
    host_environment = '';
    var onWestPrimeDevCDN = window.location.hostname.indexOf("cmsdev.nasawestprime.com");
    var onWestPrimeDevS3 = window.location.hostname.indexOf("cmsdev.nasa.gov.s3-website-us-east-1.amazonaws.com");
    var onWestPrimeStagingS3 = window.location.hostname.indexOf("cms-stage");
    var onWestPrimeProductionS3 = window.location.hostname.indexOf("cms.nasa.gov.s3-website-us-east-1.amazonaws.com");
    var onWestPrimeStagingCDN = window.location.hostname.indexOf("www-stage");
    if ((onWestPrimeDevCDN >=0) || (onWestPrimeDevS3 >=0)) {
        host_environment ='development';
    }
    if (onWestPrimeStagingS3 >=0) {
        host_environment ='stagingS3';
    }
    if (onWestPrimeProductionS3 >=0) {
        host_environment ='productionS3';
    }
    switch (host_environment) {

        // case 'development':
        //     return_url = 'http://cms-dev-app.nasawestprime.com';
        //     break;
        case 'stagingS3':
            return_url = 'http://cms-stage.nasawestprime.com';
            break;
        case 'productionS3':
            return_url = 'http://cms.nasawestprime.com';
            break;
        default:
            return_url = '';
            break;
    }

    return return_url;
}

jQuery.noConflict();
jQuery(document).ready(function () {
/**
 * replace all http://anon.nasa-global.edgesuite.net/ with https://s3.amazonaws.com/akamai.netstorage/
 */

  var urls = ["anon.nasa-global.edgesuite.net/", "anon.nasa-global.speedera.net/anon.nasa-global/", "wm.nasa-global.edgestreams.net/wm.nasa-global/", "real.nasa-global.edgestreams.net/real.nasa-global/", "mfile.akamai.com/\\d+/rm/etouchsyst2.download.akamai.com/\\d+/real.nasa-global/", "mfile.akamai.com/\\d+/wmv/etouchsyst2.download.akamai.com/\\d+/wm.nasa-global/", "mfile.akamai.com/\\d+/mov/etouchsyst2.download.akamai.com/\\d+/qt.nasa-global/" ];
  for (var i = 0; i < urls.length; i++) {
    re = urls[i];
    re = "^http(s*):\/\/(www\.)*" + re;
    var re = new RegExp(re);
    jQuery('a[href*='+urls[i] +']').attr('href', function(i,href) {
        return href.replace(re, 'https$1://s3.amazonaws.com/akamai.netstorage');
    });
  }

  // jQuery ('a[href*="anon.nasa-global.edgesuite.net/"]').attr('href', function(i,href) {
  //     return href.replace(/^http(s*):\/\/(www\.)*anon.nasa-global.edgesuite.net/, 'https$1://s3.amazonaws.com/akamai.netstorage');
  // });

    /**
     * Add link to heading
     */
    var body_class = jQuery('body').attr('class');

    if(body_class == 'html not-front not-logged-in page-node page-node- page-node-67673 node-type-collection-asset context-content') {

        var link = jQuery(".field-name-field-additional-link-1 .field-items .field-item:first a").attr('href');

        if(link != '') {

            var title = jQuery('#press-release-title .pane-content').html();
            jQuery('#press-release-title .pane-content').html('<a tabindex="1" href="'+link+'" target="_blank">'+ title +'</a>')
        }
    }


    jQuery.event.special.hoverintent = {
        setup: function () {
            jQuery(this).bind("mouseover", jQuery.event.special.hoverintent.handler);
        },
        teardown: function () {
            jQuery(this).unbind("mouseover", jQuery.event.special.hoverintent.handler);
        },
        handler: function (event) {
            var currentX, currentY, timeout,
            args = arguments,
                target = jQuery(event.target),
                previousX = event.pageX,
                previousY = event.pageY;

            function track(event) {
                currentX = event.pageX;
                currentY = event.pageY;
            }

            function clear() {
                target.unbind("mousemove", track);
                target.unbind("mouseout", clear);
                clearTimeout(timeout);
            }

            function handler() {
                var prop,
                orig = event;

                if ((Math.abs(previousX - currentX) + Math.abs(previousY - currentY)) < 7) {
                    clear();

                    event = jQuery.Event("hoverintent");
                    for (prop in orig) {
                        if (!(prop in event)) {
                            event[prop] = orig[prop];
                        }
                    }
                    if(target.parents('h3').attr('id') == jQuery(orig.target).parents('h3').attr('id') && target.parents('h3').hasClass('ui-state-active')) {
                        return;
                    }
                    if(target.attr('id') == jQuery(orig.target).attr('id') && target.hasClass('ui-state-active')) {
                        return;
                    }
                    // Prevent accessing the original event since the new event
                    // is fired asynchronously and the old event is no longer
                    // usable (#6028)
                    delete event.originalEvent;

                    target.trigger(event);
                } else {
                    previousX = currentX;
                    previousY = currentY;
                    timeout = setTimeout(handler, 100);
                }
            }

            timeout = setTimeout(handler, 100);
            target.bind({
                mousemove: track,
                mouseout: clear
            });
        }
    };

    tagRouterUtility = {
        init: function () {
            var me = this;
            me.parseDom();
        },
        parseDom: function (context) {
            var me = this;
            selector = (context == undefined ? '' : context)
            jQuery(selector+' div.embedTag').each(function () {
                var blocktype = jQuery(this).attr("data-blocktype");
                var jsonsource = jQuery(this).attr("data-json-source");
                var datasticky = jQuery(this).attr("data-sticky");
                var datatopics = jQuery(this).attr("data-topics");
                var datamissions = jQuery(this).attr("data-missions");
                var dataitems = jQuery(this).attr("data-items");
                var dataoffset = jQuery(this).attr("data-offset");
                var xmlsource = jQuery(this).attr("data-xml-source");
                var dataplaylist = jQuery(this).attr("data-playlist-code");
                var datamorelinkurl = jQuery(this).attr("data-more-link-url");
                var dataprevgallinkurl = jQuery(this).attr("data-prev-gal-link-url");
                var datanextgallinkurl = jQuery(this).attr("data-next-gal-link-url");
                var datamorelinktext = jQuery(this).attr("data-more-link-text");
                var datacollections = jQuery(this).attr("data-collections");
                var dataother_tags = jQuery(this).attr("data-other_tags");
                var dataroutes = jQuery(this).attr("data-routes");
                var datacollectionlink = jQuery(this).attr("data-collectionlink");
                var menuhtml = jQuery(this).attr("data-menu-html");
                var govdeliverycode = jQuery(this).attr("data-govdelivery-code");
                var dataitemtype = jQuery(this).attr("data-item-type");
                var maxlength = jQuery(this).attr("data-max-length");
                var datacontent_types = jQuery(this).attr("data-content_types"); //
                var datacalendar = jQuery(this).attr("data-calendar");
                var datadate = jQuery(this).attr("data-date");
                var datadatenow = jQuery(this).attr("data-date-now");
                var datadescription = jQuery(this).attr("data-description");
                var datadescriptionlink = jQuery(this).attr("data-description-link");
                var datawidth = jQuery(this).attr("data-width");
                var dataheight = jQuery(this).attr("data-height");
                var datafeed = jQuery(this).attr("data-feed");
                var datapagination = jQuery(this).attr("data-pagination");
                var datamaxlength  = jQuery(this).attr("data-maxlength");
                var datablogfid = jQuery(this).attr("data-blog-fid");
                var datapriorityids = jQuery(this).attr("data-priority-nodes");
                var datashowattachments = jQuery(this).attr("data-show-attachments");
                var datashowpodcast = jQuery(this).attr("data-show-podcast");
                var datashowvodcast = jQuery(this).attr("data-show-vodcast");
                var datashowlinks = jQuery(this).attr("data-show-links");
                var datashowdate = jQuery(this).attr("data-show-date");
                var dataurl = jQuery(this).attr("data-url");
                var datafullimage = jQuery(this).attr("data-full-image");
                var imgurl = jQuery(this).attr("data-full-size");
                var imgurl1920 = jQuery(this).attr("data-1920");
                var imgurl1600 = jQuery(this).attr("data-1600");
                var imgurl1366 = jQuery(this).attr("data-1366");
                var imgurl1024 = jQuery(this).attr("data-1024");
                var imgurl800 = jQuery(this).attr("data-800");
                var tagId = jQuery(this).attr("id");
                var currenttag = this;

                tagId = tagId.replace(/ /g, "_");

                var dataAttr = new Array();
                dataAttr['blocktype'] = blocktype;
                dataAttr['jsonsource'] = jsonsource;
                dataAttr['datasticky'] = datasticky;
                dataAttr['datatopics'] = datatopics;
                dataAttr['datamissions'] = datamissions;
                dataAttr['dataitems'] = dataitems;
                dataAttr['dataoffset'] = dataoffset;
                dataAttr['xmlsource'] = xmlsource;
                dataAttr['dataplaylist'] = dataplaylist;
                dataAttr['datamorelinkurl'] = datamorelinkurl;
                dataAttr['dataprevgallinkurl'] = dataprevgallinkurl;
                dataAttr['datanextgallinkurl'] = datanextgallinkurl;
                dataAttr['datamorelinktext'] = datamorelinktext;
                dataAttr['datacollections'] = datacollections;
                dataAttr['dataother_tags'] = dataother_tags;
                dataAttr['dataroutes'] = dataroutes;
                dataAttr['collectionlink'] = datacollectionlink;
                dataAttr['currenttag'] = currenttag;
                dataAttr['menuhtml'] = menuhtml;
                dataAttr['govdeliverycode'] = govdeliverycode;
                dataAttr['maxlength'] = maxlength;
                dataAttr['dataitemtype'] = dataitemtype;
                dataAttr['datacalendar'] = datacalendar;
                dataAttr['datadescription'] = datadescription;
                dataAttr['datadescriptionlink'] = datadescriptionlink;
                dataAttr['datawidth'] = datawidth;
                dataAttr['dataheight'] = dataheight;
                dataAttr['datadate'] = datadate;
                dataAttr['datadatenow'] = datadatenow;
                dataAttr['datablogfid'] = datablogfid
                dataAttr['tagid'] = tagId;
                dataAttr['datafeed'] = datafeed;
                dataAttr['datapagination'] = datapagination;
                dataAttr['datamaxlength'] = datamaxlength;
                dataAttr['datacontent_types'] = datacontent_types;//
                dataAttr['datapriorityids'] = datapriorityids;
                dataAttr['datashowattachments'] = datashowattachments;
                dataAttr['datashowpodcast'] = datashowpodcast;
                dataAttr['datashowvodcast'] = datashowvodcast;
                dataAttr['datashowlinks'] = datashowlinks;
                dataAttr['datashowdate'] = datashowdate;
                dataAttr['dataurl'] = dataurl;
                dataAttr['datafullimage'] = datafullimage;
                dataAttr['imgurl'] = imgurl;
                dataAttr['imgurl1920'] = imgurl1920;
                dataAttr['imgurl1600'] = imgurl1600;
                dataAttr['imgurl1366'] = imgurl1366;
                dataAttr['imgurl1024'] = imgurl1024;
                dataAttr['imgurl800'] = imgurl800;

                if (tagId == '')
                    tagId = 'dummy'

                window[tagId + '_ajax_call'] = '';

                switch (blocktype) {
                    case "eventcatalog":
                        eventcatalog(dataAttr);
                        break;
                    case "specialeventcatalog":
                        specialeventcatalog(dataAttr);
                        break;
                    case "casiniImageGallery":
                        casiniImageGallery(dataAttr);
                        break;
                    case "spaceStationNewsReleases":
                        spaceStationNewsReleases(dataAttr);
                        break;
                    case "latestFeatureGallery":
                        latestFeatureGallery(dataAttr);
                        break;
                    case "MultipleContentSlider":
                        MultipleContentSlider(dataAttr);
                        break;
                    case "MultipleContentListing":
                        MultipleContentListing(dataAttr);
                        break;
                    case "imageofthedayGallery":
                        imageofthedayGallery(dataAttr);
                        break;
                    case "FeaturesListing":
                        FeaturesListing(dataAttr);
                        break;
                    case "YouTubeAccordion":
                        YouTubeAccordion(dataAttr);
                        break;
                    case "EventsBlock":
                        parseEvents(dataAttr);
                        break;
                    case "SideMenu":
                        SideMenu(dataAttr);
                        break;
                    case "GovDelivery":
                        GovDelivery(dataAttr);
                        break;
                    case "NasaBlogsBlock":
                        parse_nasa_blogs(dataAttr);
                        break;
                    case "ImageAccordionGallery":
                        ImageAccordionGallery(dataAttr);
                        break;
                    case "ImageAccordionGallery_1col":
                        ImageAccordionGallery_1col(dataAttr);
                        break;
                    case "MissionBanner":
                        MissionBanner(dataAttr);
                        break;
                    case "LinksBlock":
                        parseLinks(dataAttr);
                        break;
                    case "connectWithNasaBlock":
                        connectWithNasa(dataAttr);
                        break;
                    case "collectionsBlock":
                        collectionsBlock(dataAttr);
                        break;
                    case "CollectionsAccordion_1col":
                        CollectionsAccordion_1col(dataAttr);
                        break;
                    case "MenuMissionLaunchBlock":
                        MenuMissionLaunchBlock(dataAttr);
                        break;
                    case "ImageOfTheDayBlock":
                        ImageOfTheDayBlock(dataAttr);
                        break;
                    case "InteractiveFeaturesBlock":
                        InteractiveFeaturesBlock(dataAttr);
                        break;
                    case "GetInvolvedBlock":
                        GetInvolvedBlock(dataAttr);
                        break;
                    case "FeaturedBlogsBlock":
                        FeaturedBlogsBlock(dataAttr);
                        break;
                    case "MenuEventsBlock":
                        MenuEventsBlock(dataAttr);
                        break;
                    case "TopBlindsGalleyBlock":
                        TopBlindsGalleyBlock(dataAttr);
                        break;
                    case "MenuYouTubeVideosBlock":
                        MenuYouTubeVideosBlock(dataAttr);
                        break;
                    case "MediaCastBlock":
                        MediaCastBlock(dataAttr);
                        break;
                    case "NasaImageOfTheDayBlock":
                        NasaImageOfTheDayBlock(dataAttr);
                        break;
                    case "NasaCountDownClock":
                        NasaCountDownClock(dataAttr);
                        break;
                    case "CollectionListing":
                        CollectionListing(dataAttr);
                        break;
                    case "ImageListing":
                        ImageListing(dataAttr);
                        break;
                    case "MultimediaBlock":
                        MultimediaBlock(dataAttr);
                        break;
                    case "eventsCalendar":
                        eventsCalendar(dataAttr);
                        break;
                    case "NASAVideoGalleryMainVideo":
                        NASAVideoGalleryMainVideo(dataAttr);
                        break;
                    case "NASAVideoGalleryThumbnails":
                        NASAVideoGalleryThumbnails(dataAttr);
                        break;
                    case "MediaCastLinks":
                      MediaCastLinks(dataAttr);
                      break;
                    case "MediaCastLinks_2":
                      MediaCastLinks_2(dataAttr);
                      break;
                    case "nasaRSSFeed":
                        rssFeed(dataAttr);
                        break;
                    case "nextLaunchBlock":
                        nextLaunchBlock(dataAttr);
                        break;
                    case "ImageAddThisBlock":
                        imageAddThisBlock(dataAttr);
                        break;
                    case "ImageDownloadLinks":
                        ImageDownloadLinks(dataAttr);
                        break;
                    default:
                        break;
                }
            });
        }
    };

    tagRouterUtility.init();

});

jQuery(window).load(function () {

    jQuery("#accordion").accordion({ header: 'h3:not(.no_content_title)', heightStyle: "content" });
    jQuery("#stationaccordion").accordion({ header: 'h3:not(.no_content_title)', heightStyle: "content" });
    jQuery("#tabs").tabs();

    jQuery("#captions_text_small").live('click', function () {
        if (jQuery("#image_captions").is(':visible')) {
            jQuery(this).removeClass('img_show_captions_small_up');
            jQuery(this).html('Show Captions');
            jQuery('#image_captions').stop(true, true).slideUp(500);
        } else {
            jQuery(this).addClass('img_show_captions_small_up');
            jQuery(this).html('Hide Captions');
            jQuery('#image_captions').stop(true, true).slideDown(500);
        }
    });

});


function get_child_menu(key, child_menu_value, child_menus, tag_id, child_level) {

    var child_menu_data = '';
    var menu_id = child_menu_value.mlid;
    var child_menu_id = menu_id + "_child";
    var child_menu_path = '';

    if (child_menu_value.path == '<front>') {
        var child_menu_path = '';
    } else {
        var child_menu_path = child_menu_value.path;
    }
    if(child_menu_value.fragment != null && child_menu_value.fragment != ''){
        child_menu_path += '#'+child_menu_value.fragment;
    }

    var child_menu_title = child_menu_value.title;

    if (child_menus[child_menu_id] instanceof Object) {
        expanded = (child_menu_value.expanded == '1');
        expanded_icon = (expanded ? '<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-s"></span>' : '');
        header_classes = (expanded ? 'ui-state-default ui-accordion-header ui-accordion-icons ui-state-active' : (child_level > 1 ? 'content-child-child-container' : (child_level > 0 ? 'content-child-container' : 'content-parent-container')));
        div_classes = (child_level > 1 ? "sub_sub_menu_accordion_container sub_sub_menu_accordion_" + tag_id : "sub_menu_accordion_container sub_menu_accordion_" + tag_id)

        child_menu_data += "<div class='" + div_classes + " " + (expanded ? 'expanded ui-accordion' : '') + "'>";
        child_menu_data += '<h3 class="' + header_classes + '">' + expanded_icon + '<a tabindex="1" href="' + (expanded ? '#' : child_menu_path) + '">' + child_menu_title + '</a></h3>';
        child_menu_data += '<div class="ui-accordion-content">';
        child_menu_data += '<ul class="side-menu-items">';
        jQuery.each(child_menus[child_menu_id], function (key, child_menu) {
            child_menu_data += get_child_menu(key, child_menu, child_menus, tag_id, child_level + 1);
        });
        child_menu_data += '</ul>';
        child_menu_data += "</div>";
        child_menu_data += "</div>";
    } else {
        if (child_level > 0){
            child_menu_data += '<li ' + (child_menu_path.toLowerCase() == document.location.pathname.toLowerCase() ? 'class="active"' : '') + '><a tabindex="1" href="' + child_menu_path + '">' + child_menu_title + '</a></li>';
        }else{
            child_menu_data += '<h3 class="no_content_title ' + (child_menu_path.toLowerCase() == document.location.pathname.toLowerCase() ? 'active' : '') + '"><a tabindex="1" href="' + child_menu_path + '">' + child_menu_title + '</a></h3>';
        }
    }

    return child_menu_data;
}

function SideMenu(data_attr) {

    var current_tag = data_attr['currenttag'];
    var data_menu = data_attr['menuhtml'];
    var tag_id = data_attr['tagid'];

    var menu_html = '';

    var menudiv_id = data_menu.replace(/\s/g, "_");

    var json_obj = {};
    var parent_menus = {};
    var child_menus = {};

    json_obj['menu'] = data_menu;
    var json_url = create_jsonp_url('menu_links.jsonp', json_obj);
    var i = 0;
    jQuery.ajax({
        type: "GET",
        url: json_url,

        success: function (data) {
            var data_html = '';
            if (data && typeof (data) == 'object') {
                jQuery.each(data.links, function (i, node_data) {
                    if (node_data.link.plid == 0) {
                        parent_menus[node_data.link.mlid + '_parent'] = node_data.link;
                    } else {
                        if (!jQuery.isPlainObject(child_menus[node_data.link.plid + '_child']))
                            child_menus[node_data.link.plid + '_child'] = {};
                        child_menus[node_data.link.plid + '_child'][i + "_child"] = node_data.link;
                        i++;
                    }
                });

                menu_html += '<div class="news-features withbg">';
                menu_html += '<div id="' + menudiv_id + '">';
                jQuery.each(parent_menus, function (i, parent_menu) {
                    var menu_id = parent_menu.mlid;
                    var child_menu = child_menus[menu_id + "_child"];
                    var parent_menu_title = parent_menu.title;
                    if (parent_menu.path == '<front>') {
                        var path = '';
                    } else {
                        var path = parent_menu.path;
                    }
                    if(parent_menu.fragment != null && parent_menu.fragment != ''){
                        path += '#'+parent_menu.fragment;
                    }
                    menu_html += '<a tabindex="1" href="' + path + '">';
                    menu_html += '<h2 class="pane-title">' + parent_menu_title + '</h2>';
                    menu_html += '</a>';
                    menu_html += "<div class='menu_accordion_container menu_accordion_" + tag_id + " " + (parent_menu.expanded == '1' ? 'expanded' : '') + "'>";
                    jQuery.each(child_menu, function (key, child_menu_value) {
                        menu_html += get_child_menu(key, child_menu_value, child_menus, tag_id, 0);
                    });
                    menu_html += "</div>";
                });
                menu_html += "</div>";
                menu_html += "</div>";

                jQuery(current_tag).empty();
                jQuery(current_tag).html(menu_html);

                var parent_menu_active = false;
                var sub_menu_active = false;
                var sub_sub_menu_active = false;
                jQuery(".menu_accordion_" + tag_id + " > div.sub_menu_accordion_container").each(function(i,menu){
                    if(jQuery(menu).find('li.active').length == 1){
                        parent_menu_active = i;
                        jQuery(menu).find('> div > ul > div.sub_menu_accordion_container').each(function(j,sub_menu){
                            if(jQuery(menu).find('li.active').length == 1){
                                sub_menu_active = j;
                                jQuery(sub_menu).find('> div > ul > div.sub_sub_menu_accordion_container').each(function(k,sub_sub_menu){
                                    if(jQuery(sub_sub_menu).find('li.active').length == 1){
                                        sub_sub_menu_active = k;
                                    }
                                })
                            }
                        })
                    }
                });
                jQuery(".menu_accordion_" + tag_id + " .active").html('<strong>' + jQuery(".menu_accordion_" + tag_id + " .active a").html() + '</strong>');
                jQuery(".menu_accordion_" + tag_id).not('.expanded').accordion({ header: ".content-parent-container", heightStyle: "content", collapsible: true, active: parent_menu_active });
                jQuery(".sub_menu_accordion_" + tag_id).not('.expanded').accordion({ header: ".content-child-container", heightStyle: "content", collapsible: true, active: sub_menu_active });
                jQuery(".sub_sub_menu_accordion_" + tag_id).not('.expanded').accordion({ header: ".content-child-child-container", heightStyle: "content", collapsible: true, active: sub_sub_menu_active });
            }
        }

    });
}

function GovDelivery(data_attr) {


    var current_tag = data_attr['currenttag'];
    var govdelivery_code = data_attr['govdeliverycode'];

    var govdelivery_html = '';

    govdelivery_html += '<div class="content_gov">';

    govdelivery_html += '<form action="" class="niceform" id="govdelivery" ';
    govdelivery_html += 'name="govdelivery" onsubmit="govdelivery_subscribe(); return false;">';
    govdelivery_html += '  <div class="form-wrap">';
    govdelivery_html += '     <input name="folder" type="hidden" value="' + govdelivery_code + '" /> ';
    govdelivery_html += '<input alt="Enter Email Address" class="text-input" id="textinput" name="textinput" ';
    govdelivery_html += 'placeholder="Enter E-mail Address" size="20" type="text" value="" /> ';
    govdelivery_html += '<input class="buttonSubmit_gov" type="submit" value="Subscribe" />';
    govdelivery_html += '  </div>';
    govdelivery_html += '</form>';
    govdelivery_html += '<div class="godev-powered">';
    govdelivery_html += 'powered by Gov Delivery';
    govdelivery_html += '</div>';
    govdelivery_html += '</div>';

    jQuery(current_tag).empty();
    jQuery(current_tag).html(govdelivery_html);

}


function casiniImageGallery(data_attr) {

    var casini_html = '';
    var node_image = '';
    var node_caption = '';
    var node_title = '';
    var first_title = '';
    var first_caption = '';

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags= data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['Routes'] = data_routes;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['sticky'] = data_sticky;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    jQuery.ajax({
        type: "GET",
        url: json_url,

        success: function (data) {
            if (data && typeof (data) == 'object') {
                var total_node_count = data.nodes.length;
                casini_html += '<div class="flash-wrap">';
                casini_html += '<div class="flash">';
                casini_html += '<div id="gallery_box" class="obj-wrap">';
                jQuery.each(data.nodes, function (i, node_data) {

                    if (total_node_count > data_items)
                        total_node_count = data_items;

                    node_image = node_data.node.image_466x248;
                    node_caption = node_data.node.field_image_caption;
                    node_title = node_data.node.promotional_title;
                    node_url = node_data.node.path;

                    node_caption = node_caption.replace(/"/g, '&quot;');
                    node_title = node_title.replace(/"/g, '&quot;');


                    casini_html += '<div class="obj" id="image_container_' + i + '">';
                    casini_html += '<a tabindex="1" href="' + node_url + '">';
                    casini_html += '<div class="image_loading">';
                    casini_html += '<img class="obj" width="470" height="250" src="' + node_image + '" title="' + node_title + '" caption="' + node_caption + '" data-image-path="' + node_url + '"/>';
                    casini_html += '</div>';
                    casini_html += '</a>';
                    casini_html += '</div>';

                    if (i == 0) {
                        first_title = '<p><a tabindex="1" href="' + node_url + '">' + node_title + ' -- 1 of ' + total_node_count + ' images</p></a>';
                        first_caption = '<p>' + node_caption + '</p>';
                    }

                });
                casini_html += '</div>';
                casini_html += '<div id="img_title" class="img-gallerytitle"></div>';
                casini_html += '<div class="tool-bar">';
                casini_html += '<div id="slideshow_toolbar_small">';
                casini_html += '<a tabindex="1" id="btn_fullslideshow_image_small" class="fullslideshowimage_small_viewgallery" href="' + data_morelink_url + '">' + data_morelink_text + '</a> ';
                casini_html += '<span id="btn_prevslideshow_image" class="prevslideshowimage_small">';
                casini_html += '</span>';
                casini_html += '<span id="btn_pauseslideshow_small" class="pauseslideshow">';
                casini_html += '<a tabindex="1" onclick="pauseSlide(\'casini\');" href="javascript:void(0);">Pause</a>';
                casini_html += '</span>';
                casini_html += '<span id="btn_nextslideshow_image_small" class="nextslideshowimage_small">';
                casini_html += '</span>';
                casini_html += '<span class="caption-container">';
                casini_html += '<a tabindex="1" class="img_show_captions_small" id="captions_text_small" href="javascript:void(0);">Show Captions</a>';
                casini_html += '</span>';
                casini_html += '</div>';
                casini_html += '<div id="image_captions"></div>';
                casini_html += '</div>';

                casini_html += '</div>';
                casini_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(casini_html);

                jQuery('#img_title').empty();
                jQuery('#img_title').html(first_title);

                jQuery('#image_captions').empty();
                jQuery('#image_captions').html(first_caption);

                casini_slider = jQuery('#gallery_box').bxSlider({
                    pager: false,
                    pause: 10000,
                    nextSelector: '#btn_nextslideshow_image_small',
                    prevSelector: '#btn_prevslideshow_image',
                    auto: true,
                    onSlideAfter: function () {
                        if (casini_paused == false)
                            casini_slider.startAuto();
                    },
                    onSlideNext: function ($slideElement, oldIndex, newIndex) {
                        process_casini_slide_actions($slideElement, oldIndex, newIndex);
                    },
                    onSlidePrev: function ($slideElement, oldIndex, newIndex) {
                        process_casini_slide_actions($slideElement, oldIndex, newIndex);
                    }
                });
            }
        }
    });
}


function rssFeed(data_attr){
  var url = data_attr['datafeed'];
  var current_tag = data_attr['currenttag'];
  var data_morelink_url = data_attr['datamorelinkurl'];
  var data_morelink_text = data_attr['datamorelinktext'];
  var offset = data_attr['dataoffset'] || 0;
  var dataitems = data_attr['dataitems']  || 5;
  var fetching = function(data_attr){
    jQuery.ajax({
      type          :     "GET",
      url               :     url,
      dataType        : (jQuery.browser.msie) ? "text" : "xml",
      success         : function(data) {
        if(jQuery.browser.msie){
          var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
          xmlDoc.loadXML(data);
          window.data = xmlDoc;
        }else{
          window.data = data;
        }
        rss_feed_html = '';
        rss_feed_html += '<div class="news-release">';
        rss_feed_html += '<div class="browseArchive">  ';
        rss_feed_html += '<ul>';
        items = jQuery(window.data).find("item");
        items_after = items.splice(offset, dataitems)
        jQuery.each(items_after, function (i, node_data) {
          title   = jQuery(node_data).find('title').text();
          link    = jQuery(node_data).find('link').text();
          desc    = jQuery(node_data).find('description').text();
          pubDate = jQuery(node_data).find('pubDate').text();
          rss_feed_html += "<li><div>";
          rss_feed_html += "<div><b>" + title + "</b></div>"
          rss_feed_html += "<div>" + pubDate + "</div>"
          rss_feed_html += "<div>" + desc + "</div>"
          rss_feed_html += "</div></li>";
        });
        rss_feed_html += "</ul>";
        rss_feed_html += "</div>";
        if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > dataitems)){
            rss_feed_html += '<div class="space-station-more">';
            rss_feed_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
            rss_feed_html += '</div>';
        }
        rss_feed_html += "</div>";
        jQuery(current_tag).empty();
        jQuery(current_tag).html(rss_feed_html);
      },
    });
  };
  fetching();
}

function nextLaunchBlock(data_attr){
    var url = get_services_url() + data_attr['datafeed'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    jQuery.ajax({
      type          :     "GET",
      url               :     url,

      success         : function(data) {
        if (data && typeof (data) == 'object') {
            var item=data.nodes[data.nodes.length-1].node;

            next_launch_html = '<ul class="listing">';
            next_launch_html += '<li>';
            next_launch_html += '<a tabindex="1" href="'+item.link+'">'+item.timestamp2.substring(0,10)+': '+item.title+'</a>';
            next_launch_html += '</li>';
            next_launch_html += '<li><a tabindex="1" href="/missions/highlights/schedule.html">Full Launch Schedule</a></li>';
            next_launch_html += '<li><a tabindex="1" href="/centers/kennedy/launchingrockets/viewing.html">See a Launch</a></li>';
            next_launch_html += "</ul>";
            jQuery(current_tag).empty();
            jQuery(current_tag).html(next_launch_html);

        }
      }
    });
}

function spaceStationNewsReleases(data_attr, reload_content_only) {
    var data_topics         = data_attr['datatopics'];
    var data_missions       = data_attr['datamissions'];
    var data_collections    = data_attr['datacollections'];
    var data_other_tags     = data_attr['dataother_tags'];
    var data_items          = data_attr['dataitems'];
    var data_offset         = data_attr['dataoffset'];
    var data_morelink_url   = data_attr['datamorelinkurl'];
    var data_morelink_text  = data_attr['datamorelinktext'];
    var tag_id              = data_attr['tagid'];
    var current_tag         = data_attr['currenttag'];
    var data_pagination     = data_attr['datapagination'];
    var pagination_offset   = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var data_sticky         = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj            = {};

    json_obj['sticky']      = data_sticky;
    json_obj['Topics']      = data_topics;
    json_obj['Missions']    = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags']  = data_other_tags;
    json_obj['limit']       = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url            = create_jsonp_url('jsonp_latest_press_releases.jsonp', json_obj);

    var news_releases_html  = '';
    var news_releases_content_html = '';
    var news_title  = '';
    var news_path   = '';
    var news_desc   = '';

    var news_desc_promo_sentence_maxlength = data_attr['datamaxlength'];

    var pagination_click = false;

    if (window[tag_id + '_ajax_call'])
          window[tag_id + '_ajax_call'].abort();

    window[tag_id + '_ajax_call'] = jQuery.ajax({

        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    news_releases_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                }

                news_releases_html += '<div class="news-release">';
                news_releases_html += '<div class="browseArchive">  ';
                news_releases_html += '<ul class="no-list-style">';
                jQuery.each(data.nodes, function (i, node_data) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    news_title = node_data.node.promotional_title;
                    news_desc = node_data.node.field_promo_leader_sentence;
                    news_path = node_data.node.path;
                    news_date = node_data.node.field_promotional_date;

                    if (news_desc.length > news_desc_promo_sentence_maxlength) {
                        news_desc = news_desc.substr(0, news_desc_promo_sentence_maxlength);
                        news_desc = news_desc.substr(0, Math.min(news_desc.length, news_desc.lastIndexOf(" ")));
                        news_desc = news_desc + ' ...';
                    }


                    news_releases_content_html += '<li>';
                    news_releases_content_html += '<div class="views-field views-field-nothing">';
                    news_releases_content_html += '<span class="field-content">';
                    news_releases_content_html += '<h3>'
                    news_releases_content_html += '<a tabindex="1" href="' + news_path + '">' + news_title + '</a>';
                    news_releases_content_html += '</h3>'
                    news_releases_content_html += '<p>' + news_date + ' - ' + news_desc + '</p>';
                    news_releases_content_html += '</span>';
                    news_releases_content_html += ' </div>';
                    news_releases_content_html += ' </li>';
                });
                news_releases_html += news_releases_content_html;

                news_releases_html += ' </ul';
                news_releases_html += ' </div>';

                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    news_releases_html += '<div class="more-news-link">';
                    news_releases_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    news_releases_html += '</div>';
                }

                news_releases_html += ' </div>';

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    news_releases_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(news_releases_content_html);
                } else {

                jQuery(current_tag).empty();
                jQuery(current_tag).html(news_releases_html);

                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        jQuery('.pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                spaceStationNewsReleases(data_attr, true);
                                pagination_click = true;
                                jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });

                        jQuery('.footer-pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                spaceStationNewsReleases(data_attr, true);
                                pagination_click = true;
                                jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });
                    }

                }


            }
        }
    });
}

function latestFeatureGallery(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_sticky = data_attr['datasticky'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['sticky'] = data_sticky;

    var json_url = create_jsonp_url('latest_features.jsonp', json_obj);

    var feature_gallery_html = '';
    var feature_title = '';
    var feature_url = '';
    var feature_image = '';
    var feature_auto_image = '';
    var feature_field_description = '';
    var feature_field_description_maxlength = 150;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                feature_gallery_html += '<div id="landing-fpss-outer-container" class="latest-newsslider">';
                feature_gallery_html += '<div id="landing-fpss-container">';
                feature_gallery_html += '<div id="landing-fpss-slider">';
                feature_gallery_html += '<div id="landing-slide-wrapper">';
                feature_gallery_html += '<div id="landing-slide-outer">';
                jQuery.each(data.nodes, function (i, node_data) {

                    feature_title = node_data.node.promotional_title;

                    feature_url = node_data.node.path;
                    feature_image = node_data.node.image_466x248;
                    feature_auto_image = node_data.node.image_466x248;
                    feature_field_description = node_data.node.field_promo_leader_sentence;

                    if (feature_field_description.length > feature_field_description_maxlength) {
                        feature_field_description = feature_field_description.substr(0, feature_field_description_maxlength);
                        feature_field_description = feature_field_description.substr(0, Math.min(feature_field_description.length, feature_field_description.lastIndexOf(" ")));
                        feature_field_description = feature_field_description + ' ...';
                    }

                    if (!feature_image)
                        feature_image = feature_auto_image;

                    feature_gallery_html += '<div class="landing-slide">';
                    feature_gallery_html += '<div class="landing-slide-inner">';
                    feature_gallery_html += '<div class="fpss-img_holder_div_landing">';
                    feature_gallery_html += '<div id="fpss-img-div">';
                    feature_gallery_html += '<a tabindex="1" href="' + feature_url + '" class="fpss_img">';
                    feature_gallery_html += '<img width="472" alt="" src="' + feature_image + '" height="248" align="Bottom" border="0" />';
                    feature_gallery_html += '</a>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '<div class="landing-fpss-introtext">';
                    feature_gallery_html += '<div class="landing-slidetext">';
                    feature_gallery_html += '<h1>';
                    feature_gallery_html += '<a tabindex="1" href="' + feature_url + '">' + feature_title + '</a>';
                    feature_gallery_html += '</h1>';
                    feature_gallery_html += '<p>' + feature_field_description + '</p>';
                    feature_gallery_html += '<a tabindex="1" href="' + feature_url + '">&rsaquo;&nbsp;Read More</a>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';

                });

                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '<div id="landing-navi-outer">';
                feature_gallery_html += '<div id="featured-gallery-navigation-items">';
                feature_gallery_html += '</div>';
                feature_gallery_html += '<div class="pause_featured_gallery">';
                feature_gallery_html += '<a tabindex="1" onclick="pauseSlide(\'featured_gallery\');" href="javascript:void(0);">Pause</a>';
                feature_gallery_html += '</div>';
                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    feature_gallery_html += '<div class="landing-fpss_archive_link">';
                    feature_gallery_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    feature_gallery_html += '</div>';
                }
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(feature_gallery_html);

                latest_featured_slider = jQuery('#landing-slide-outer').bxSlider({
                    auto: true,
                    controls: false,
                    pause: 10000,
                    pagerSelector: '#featured-gallery-navigation-items',
                    buildPager: function (slideIndex) {
                        var new_slide_index = parseInt(slideIndex) + 1;
                        if (new_slide_index < 10)
                            new_slide_index = '0' + new_slide_index;
                        return new_slide_index;
                    },
                    onSlideAfter: function () {
                        if (feature_slider_paused == false)
                            latest_featured_slider.startAuto();
                    }
                });
            }
        }
    });
}

function MultipleContentSlider(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_content_types = data_attr['datacontent_types'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['content_types'] = data_content_types;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['sticky'] = data_sticky;

    var json_url = create_jsonp_url('multicontent.jsonp', json_obj);

    var feature_gallery_html = '';
    var feature_title = '';
    var feature_url = '';
    var feature_image = '';
    var feature_auto_image = '';
    var feature_field_description = '';
    var feature_field_description_maxlength = 150;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                feature_gallery_html += '<div id="landing-fpss-outer-container" class="latest-newsslider">';
                feature_gallery_html += '<div id="landing-fpss-container">';
                feature_gallery_html += '<div id="landing-fpss-slider">';
                feature_gallery_html += '<div id="landing-slide-wrapper">';
                feature_gallery_html += '<div id="multicontent-slide-outer">';
                jQuery.each(data.nodes, function (i, node_data) {

                    feature_title = node_data.node.promotional_title;
                    feature_url = node_data.node.path;
                    feature_image = node_data.node.image_466x248;
                    feature_auto_image = node_data.node.image_466x248;
                    feature_field_description = node_data.node.field_promo_leader_sentence;

                    if (feature_field_description.length > feature_field_description_maxlength) {
                        feature_field_description = feature_field_description.substr(0, feature_field_description_maxlength);
                        feature_field_description = feature_field_description.substr(0, Math.min(feature_field_description.length, feature_field_description.lastIndexOf(" ")));
                    }

                    if (!feature_image)
                        feature_image = feature_auto_image;

                    feature_gallery_html += '<div class="landing-slide">';
                    feature_gallery_html += '<div class="landing-slide-inner">';
                    feature_gallery_html += '<div class="fpss-img_holder_div_landing">';
                    feature_gallery_html += '<div id="fpss-img-div">';
                    if (node_data.node.content_type === "collection_asset" & node_data.node.links != '') {
                      feature_gallery_html += '<a href="' + node_data.node.links[0] + '" class="fpss_img">';
                    } else {
                      feature_gallery_html += '<a href="' + feature_url + '" class="fpss_img">';
                    }
                    feature_gallery_html += '<img width="472" alt="" src="' + feature_image + '" height="248" align="Bottom" border="0" />';
                    feature_gallery_html += '</a>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '<div class="landing-fpss-introtext">';
                    feature_gallery_html += '<div class="landing-slidetext">';
                    feature_gallery_html += '<h1>';
                    if (node_data.node.content_type === "collection_asset" && node_data.node.links != '') {
                      feature_gallery_html += '<a href="' + node_data.node.links[0] + '">' + feature_title + '</a>';
                    } else {
                      feature_gallery_html += '<a href="' + feature_url + '">' + feature_title + '</a>';
                    }
                    feature_gallery_html += '</h1>';
                    feature_gallery_html += '<p>' + feature_field_description + '</p>';
                    if (node_data.node.content_type === "collection_asset" & node_data.node.links != '') {
                      feature_gallery_html += '<a href="' + node_data.node.links[0] + '">&rsaquo;&nbsp;Read More</a>';
                    } else {
                      feature_gallery_html += '<a href="' + feature_url + '">&rsaquo;&nbsp;Read More</a>';
                    }                      
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';
                    feature_gallery_html += '</div>';

                });

                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';
                feature_gallery_html += '<div id="landing-navi-outer">';
                feature_gallery_html += '<div id="multicontent-navigation-items">';
                feature_gallery_html += '</div>';
                feature_gallery_html += '<div class="pause_multicontent_slider">';
                feature_gallery_html += '<a tabindex="1" onclick="pauseSlide(\'multicontent_slider\');" href="javascript:void(0);">Pause</a>';
                feature_gallery_html += '</div>';
                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    feature_gallery_html += '<div class="landing-fpss_archive_link">';
                    feature_gallery_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    feature_gallery_html += '</div>';
                }
                feature_gallery_html += '</div>';
                feature_gallery_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(feature_gallery_html);

                multicontent_slider = jQuery('#multicontent-slide-outer').bxSlider({
                    auto: true,
                    controls: false,
                    pause: 10000,
                    pagerSelector: '#multicontent-navigation-items',
                    buildPager: function (slideIndex) {
                        var new_slide_index = parseInt(slideIndex) + 1;
                        if (new_slide_index < 10)
                            new_slide_index = '0' + new_slide_index;
                        return new_slide_index;
                    },
                    onSlideAfter: function () {
                        if (feature_slider_paused == false)
                            multicontent_slider.startAuto();
                    }
                });
            }
        }
    });
}

function MultipleContentListing(data_attr,reload_content_only) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var data_show_attachments = data_attr['datashowattachments'];
    var data_show_links = data_attr['datashowlinks'];
    var data_show_date = data_attr['datashowdate'];
    var data_full_image = data_attr['datafullimage'];
    var data_routes = data_attr['dataroutes'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var data_content_types = data_attr['datacontent_types'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_pagination = data_attr['datapagination'];
    var data_sticky = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Routes'] = data_routes;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['content_types'] = data_content_types;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url = create_jsonp_url('multicontent.jsonp', json_obj);

    var collection_listing_html = '';
    var collection_content_listing_html = '';
    var collection_listing_title = '';
    var collection_listing_title_html = '';
    var collection_listing_promo_date = '';
    var collection_listing_promo_sentence = '';
    var collection_listing_promo_sentence_html = '';
    var collection_listing_image = '';
    var collection_listing_image_html = '';
    var collection_listing_url = '';

    var collection_listing_promo_sentence_maxlength = data_attr['datamaxlength'];

    var pagination_click = false;

    if (window[tag_id + '_ajax_call'])
        window[tag_id + '_ajax_call'].abort();

    window[tag_id + '_ajax_call'] = jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {

            if (data && typeof (data) == 'object') {
                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        collection_listing_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                    }


                collection_listing_html += '<div class="spacestn-features">';
                collection_listing_html += '<div class="feature-list">';
                collection_listing_html += '<div class="browseArchive">';
                collection_listing_html += '<ul class="no-list-style">';

                jQuery.each(data.nodes, function (i, node_data) {


                    var links_titles = node_data.node.link_titles;
                    var links_titles_arr = links_titles.split(',');
                    var links = node_data.node.links;
                    var link_length = links_titles_arr.length;
                    var bottom_links = '';
                    var hyphen = '';

                    var attachments_titles      = node_data.node.attachment_titles;
                    var attachments_urls        = node_data.node.attachment_urls;

                    var attachments_titles_arr  = attachments_titles.split(',');
                    var attachments_urls_arr    = attachments_urls.split(',');
                    var attachments_length      = attachments_titles_arr.length;
                    var attachment_links        = '';


                    if(link_length > 0 && data_show_links == 1) {
                        for(var j=0; j < link_length; j++) {
                            bottom_links += '<a tabindex="1" href ="' + links[j] + '">' + links_titles_arr[j] + '</a>';
                        }
                    }

                    if(attachments_length > 0  && data_show_attachments == 1) {
                        for(var j=0; j < attachments_length; j++) {
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace('://',':**');
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace('//','/');
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace(':**','://');
                            attachment_links += '<a tabindex="1" href ="' + attachments_urls_arr[j] + '">' + attachments_titles_arr[j] + '</a>';
                        }
                    }

                    collection_listing_title = node_data.node.title;
                    collection_listing_promo_date = node_data.node.promotional_date;
                    collection_listing_promo_sentence = node_data.node.promotional_leader_sentence;
                    collection_listing_image = (data_full_image == '1' ? node_data.node.image_466x248 : node_data.node.image_100x75);
                   // collection_listing_url = node_data.node.link_urls;

                    collection_listing_url='';
                    if (link_length > 0 && node_data.node.content_type === 'collection_asset') {
                        collection_listing_url = String(links[0]);
                        if (collection_listing_url == 'undefined') {
                                collection_listing_url= node_data.node.path;
                            }
                    } else if (node_data.node.content_type !== 'collection_asset') {
                        collection_listing_url = node_data.node.path;
                    }


                    var div = document.createElement("div");
                    div.innerHTML = node_data.node.promotional_leader_sentence;
                    var collection_listing_promo_sentence = div.textContent || div.innerText || "";
                    if (collection_listing_promo_sentence.length > collection_listing_promo_sentence_maxlength) {
                        collection_listing_promo_sentence = collection_listing_promo_sentence.substr(0, collection_listing_promo_sentence_maxlength);
                       // collection_listing_promo_sentence = collection_listing_promo_sentence + ' ...';
                    }
                    if (collection_listing_promo_sentence.length) {
                        hyphen = '-';
                    }

                    if (data_show_date == 0) {
                        collection_listing_promo_date = '';
                        hyphen = '';
                    }


                    if (collection_listing_image) {
                        if (collection_listing_url.length > 0) {
                            collection_listing_image_html = '<a tabindex="1" href="' + collection_listing_url + '" class="small_legacy_wrap">';
                        } else {
                            collection_listing_image_html = '<div class="small_legacy_wrap">';
                        }
                        collection_listing_image_html += '<img height="' + (data_full_image == '1' ?248:75) + '" border="0" align="Bottom" width="' + (data_full_image == '1' ?466:100) + '" src="' + collection_listing_image + '" class="collection_image">';

                        if (collection_listing_url.length > 0) {
                            collection_listing_image_html += '</a>';
                        } else {
                            collection_listing_image_html += '</div>';
                        }
                    } else { 
                        collection_listing_image_html = '';
                    }

                    collection_listing_title_html = '<h3 class="collection_title">';

                    if (collection_listing_url.length > 0) {
                        collection_listing_title_html += '<a tabindex="1" href="' + collection_listing_url + '">';
                        if(data_full_image == '1') {
                            collection_listing_title_html += collection_listing_promo_date + ' ' + hyphen + ' '
                            collection_listing_promo_date = '';
                            hyphen = '';
                        }
                        collection_listing_title_html += collection_listing_title;
                        collection_listing_title_html += '</a>';
                    } else {
                        collection_listing_title_html += '<b>' + collection_listing_title+ '</b>';
                    }
                    collection_listing_title_html += '</h3>';


                    collection_listing_promo_sentence_html = '<p>' + collection_listing_promo_date + ' ' + hyphen + ' ' + collection_listing_promo_sentence + '</p>';
                    if (bottom_links.length > 0) {
                        collection_listing_promo_sentence_html += '<p>' + bottom_links + '</p>';
                    }
                    if (attachment_links.length > 0) {
                        collection_listing_promo_sentence_html += '<p>' + attachment_links + '</p>';
                    }


                    if(data_full_image == '1'){
                        collection_content_listing_html += '<li>' + collection_listing_title_html + collection_listing_image_html + collection_listing_promo_sentence_html + '</li>';
                    }else{
                        collection_content_listing_html += '<li>' + collection_listing_image_html + collection_listing_title_html + collection_listing_promo_sentence_html + '</li>';
                    }

                });

               

                collection_listing_html += collection_content_listing_html;
                collection_listing_html += '</ul>';
                collection_listing_html += '</div>';


                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    collection_listing_html += '<div class="space-station-more">';
                    collection_listing_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    collection_listing_html += '</div>';
                }

                collection_listing_html += '</div>';

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    collection_listing_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(collection_content_listing_html);
                }  else {
                jQuery(current_tag).empty();
                jQuery(current_tag).html(collection_listing_html);

                        if( ( data_pagination=='1') && ( data.count > data_items) ) {
                            jQuery('.pagination-box', current_tag).pagination({
                                items: data.count,
                                itemsOnPage: data_items,
                                onPageClick : function (pageNumber, event) {
                                    if (pagination_click == true)
                                        return true;
                                    var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                    data_attr['paginationoffset'] = pagination_offset;
                                    MultipleContentListing(data_attr, true);
                                    pagination_click = true;
                                    jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                    pagination_click = false;
                                }
                            });

                            jQuery('.footer-pagination-box', current_tag).pagination({
                                items: data.count,
                                itemsOnPage: data_items,
                                onPageClick : function (pageNumber, event) {
                                    if (pagination_click == true)
                                        return true;
                                    var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                    data_attr['paginationoffset'] = pagination_offset;
                                    MultipleContentListing(data_attr, true);
                                    pagination_click = true;
                                    jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                    pagination_click = false;
                                }
                            });
                        }

                }

            }
        }
    });
}

function imageofthedayGallery(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_prevgallink_url = data_attr['dataprevgallinkurl'];
    var data_nextgallink_url = data_attr['datanextgallinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_routes = data_attr['dataroutes'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['Routes'] = data_routes;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    var image_of_the_day_html = '';
    var image_of_the_day_title = '';
    var image_of_the_day_path = '';
    var image_of_the_day_image_caption = '';
    var image_of_the_day_master_image = '';
    var image_of_the_day_image_430x323 = '';
    var image_of_the_day_image_100x75 = '';
    var image_of_the_day_image_800x600 = '';
    var image_of_the_day_image_1024x768 = '';
    var image_of_the_day_image_1600x1200 = '';
    var image_of_the_day_image_field_master_image = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                image_of_the_day_html += '<script type="text/javascript" src="/sites/all/modules/custom/nasawidgets/js/jquery-1.9.1.min.js"></script>';
                image_of_the_day_html += '<link href="/sites/all/modules/custom/nasawidgets/css/liteaccordion.css" rel="stylesheet" />';
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    image_of_the_day_html += '<link href="/sites/all/modules/custom/nasawidgets/css/liteaccordion-IE8.css" rel="stylesheet" type="text/css"/>';
                }
                image_of_the_day_html += '<script src="/sites/all/modules/custom/nasawidgets/js/jquery.easing.1.3.js"></script>';
                image_of_the_day_html += '<script src="/sites/all/modules/custom/nasawidgets/js/liteaccordion.jquery.js"></script>';
                image_of_the_day_html += '<script src="/sites/all/modules/custom/nasawidgets/js/iotd.js"></script>';
                image_of_the_day_html += '<script src="/sites/all/modules/custom/nasawidgets/js/headermenu.js"></script>';
                image_of_the_day_html += '<div class="gifloader" style="opacity:1;filter:alpha(opacity=100);width:715px;height:345px;position:absolute;padding-top:150px;text-align:center;"><img alt="Loading Images" src="/sites/all/themes/custom/NASAOmegaHTML5/images/ajax-loader.gif"/></div>';
                image_of_the_day_html += '<div class="content-wraper" style="opacity:0;filter:alpha(opacity=0);">';
                image_of_the_day_html += '<div class="row">';
                image_of_the_day_html += '<div class="col-two">';
                image_of_the_day_html += '<div class="thumb-slider withbg">';
                image_of_the_day_html += '<div class="img-gal-wrapper">';
                image_of_the_day_html += '<div class="img-gal">';
                image_of_the_day_html += '<div id="prev-btn">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="13" height="21"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="nxt-btn">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="13" height="21"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<a class="img-preview-link"><div id="previewcontainer">';
                image_of_the_day_html += '</div></a>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="imagecontainer">';
                image_of_the_day_html += '<div class="gallery_toolbar">';
                image_of_the_day_html += '<a tabindex="1" href class="icons_gallery icon_full">Full Screen</a>';
                image_of_the_day_html += '<span class="icons_gallery icon_slide">Slide Show</span>';
                image_of_the_day_html += '<span class="icons_gallery icon_thumb">View Thumbnails</span>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div class="thumb-grid">';
                image_of_the_day_html += '<div id="image_stack">';
                image_of_the_day_html += '<div id="upperAccordion">';
                image_of_the_day_html += '<ol>';
                var total_offset_slides_diff_amt = 9;
                var total_offset_slides = data_offset;
                if (total_offset_slides%50 == 0) {
                    total_offset_slides++;
                }
                var total_lower_slides = 1;
                var total_upper_slides = 1;
                jQuery.each(data.nodes, function (i, node_data) {
                    image_of_the_day_title = node_data.node.title;
                    image_of_the_day_path = node_data.node.path;
                    image_of_the_day_image_caption = node_data.node.image_caption;
                    image_of_the_day_master_image = node_data.node.master_image;
                    image_of_the_day_image_430x323 = node_data.node.image_430x323;
                    image_of_the_day_image_100x75 = node_data.node.image_100x75;
                    image_of_the_day_image_800x600 = node_data.node.image_800x600;
                    image_of_the_day_image_1024x768 = node_data.node.image_1024x768;
                    image_of_the_day_image_1600x1200 = node_data.node.image_1600x1200;
                    image_of_the_day_image_field_master_image = node_data.node.field_master_image;
                    var total_offset_slides_diff = Number(total_offset_slides) + Number(total_offset_slides_diff_amt);
                    if (total_lower_slides == 1) {
                        image_of_the_day_html += '<li data-slide-name="upperAccordion-set1" id="upperAccordion-set1">';
                        image_of_the_day_html += '<h2 class="uppertab"><img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/><span>' + total_offset_slides + '-' + total_offset_slides_diff + '</span></h2>';
                        image_of_the_day_html += '<div>';
                        image_of_the_day_html += '<div id="lowerAccordion-set1">';
                        image_of_the_day_html += '<ol>';
                    }
                    //slides 1-10
                    if (total_lower_slides == 11) {
                        image_of_the_day_html += '<li data-slide-name="upperAccordion-set2" id="upperAccordion-set2">';
                        image_of_the_day_html += '<h2 class="uppertab"><img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/><span>' + total_offset_slides + '-' + total_offset_slides_diff + '</span></h2>';
                        image_of_the_day_html += '<div>';
                        image_of_the_day_html += '<div id="lowerAccordion-set2">';
                        image_of_the_day_html += '<ol>';
                    }
                    //slides 11-20
                    if (total_lower_slides == 21) {
                        image_of_the_day_html += '<li data-slide-name="upperAccordion-set3" id="upperAccordion-set3">';
                        image_of_the_day_html += '<h2 class="uppertab"><img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/><span>' + total_offset_slides + '-' + total_offset_slides_diff + '</span></h2>';
                        image_of_the_day_html += '<div>';
                        image_of_the_day_html += '<div id="lowerAccordion-set3">';
                        image_of_the_day_html += '<ol>';
                    }
                    //slides 21-30
                    if (total_lower_slides == 31) {
                        image_of_the_day_html += '<li data-slide-name="upperAccordion-set4" id="upperAccordion-set4">';
                        image_of_the_day_html += '<h2 class="uppertab"><img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/><span>' + total_offset_slides + '-' + total_offset_slides_diff + '</span></h2>';
                        image_of_the_day_html += '<div>';
                        image_of_the_day_html += '<div id="lowerAccordion-set4">';
                        image_of_the_day_html += '<ol>';
                    }
                    //slides 31-40
                    if (total_lower_slides == 41) {
                        image_of_the_day_html += '<li data-slide-name="upperAccordion-set5" id="upperAccordion-set5">';
                        image_of_the_day_html += '<h2 class="uppertab"><img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/><span>' + total_offset_slides + '-' + total_offset_slides_diff + '</span></h2>';
                        image_of_the_day_html += '<div>';
                        image_of_the_day_html += '<div id="lowerAccordion-set5">';
                        image_of_the_day_html += '<ol>';
                    }
                    //slides 41-50

                    image_of_the_day_html += '<li data-slide-name="lowerAccordion-set' + total_upper_slides + '-slide' + total_offset_slides + '">';
                    image_of_the_day_html += '<h2>';
                    image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer_thumbnail.gif" alt="slide" class="thumbspacer"/>';
                    image_of_the_day_html += '<div class="img-preview">';
                    image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" name="' + image_of_the_day_image_430x323 + '" alt="' + image_of_the_day_title + '" />';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '<div class="img-full">';
                    image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" name="' + image_of_the_day_image_800x600 + '" alt="' + image_of_the_day_title + '" />';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '<div class="galcontainer">';
                    image_of_the_day_html += '<div class="img-desc">';
                    image_of_the_day_html += '<div class="img-info">';
                    image_of_the_day_html += '<div class="captiondetails">';
                    image_of_the_day_html += '<h3 class="subtitle">' + image_of_the_day_title + '</h3>';
                    image_of_the_day_html += '<p>' + image_of_the_day_image_caption + '</p>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '<div class="download_image_box">';
                    image_of_the_day_html += '<h3>Download Image</h3>';
                    image_of_the_day_html += '<span>»<a tabindex="1" class="Full_Size" href="' + image_of_the_day_image_field_master_image + '"> Full Size</a></span>';
                    image_of_the_day_html += '<span> »<a tabindex="1" class="1600x1200" href="' + image_of_the_day_image_1600x1200 + '"> 1600x1200</a></span>';
                    image_of_the_day_html += '<span> »<a tabindex="1" class="1024x768" href="' + image_of_the_day_image_1024x768 + '"> 1024x768</a></span>';
                    image_of_the_day_html += '<span> »<a tabindex="1" class="800x600" href="' + image_of_the_day_image_800x600 + '"> 800x600</a></span>';
                    image_of_the_day_html += '<span><a tabindex="1" class="Full_Path" href="' + image_of_the_day_path + '">&nbsp;</a></span></div>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '<b>' + total_offset_slides + '</b>';
                    image_of_the_day_html += '</h2>';
                    image_of_the_day_html += '<div><div class="lowerthumbnail"><img src="' + image_of_the_day_image_100x75 + '" alt="Click here to view gallery image"></div></div>';
                    image_of_the_day_html += '</li>';
                    //slides 1-10
                    if (total_lower_slides == 10) {
                        image_of_the_day_html += '</ol>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</li>';
                        total_upper_slides++;
                    }
                    //slides 11-20
                    if (total_lower_slides == 20) {
                        image_of_the_day_html += '</ol>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</li>';
                        total_upper_slides++;
                    }
                    //slides 21-30
                    if (total_lower_slides == 30) {
                        image_of_the_day_html += '</ol>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</li>';
                        total_upper_slides++;
                    }
                    //slides 31-40
                    if (total_lower_slides == 40) {
                        image_of_the_day_html += '</ol>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</li>';
                        total_upper_slides++;
                    }
                    //slides 41-50
                    if (total_lower_slides == 50) {
                        image_of_the_day_html += '</ol>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</div>';
                        image_of_the_day_html += '</li>';
                    }
                    total_lower_slides++;
                    total_offset_slides++;
                });
                if (total_lower_slides != '11' && total_lower_slides != '21' && total_lower_slides != '31' && total_lower_slides != '41' && total_lower_slides != '51') {
                    image_of_the_day_html += '</ol>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '</div>';
                    image_of_the_day_html += '</li>';
                }
                image_of_the_day_html += '</ol>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div class="imageset_left"></div>';
                image_of_the_day_html += '<div class="imageset_right"></div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="image_gallery" class="image_gallery_normal" style="display:none;">';
                image_of_the_day_html += '<div id="gallery_thumbgrid">';
                image_of_the_day_html += '<div id="gallery_thumbgrid_ranges">';
                image_of_the_day_html += '<div class="tabs">';
                image_of_the_day_html += '<a tabindex="1" href="' + data_prevgallink_url + '" id="prevgallink">prev</a>';
                image_of_the_day_html += '<ul class="tabNavigation">';
                image_of_the_day_html += '<li><a tabindex="1" href="#thumbnailsetone">1 - 25</a></li>';
                image_of_the_day_html += '<li><a tabindex="1" href="#thumbnailsettwo">25 - 50</a></li>';
                image_of_the_day_html += '</ul>';
                image_of_the_day_html += '<a tabindex="1" href="' + data_nextgallink_url + '" id="nextgallink">next</a>';
                image_of_the_day_html += '<div id="gallery_thumbgrid_close">';
                image_of_the_day_html += '<span>Close</span>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="thumbnailsets">';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div class="big-img-gal-wrapper">';
                image_of_the_day_html += '<div class="big-img-gal">';
                image_of_the_day_html += '<div id="big-prev-btn">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="13px" height="600px"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="big-previewcontainer">';
                image_of_the_day_html += '<div id="big-main-preview"></div>';
                image_of_the_day_html += '<div id="previewoverlay">';
                image_of_the_day_html += '<img id="play" src="/sites/all/themes/custom/NASAOmegaHTML5/images/play1.png" width="100" height="100" style="display:none;"/>';
                image_of_the_day_html += '<img id="pause" src="/sites/all/themes/custom/NASAOmegaHTML5/images/pause.png" width="100" height="100" style="display:none;"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="big-main-details"></div>';
                image_of_the_day_html += '<div id="big-nxt-btn">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="13px" height="600px"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="big-img-controls">';
                image_of_the_day_html += '<div id="big-controls-spacer">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="300px" height="18px"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<div id="big-controls-prev">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="69px" height="18px"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<span class="slidecontrol">Slide Show</span>';
                image_of_the_day_html += '<div id="big-controls-nxt">';
                image_of_the_day_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/spacer.gif" width="43px" height="18px"/>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '<span class="slideclose">Close</span>';
                image_of_the_day_html += '<span class="slidecaption">Caption</span>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';
                image_of_the_day_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(image_of_the_day_html);
            }
        }
    });
}

function FeaturesListing(data_attr, reload_content_only) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_pagination = data_attr['datapagination'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var data_sticky = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url = create_jsonp_url('latest_features.jsonp', json_obj);

    var pagination_click = false;



    var listing_feature_gallery_html = '';
    var listing_feature_gallery_content_html = '';
    var listing_title = '';
    var listing_url = '';
    var listing_image = '';
    var listing_auto_image = '';
    var listing_field_description = '';
    var listing_date = '';

    var listing_field_description_maxlength = data_attr['datamaxlength'];

    if (window[tag_id + '_ajax_call'])
        window[tag_id + '_ajax_call'].abort();

    window[tag_id + '_ajax_call'] = jQuery.ajax({

        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    listing_feature_gallery_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                }

                listing_feature_gallery_html += '<div class="spacestn-features">';
                listing_feature_gallery_html += '<div class="feature-list">';
                listing_feature_gallery_html += '<div class="browseArchive">';
                listing_feature_gallery_html += '<ul class="no-list-style">';
                jQuery.each(data.nodes, function (i, node_data) {

                    listing_title = node_data.node.promotional_title;
                    listing_url = node_data.node.path;
                    listing_image = node_data.node.image_100x75;
                    listing_auto_image = node_data.node.image_100x75;
                    listing_field_description = node_data.node.field_promo_leader_sentence;
                    listing_date = node_data.node.field_promotional_date;

                    if (listing_field_description.length > listing_field_description_maxlength) {
                        listing_field_description = listing_field_description.substr(0, listing_field_description_maxlength);
                        listing_field_description = listing_field_description.substr(0, Math.min(listing_field_description.length, listing_field_description.lastIndexOf(" ")));
                        listing_field_description = listing_field_description + ' ...';
                    }

                    if (!listing_image)
                        listing_image = listing_auto_image;

                    listing_feature_gallery_content_html += '<li>';
                    listing_feature_gallery_content_html += '<a tabindex="1" class="small_legacy_wrap" href="' + listing_url + '">';
                    listing_feature_gallery_content_html += '<img height="75" border="0" align="Bottom" width="100" src="' + listing_image + '">';
                    listing_feature_gallery_content_html += '</a>';
                    listing_feature_gallery_content_html += '<h3>';
                    listing_feature_gallery_content_html += '<a tabindex="1" href="' + listing_url + '">' + listing_title + '</a>';
                    listing_feature_gallery_content_html += '</h3>';
                    listing_feature_gallery_content_html += '<p>' + listing_date + ' - ' + listing_field_description;
                    listing_feature_gallery_content_html += '</li>';

                });

                listing_feature_gallery_html += listing_feature_gallery_content_html;

                listing_feature_gallery_html += '</ul>';
                listing_feature_gallery_html += '</div>';

                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    listing_feature_gallery_html += '<div class="space-station-more">';
                    listing_feature_gallery_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    listing_feature_gallery_html += '</div>';
                }

                listing_feature_gallery_html += '</div>';


                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    listing_feature_gallery_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(listing_feature_gallery_content_html);
                } else {

                jQuery(current_tag).empty();
                jQuery(current_tag).html(listing_feature_gallery_html);


                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        jQuery('.pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                FeaturesListing(data_attr, true);
                                pagination_click = true;
                                jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });

                        jQuery('.footer-pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                FeaturesListing(data_attr, true);
                                pagination_click = true;
                                jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });
                    }

                }

            }
        }
    });
}

function eventcatalog(data_attr, reload_content_only) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_pagination = data_attr['datapagination'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url = create_jsonp_url('event_catalogs.jsonp', json_obj);

    var pagination_click = false;



    var listing_eventcatalog_html = '';
    var listing_eventcatalog_content_html = '';
    var listing_title = '';
    var listing_url = '';
    var listing_image = '';
    var listing_auto_image = '';
    var listing_field_description = '';
    var listing_date = '';

    var listing_field_description_maxlength = data_attr['datamaxlength'];

    if (window[tag_id + '_ajax_call'])
        window[tag_id + '_ajax_call'].abort();

    window[tag_id + '_ajax_call'] = jQuery.ajax({

        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    listing_eventcatalog_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                }

                listing_eventcatalog_html += '<div class="spacestn-features">';
                listing_eventcatalog_html += '<div class="feature-list">';
                listing_eventcatalog_html += '<div class="browseArchive">';
                listing_eventcatalog_html += '<ul class="no-list-style">';
                jQuery.each(data.nodes, function (i, node_data) {

                    listing_title = node_data.node.title;
                    listing_url = node_data.node.path;
                    listing_image = node_data.node.thumbnail_image;
                    listing_auto_image = node_data.node.image_100x75;
                    listing_field_description = node_data.node.field_grade_level;
                    //listing_date = node_data.node.field_promotional_date;

                   /* if (listing_field_description.length > listing_field_description_maxlength) {
                        listing_field_description = listing_field_description.substr(0, listing_field_description_maxlength);
                        listing_field_description = listing_field_description + ' ...';
                    }*/

                    if (!listing_image)
                        listing_image = listing_auto_image;

                    listing_eventcatalog_content_html += '<li>';
                    listing_eventcatalog_content_html += '<a tabindex="1" class="small_legacy_wrap" href="' + listing_url + '">';
                    listing_eventcatalog_content_html += '<img height="75" border="0" align="Bottom" width="100" src="' + listing_image + '">';
                    listing_eventcatalog_content_html += '</a>';
                    listing_eventcatalog_content_html += '<h3>';
                    listing_eventcatalog_content_html += '<a tabindex="1" href="' + listing_url + '">' + listing_title + '</a>';
                    listing_eventcatalog_content_html += '</h3>';
                    listing_eventcatalog_content_html += '<p>'+listing_field_description+'</p>';
                    listing_eventcatalog_content_html += '</li>';

                });

                listing_eventcatalog_html += listing_eventcatalog_content_html;

                listing_eventcatalog_html += '</ul>';
                listing_eventcatalog_html += '</div>';

                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    listing_eventcatalog_html += '<div class="space-station-more">';
                    listing_eventcatalog_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    listing_eventcatalog_html += '</div>';
                }

                listing_eventcatalog_html += '</div>';


                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    listing_eventcatalog_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(listing_eventcatalog_content_html);
                } else {

                jQuery(current_tag).empty();
                jQuery(current_tag).html(listing_eventcatalog_html);


                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        jQuery('.pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                               eventcatalog(data_attr, true);
                                pagination_click = true;
                                jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });

                        jQuery('.footer-pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                eventcatalog(data_attr, true);
                                pagination_click = true;
                                jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
                        });
                    }

                }

            }
        }
    });
}

function YouTubeAccordion(data_attr) {

    var xmlsource = data_attr['xmlsource'];
    var data_playlist = data_attr['dataplaylist'];
    var current_tag = data_attr['currenttag'];
    var data_items = data_attr['dataitems'];
    var tag_id = data_attr['tagid'];

    var json_url = xmlsource + '/' + data_playlist + "?v=2&alt=jsonc&max-results=" + data_items;

    if (jQuery.browser.msie && window.XDomainRequest) {
    // Use Microsoft XDR
        setTimeout(function(){
          var xdr = new XDomainRequest();
          var url = json_url.replace('https://',window.location.protocol+'//');
          xdr.onload = function() {
            data = jQuery.parseJSON(xdr.responseText)
            if (data && typeof (data) == 'object') {
                parseYoutubeVideo(data);
            }
          };
          xdr.open("get", url);  
          xdr.send();  
        },100);
    } else {        
        jQuery.ajax({
            type: "GET",
            url: json_url,            
            success: function (data) {
                if (data && typeof (data) == 'object') {
                    parseYoutubeVideo(data);
                }
            }
        });
    } 
}

function MenuYouTubeVideosBlock(data_attr) {

    var xmlsource = data_attr['xmlsource'];
    var data_playlist = data_attr['dataplaylist'];
    var current_tag = data_attr['currenttag'];
    var data_items = data_attr['dataitems'];
    var tag_id = data_attr['tagid'];

    var json_url = xmlsource + '/' + data_playlist + "?v=2&alt=jsonc&max-results=" + data_items;

    if (navigator.userAgent.match(/msie/i) && window.XDomainRequest) {
    // Use Microsoft XDR
        setTimeout(function(){
          var xdr = new XDomainRequest();
          var url = json_url.replace('https://',window.location.protocol+'//');
          xdr.onload = function() {
            data = jQuery.parseJSON(xdr.responseText)
            if (data && typeof (data) == 'object') {
                parseMenuYoutubeVideo(data);
            }
          };
          xdr.open("get", url);  
          xdr.send();  
        },100);
    } else {
        jQuery.ajax({
        type: "GET",
        url: json_url,
            success: function (data) {
                if (data && typeof (data) == 'object') {
                    parseMenuYoutubeVideo(data);
                }
            }
        });
    }    
}

function parseYoutubeVideo(response) {

    var youtube_html = '';
    var playlist_id = '';
    var video_id = '';
    var video_title = '';
    var video_thumbnail = '';
    var video_position = '';
    var video_url = '';

    playlist_id = jQuery("div[data-blocktype='YouTubeAccordion']").attr('data-playlist-code');

    if (response && typeof (response) == 'object') {
        youtube_html += '<div class="latest-video-wrap">';
        youtube_html += '<div class="video-accordion">';
        jQuery.each(response.data.items, function (i, item) {

            video_id = item.video.id;
            video_title = item.video.title;
            video_thumbnail = item.video.thumbnail.hqDefault;
            video_position = item.position;
            video_url = 'http://www.youtube.com/watch?v=' + video_id + '&list=' + playlist_id + '&index=' + video_position;

            youtube_html += '<h3 class="accordiontitle">';
            youtube_html += video_title;
            youtube_html += '</h3>';
            youtube_html += '<div class="video-img">';
            //youtube_html += '<img src="'+ video_thumbnail +'" alt=""/>';
            youtube_html += '<iframe width="232" height="170"src="http://www.youtube.com/embed/' + video_id + '?enablejsapi=1&rel=0"></iframe>';
            youtube_html += '</div>';

        });
        youtube_html += '</div>';
        youtube_html += '<div id="more-videos-link">';
        youtube_html += '<a tabindex="1" href="http://www.youtube.com/playlist?list=' + playlist_id + '" target="_blank">&rsaquo; More Videos</a>';
        youtube_html += '</div>';
        youtube_html += '</div>';
    }

    jQuery("div[data-blocktype='YouTubeAccordion']").empty();
    jQuery("div[data-blocktype='YouTubeAccordion']").html(youtube_html);
    jQuery(".video-accordion").accordion({
        event: "hoverintent",
        heightStyle: "content",
        activate: function (event, ui) {
            var embed_parent = ui.oldPanel[0].parentNode.parentNode.parentNode;
            var frame_block = jQuery('iframe', ui.oldPanel[0])[0];
            pauseYouTubeVideo(frame_block, embed_parent);
        }
    });
}

function pauseYouTubeVideo(frame, embed_parent) {
    jQuery('iframe[src*="http://www.youtube.com/embed/"]', embed_parent).each(function(i) {
        var func = 'pauseVideo';
        this.contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    });
}

function parseMenuYoutubeVideo(response) {

    var menu_youtube_html = '';
    var menu_playlist_id = '';
    var menu_video_id = '';
    var menu_video_title = '';
    var menu_video_position = '';
    var menu_video_url = '';

    menu_playlist_id = jQuery("div[data-blocktype='MenuYouTubeVideosBlock']").attr('data-playlist-code');

    if (response && response.data != null && typeof (response) == 'object') {
        menu_youtube_html += '<ul class="listing">';
        jQuery.each(response.data.items, function (i, item) {

            menu_video_id = item.video.id;
            menu_video_title = item.video.title;
            menu_video_position = item.position;
            menu_video_url = 'http://www.youtube.com/watch?v=' + menu_video_id + '&list=' + menu_playlist_id + '&index=' + menu_video_position;


            menu_youtube_html += '<li>';
            menu_youtube_html += '<a tabindex="1" href="' + menu_video_url + '" target="_blank">' + menu_video_title + '</a>';
            menu_youtube_html += '</li>';


        });
        menu_youtube_html += '</ul>';

        jQuery("div[data-blocktype='MenuYouTubeVideosBlock']").empty();
        jQuery("div[data-blocktype='MenuYouTubeVideosBlock']").html(menu_youtube_html);
    }
}

function parseEvents(data_attr) {

    var data_collections = data_attr['datacollections'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['routes'] = data_routes;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('homepageeventsview.jsonp', json_obj);

    var event_html = '';
    var event_url = '';
    var event_title = '';
    var event_time = '';

    var event_timers = new Array();
    var event_timer_classes = new Array();

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                event_html += '<div class="upcoming-events">';
                event_html += '<div class="event-nav-button">';
                event_html += '<span id="event_prev" class="eventPrev"></span>';
                event_html += '<span id="event_next" class="eventNext"></span>';
                event_html += '</div>';
                event_html += '<div class="event-content">';
                event_html += '<div class="event-block">';
                jQuery.each(data.events, function (i, event) {

                    event_url = event.eventnode.LinkURL;
                    event_title = event.eventnode.title;
                    event_time = event.eventnode.field_event_date_and_time;
                    event_time_now = event.eventnode.date_time_now;

                    event_title = event_title.replace(/"/g, '&quot;');

                    var div_class = 'events';

                    if(event_time) {

                        div_class += ' events_time';
                    }

                    event_html += '<div class="'+ div_class +'">';
                    event_html += '<a tabindex="1" href="' + event_url + '" title="' + event_title + '">';
                    event_html += '<span class="info"><span class="count-down-info count_timer_' + i + '"></span>' + event_title + '</span>';
                    event_html += '</a>';
                    event_html += '</div>';

                    event_timers.push(new Array(event_time,event_time_now));
                    event_timer_classes.push("count_timer_" + i);

                });
                event_html += '</div>';
                event_html += '<div class="more-block">';
                event_html += '<div class="more">';
                event_html += '<div class="calendar-icon icon">';
                event_html += '<a tabindex="1" href="http://calendar.nasa.gov/calendar/">';
                event_html += '<span class="label">View Events Calendar</span> ';
                event_html += '</a>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '<div class="more">';
                event_html += '<div class="launch-icon icon">';
                event_html += '<a tabindex="1" href="http://www.nasa.gov/missions/highlights/schedule.html">';
                event_html += '<span class="label">Launch Schedule</span>';
                event_html += '</a>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '<div class="more">';
                event_html += '<div class="tv-icon icon">';
                event_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/nasatv/schedule.html">';
                event_html += '<span class="label">NASA TV Schedule</span>';
                event_html += '</a>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '<div class="popular-block">';
                event_html += '<h3>POPULAR TOPICS</h3>';
                event_html += '<div class="drop-down">';
                event_html += '<select onchange="if (this.value) window.location.href=this.value">';
                event_html += '<option value="">Select...</option>';
                event_html += '<option value="http://www.nasa.gov/mission_pages/station/main/index.html">Space Station</option>';
                event_html += '<option value="http://www.nasa.gov/topics/solarsystem/index.html">Solar System</option>';
                event_html += '<option value="http://www.nasa.gov/exploration/home/index.html">Beyond Earth</option>';
                event_html += '<option value="http://www.nasa.gov/exploration/commercial/index.html">Commercial Space</option>';
                event_html += '<option value="http://www.nasa.gov/topics/universe/index.html">Universe</option>';
                event_html += '<option value="http://www.nasa.gov/topics/earth/index.html">Earth</option>';
                event_html += '<option value="http://www.nasa.gov/topics/aeronautics/index.html">Aeronautics</option>';
                event_html += '<option value="http://www.nasa.gov/topics/technology/index.html">Technology</option>';
                event_html += '<option value="http://www.nasa.gov/topics/nasalife/index.html">NASA in Your Life</option>';
                event_html += '<option value="http://www.nasa.gov/topics/history/index.html">NASA History & People</option>';
                event_html += '</select>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '</div>';
                event_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(event_html);

                var slider = jQuery('.event-block').bxSlider({
                    pager: false,
                    nextSelector: '#event_next',
                    prevSelector: '#event_prev',
                    auto: true,
                    speed: 1000,

                    onSlideAfter: function($slideElement, oldIndex, newIndex){

                        var event_class = $slideElement.attr('class');

                        if(event_class == 'events events_time') {
                            slider.setPause(6000);
                        }
                    }
                });

                jQuery.each(event_timers, function (j, event_timer_value) {

                    if (event_timer_value[0] != '') {
                        var event_timer_class = event_timer_classes[j];
                        var event_timestamp = new Date(event_timer_value[0]);
                        var now = new Date();
                        var event_timestamp_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                        var opts = {};
                        opts[event_timestamp >= Date.now() ? "until" : "since"] = event_timestamp;
                        opts['serverSync'] = function(){ return event_timestamp_now; }
                        jQuery('.' + event_timer_class).countdown(opts);
                    }
                });
            }
        }
    });
}

function parse_nasa_blogs(data_attr) {

    var current_tag = data_attr['currenttag'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var fid = data_attr['datablogfid'];
    var json_obj = {};

    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['fid'] = fid;

    var json_url = create_jsonp_url('nasa_blogs.jsonp', json_obj);

    var blog_html = '';
    var blog_timestamp = '';
    var blog_title = '';
    var blog_description = '';
    var blog_url = '';

    var blog_description_maxlength = 50;
    var blog_title_mexlength = 50;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                blog_html += '<div class="blog-list">';
                blog_html += '<ul>';
                jQuery.each(data.nodes, function (i, node_value) {

                    blog_timestamp = timeDifference(node_value.node.timestamp);
                    blog_title = node_value.node.title;
                    blog_description = node_value.node.description;
                    blog_url = node_value.node.link;

                    if (blog_description.length > blog_description_maxlength) {
                        blog_description = blog_description.substr(0, blog_description_maxlength);
                        blog_description = blog_description.substr(0, Math.min(blog_description.length, blog_description.lastIndexOf(" ")));
                        blog_description = blog_description + ' ...';
                    }

                    if (blog_title.length > blog_title_mexlength) {
                        blog_title = blog_title.substr(0, blog_title_mexlength);
                        blog_title = blog_title.substr(0, Math.min(blog_title.length, blog_title.lastIndexOf(" ")));
                        blog_title = blog_title + ' ...';
                    }

                    blog_html += '<li>';
                    blog_html += '<div>';
                    blog_html += '<b>';
                    blog_html += '<a tabindex="1" href="' + blog_url + '" title="' + blog_title + '">';
                    blog_html += blog_title;
                    blog_html += '</a>';
                    blog_html += '</b>';
                    blog_html += '<p><span class="datefield">';
                    blog_html += blog_timestamp;
                    blog_html += '</span></p>';
                    blog_html += '<p>';
                    blog_html += blog_description;
                    blog_html += '</p>';
                    blog_html += '</div>';
                    blog_html += '</li>';

                });
                blog_html += '</ul>';
                blog_html += '<p class="short-link">';
                blog_html += '<a tabindex="1" href="http://blogs.nasa.gov/">&rsaquo; All Blogs</a>';
                blog_html += '</p>';
                blog_html += '</div>';

                jQuery(current_tag).empty();
                jQuery(current_tag).html(blog_html);
            }
        }
    });
}

function ImageAccordionGallery(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags= data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_routes = data_attr['dataroutes'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['Routes'] = data_routes;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    var accordion_html = '';
    var accordion_caption = '';
    var accordion_title = '';
    var accordion_thumbnail = '';
    var accordion_url = '';
    var accordion_content_maxlength = 250;
    var accordion_auto_thumbnail = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                accordion_html += '<div class="image_accordion_container">';
                accordion_html += '<div id="image_accordion_container">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    //accordion_caption = item.node.field_image_caption;
                   // accordion_title = item.node.promotional_title;
                    accordion_thumbnail = item.node.field_thumbnail_image_226x170;
                    accordion_url = item.node.path;
                    accordion_auto_thumbnail = item.node.image_226x170;

                    var div = document.createElement("div");
                    div.innerHTML = item.node.promotional_title;
                    var accordion_title = div.textContent || div.innerText || "";


                    if (!accordion_thumbnail)
                        accordion_thumbnail = accordion_auto_thumbnail;

                    var div = document.createElement("div");
                    div.innerHTML = item.node.field_image_caption;
                    var accordion_caption = div.textContent || div.innerText || "";
                    if(accordion_caption.length > accordion_content_maxlength){
                        accordion_caption = accordion_caption.substr(0, accordion_content_maxlength);
                        accordion_caption = accordion_caption.substr(0, Math.min(accordion_caption.length, accordion_caption.lastIndexOf(" ")))+' ...';
                    }

                    accordion_html += '<h3 class="image_accordion_heading">';
                    accordion_html += accordion_title;
                    accordion_html += '</h3>';
                    accordion_html += '<div class="image_accordion_content">';
                    accordion_html += '<div class="fill_narrow_blind_wrap">';
                    accordion_html += '<a tabindex="1" href="' + accordion_url + '" title="' + accordion_title + '">';
                    accordion_html += '<img alt="' + accordion_title + '" title="' + accordion_title + '" src="' + accordion_thumbnail + '" width="226"  height="170" align="Bottom" border="0" />';
                    accordion_html += '</a>';
                    accordion_html += '</div>';
                    accordion_html += '<p>';
                    accordion_html += accordion_caption;
                    accordion_html += '</p>';
                    accordion_html += '<div class="story_link">';
                    accordion_html += '<a tabindex="1" href="' + accordion_url + '" title="' + accordion_title + '">&rsaquo; View Image</a>';
                    accordion_html += '</div>';
                    accordion_html += '</div>';
                });
                accordion_html += '</div>';
                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    accordion_html += '<div class="accordion-more-link">';
                    accordion_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    accordion_html += '</div>';
                }
                accordion_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(accordion_html);

            jQuery("#image_accordion_container").accordion({ heightStyle: "content", event: "hoverintent" });
        }
    });
}

function ImageAccordionGallery_1col(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags= data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_routes = data_attr['dataroutes'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['Routes'] = data_routes;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    var accordion_html = '';
    var accordion_promo_leader_sentence = '';
    var accordion_title = '';
    var accordion_thumbnail = '';
    var accordion_url = '';
    var accordion_content_maxlength = 90;
    var accordion_auto_thumbnail = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                accordion_html += '<div class="image_accordion_container">';
                accordion_html += '<div id="image_accordion_1col_container">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                   accordion_promo_leader_sentence = item.node.field_promo_leader_sentence;
                   // accordion_title = item.node.promotional_title;
                    accordion_thumbnail = item.node.field_thumbnail_image_226x170;
                    accordion_url = item.node.path;
                    accordion_auto_thumbnail = item.node.image_226x170;

                    var div = document.createElement("div");
                    div.innerHTML = item.node.promotional_title;
                    var accordion_title = div.textContent || div.innerText || "";


                    if (!accordion_thumbnail)
                        accordion_thumbnail = accordion_auto_thumbnail;

                    var div = document.createElement("div");
                    div.innerHTML = item.node.field_promo_leader_sentence;
                    var accordion_promo_leader_sentence = div.textContent || div.innerText || "";
                    if(accordion_promo_leader_sentence.length > accordion_content_maxlength){
                        accordion_promo_leader_sentence = accordion_promo_leader_sentence.substr(0, accordion_content_maxlength);
                        accordion_promo_leader_sentence = accordion_promo_leader_sentence.substr(0, Math.min(accordion_promo_leader_sentence.length, accordion_promo_leader_sentence.lastIndexOf(" ")));
                    }

                    accordion_html += '<h3 class="image_accordion_heading">';
                    accordion_html += accordion_title;
                    accordion_html += '</h3>';
                    accordion_html += '<div class="image_accordion_content">';
                    accordion_html += '<div class="fill_narrow_blind_wrap_onecol_accordion">';
                    accordion_html += '<a tabindex="1" href="' + accordion_url + '" title="' + accordion_title + '">';
                   accordion_html += '<img alt="' + accordion_title + '" title="' + accordion_title + '" src="' + accordion_thumbnail + '" width="226"  height="170" align="Bottom" border="0" style="margin: -9px 0 0 -13.8px" />';
                    accordion_html += '</a>';
                    accordion_html += '</div>';
                    accordion_html += '<p>';
                    accordion_html += accordion_promo_leader_sentence;
                    accordion_html += '</p>';
                    accordion_html += '<div class="story_link">';
                    accordion_html += '<a tabindex="1" href="' + accordion_url + '" title="' + accordion_title + '">&rsaquo; View Image</a>';
                    accordion_html += '</div>';
                    accordion_html += '</div>';
                });
                accordion_html += '</div>';
                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    accordion_html += '<div class="accordion-more-link">';
                    accordion_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    accordion_html += '</div>';
                }
                accordion_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(accordion_html);

            jQuery("#image_accordion_1col_container").accordion({ heightStyle: "content", event: "hoverintent" });
        }
    });
}

function MissionBanner(data_attr) {

    var data_collections = data_attr['datacollections'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_items = data_attr['dataitems'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;

    var json_url = create_jsonp_url('mission_banner.jsonp', json_obj);

    var mission_html = '';
    var mission_subtitle = '';
    var mission_title = '';
    var mission_banner_image = '';
    var mission_banner_url = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                jQuery.each(data.nodes, function (i, item) {

                    mission_subtitle = item.node.field_subtitle;
                    mission_title = item.node.title;
                    mission_banner_image = item.node.field_banner_image;
                    mission_banner_url = item.node.link;
                    if(mission_banner_url==''){
                        mission_banner_url='#';
                    }

                    mission_html += '<div class="banner-wrap" style="background: url(' + mission_banner_image + ') no-repeat scroll 0 0 transparent;">';
                    mission_html += '<a tabindex="1" href="' + mission_banner_url + '">';
                    mission_html += '<div id="banner">';
                    mission_html += '<h4>' + mission_title + '</h4>';
                    mission_html += '<p>' + mission_subtitle + '</p>';
                    mission_html += '</div>';
                    mission_html += '</a>';
                    mission_html += '</div>';

                });

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(mission_html);
        }
    });
}

function parseLinks(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};
    
    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);


    var link_html = '';
    var link_urls = '';
    var link_titles = '';
    var link_title = '';
    var link_image = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                link_html += '<div id="mission_container">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    link_urls = item.node.link_urls;
                    link_titles = item.node.link_titles;
                    link_image = item.node.image_100x75;

                    var temp_urls = new Array();
                    temp_urls = link_urls.split(",");

                    var temp_titles = new Array();
                    temp_titles = link_titles.split(",");

                    if (link_image == '')
                        var new_tag_class = " no-image";
                    else
                        var new_tag_class = "";

                    link_html += '<div id="ullitags">';
                    link_html += '<div class="site-img">';
                    link_html += '<img src="' + link_image + '" class="mission_image" width="100" height="75" />';
                    link_html += '</div>';
                    link_html += '<div class="txt">';
                    jQuery.each(temp_urls, function (j, link_url) {

                        link_title = temp_titles[j];
                        link_html += '<a tabindex="1" href="' + link_url + '" class="' + new_tag_class + '">' + link_title + '</a>';

                    });
                    link_html += '</div>';
                    link_html += '</div>';

                });
                link_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(link_html);
        }
    });
}

function connectWithNasa(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var connect_with_nasa_html = '';
    var connect_with_nasa_title = '';
    var connect_with_nasa_link_title = '';
    var connect_with_nasa_thumbnail = '';
    var connect_with_nasa_url = '';
    var connect_with_nasa_auto_thumbnail = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                connect_with_nasa_html += '<div id="imgGallery5Col">';
                connect_with_nasa_html += '<ul>';
                jQuery.each(data.nodes, function (i, item) {

                    connect_with_nasa_title = item.node.title;
                    connect_with_nasa_thumbnail = item.node.field_thumbnail_image_226x170;
                    connect_with_nasa_auto_thumbnail = item.node.image_100x75;
                    connect_with_nasa_link_title = item.node.link_titles;
                    connect_with_nasa_url = item.node.link_urls;

                    if (!connect_with_nasa_link_title)
                        connect_with_nasa_link_title = connect_with_nasa_title;

                    if (!connect_with_nasa_thumbnail)
                        connect_with_nasa_thumbnail = connect_with_nasa_auto_thumbnail;

                    connect_with_nasa_link_title = connect_with_nasa_link_title.replace(/"/g, '&quot;');

                    connect_with_nasa_html += '<li>';
                    connect_with_nasa_html += '<a tabindex="1" href="' + connect_with_nasa_url + '">';
                    connect_with_nasa_html += '<img width="100" height="75" border="0" align="Bottom" title="' + connect_with_nasa_link_title + '" src="' + connect_with_nasa_thumbnail + '" alt="' + connect_with_nasa_link_title + '">';
                    connect_with_nasa_html += '</a>';
                    connect_with_nasa_html += '<p>';
                    connect_with_nasa_html += '<a tabindex="1" href="' + connect_with_nasa_url + '">' + connect_with_nasa_link_title + '</a>';
                    connect_with_nasa_html += '</p>';
                    connect_with_nasa_html += '</li>';
                });
                connect_with_nasa_html += '</ul>';
                connect_with_nasa_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(connect_with_nasa_html);
        }
    });
}

function collectionsBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var max_length = data_attr['maxlength'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};
    
    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var collections_html = '';
    var collections_titles = '';
    var collections_urls = '';
    var collections_thumbnail = '';
    var collections_auto_thumbnail = '';
    var collection_title = '';
    var collection_description = '';
    var collection_description_maxlength = max_length;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                collections_html += '<div class="space-staion-more-container">';
                collections_html += '<ul class="no-list-style">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    collections_titles = item.node.link_titles;
                    collections_urls = item.node.link_urls;
                    collection_title = item.node.title
                    collections_thumbnail = item.node.field_thumbnail_image_100x75;
                    collection_description = item.node.field_promo_leader_sentence;
                    collections_auto_thumbnail = item.node.image_100x75;

                    if (collection_description) {
                        if (collection_description.length > collection_description_maxlength) {
                            collection_description = collection_description.substr(0, collection_description_maxlength);
                            collection_description = collection_description.substr(0, Math.min(collection_description.length, collection_description.lastIndexOf(" ")));
                            collection_description += "...";
                        }
                    }
                    else {
                        collection_description = "";
                    }

                    if (!collections_thumbnail)
                        collections_thumbnail = collections_auto_thumbnail;

                    var temp_collection_urls = new Array();
                    temp_collection_urls = collections_urls.split(",");
                    var temp_collection_urls_length = temp_collection_urls.length;

                    var temp_collection_titles = new Array();
                    temp_collection_titles = collections_titles.split(",");


                    var attachments_titles      = item.node.attachment_titles;
                    var attachments_urls        = item.node.attachment_urls;

                    var attachments_titles_arr  = attachments_titles.split(',');
                    var attachments_urls_arr    = attachments_urls.split(',');
                    var attachments_length      = attachments_titles_arr.length;
                    var attachment_links        = '';

                    if(attachments_length) {
                        for(var j=0; j < attachments_length; j++) {
                            attachment_links += '<a tabindex="1" href ="' + attachments_urls_arr[j] + '">' + attachments_titles_arr[j] + '</a>';
                        }
                    }

                    collection_title = collection_title.replace(/"/g, '&quot;');
                    collections_html += '<li>';

                    if(temp_collection_urls_length) {
                        collections_html += '<h3><a tabindex="1" href="' + temp_collection_urls[0] + '">' + collection_title + '</a></h3>'
                    } else {
                    collections_html += '<h3>' + collection_title + '</h3>';
                    }

                    if (collections_thumbnail) {
                        collections_html += '<span class="image_wrapper">';
                        collections_html += '<img width="100" height="75" border="0" align="Bottom" title="' + collection_title + '" src="' + collections_thumbnail + '" alt="' + collection_title + '"/>';
                        collections_html += '</span>';
                    }

                    collections_html += '<p>' + collection_description + '</p>';

                    jQuery.each(temp_collection_urls, function (j, temp_collection_url) {
                        temp_collection_title = temp_collection_titles[j];
                        collections_html += '<a tabindex="1" href="' + temp_collection_url + '">' + temp_collection_title + '</a>';
                    });

                    collections_html += attachment_links;
                    collections_html += '</li>';

                });
                collections_html += '</ul>';
                collections_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(collections_html);
        }
    });
}

function CollectionsAccordion_1col(data_attr) {


    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags= data_attr['dataother_tags'];
    var data_collectionlink = data_attr['collectionlink'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_routes = data_attr['dataroutes'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['collectionlink'] = data_collectionlink;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;
    json_obj['Routes'] = data_routes;
    json_obj['sticky'] = data_sticky;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var accordion_html = '';
    var accordion_promo_leader_sentence = '';// collectionsBlock equivalent is collection_description
    var accordion_title = '';
    var accordion_thumbnail = '';
    var url_defaulttext = 'Related Link'; // used in untitled URLs
    var attachment_defaulttext = 'Attachment'; // used in untitled attachments
    var accordion_content_maxlength = 90;
    var accordion_auto_thumbnail = '';
    var accordion_bullet = '&rsaquo;';
    var collections_titles = ''; // exists in addition to accordion_title
    var collections_urls = '';


    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                accordion_html += '<div class="collection_accordion_container">';
                accordion_html += '<div id="collection_accordion_container">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                   // accordion_title = item.node.promotional_title;
                    accordion_thumbnail = item.node.field_thumbnail_image_226x170;
                    accordion_auto_thumbnail = item.node.image_226x170;

                    var div = document.createElement("div");
                    div.innerHTML = item.node.promotional_title;
                    var accordion_title = div.textContent || div.innerText || "";


                    if (!accordion_thumbnail)
                        accordion_thumbnail = accordion_auto_thumbnail;

                    // Begin Promo Leader Sentence Code.
                    accordion_promo_leader_sentence = item.node.field_promo_leader_sentence;
                    var div = document.createElement("div");
                    div.innerHTML = item.node.field_promo_leader_sentence;
                    var accordion_promo_leader_sentence = div.textContent || div.innerText || "";
                    if(accordion_promo_leader_sentence.length > accordion_content_maxlength){
                        accordion_promo_leader_sentence = accordion_promo_leader_sentence.substr(0, accordion_content_maxlength);
                        accordion_promo_leader_sentence = accordion_promo_leader_sentence.substr(0, Math.min(accordion_promo_leader_sentence.length, accordion_promo_leader_sentence.lastIndexOf(" ")));
                    }

                    // End Promo Leader Sentence Code. Begin URL Links Code.
                    collections_urls = item.node.link_urls;
                    var temp_collection_urls = new Array();
                    temp_collection_urls = collections_urls.split(",");

                    collections_titles = item.node.link_titles;
                    var temp_collection_titles = new Array();
                    temp_collection_titles = collections_titles.split(",");

                    var url_links = '';
                    var temp_collection_urls_untitledcount = 0;
                    var temp_collection_urls_upperlimit = 3;

                    // If there aren't any URL links, then do nothing.
                    if (temp_collection_urls == '') {
                    } else {
                      // For each URL, check if there's a title. If not, then use url_defaulttext as the URL title.
                      // If more than one is untitled, append #number after url_defaulttext.
                      // Note: Upper iteration limit can be substituted with temp_collection_urls.length to ensure
                      // that all URLs are included in the accordion rather than just the first three (deltas 0, 1, and 2).
                      for (var j=0; j < temp_collection_urls.length && j < temp_collection_urls_upperlimit; j++) {
                        // Trim the title because after the first empty title,
                        // the rest seem to have a space auto-inserted by Drupal.
                        if (temp_collection_titles[j].trim() === '' ) {
                          temp_collection_urls_untitledcount++;
                          if (temp_collection_urls_untitledcount > 1) {
                            url_links += '<a tabindex="1" href="' + temp_collection_urls[j] + '">' + accordion_bullet + ' ';
                            url_links += url_defaulttext + ' &#35;' + temp_collection_urls_untitledcount + '</a></br >';
                          } else {
                            url_links += '<a tabindex="1" href="' + temp_collection_urls[j] + '">' + accordion_bullet + ' ';
                            url_links += url_defaulttext + '</a></br >';
                          }
                        } else {
                          // If there is indeed a title, then use that for the URL link
                          url_links += '<a tabindex="1" href="' + temp_collection_urls[j] + '">' + accordion_bullet + ' ';
                          url_links += temp_collection_titles[j] + '</a><br/>';
                        }
                      }
                    }

                    // End URL Links Code. Begin Attachment Links Code.
                    var attachments_titles      = item.node.attachment_titles;
                    var attachments_urls        = item.node.attachment_urls;

                    var attachments_titles_arr  = attachments_titles.split(',');
                    var attachments_urls_arr    = attachments_urls.split(',');

                    var attachment_links        = '';
                    var attachment_urls_arr_untitledcount = 0;
                    var attachment_urls_arr_upperlimit = 1;

                    if (attachments_urls_arr == '') {
                    } else {
                      // For each attachment, check if there's a title. If not, then use attachment_defaulttext as the attachment title.
                      // If more than one is untitled, append #number after attachment_defaulttext.
                      // Following all this, indicate filetype, as taken from a substring of the filename in the URL.
                      // Note: Upper iteration limit can be substituted with attachments_urls_arr.length to ensure
                      // that all URLs are included in the accordion rather than just the first one (delta 0).
                      for(var j=0; j < attachment_urls_arr_upperlimit; j++) {
                        // Check if a trimmed version of the title is empty. After the first empty title,
                        // the rest seem to have a space auto-inserted by Drupal.
                        if (attachments_titles_arr[j].trim() === '') {
                          attachment_urls_arr_untitledcount++;
                          if (attachment_urls_arr_untitledcount > 1) {
                              attachment_links += '<a tabindex="1" href="' + attachments_urls_arr[j] + '">' + accordion_bullet + ' ';
                              attachment_links += attachment_defaulttext + ' &#35;' + attachment_urls_arr_untitledcount;
                              attachment_links += ' [' + attachments_urls_arr[j].substr(attachments_urls_arr[j].lastIndexOf(".") + 1, 4).toUpperCase() + ']</a></br >';
                          } else {
                            attachment_links += '<a tabindex="1" href ="' + attachments_urls_arr[j] + '">' + accordion_bullet + ' ';
                            attachment_links += attachment_defaulttext;
                            attachment_links +=  ' [' + attachments_urls_arr[j].substr(attachments_urls_arr[j].lastIndexOf(".") + 1, 4).toUpperCase() + ']</a><br />';
                          }
                        } else {
                          // If there is indeed a title, then use that for the URL link
                          attachment_links += '<a tabindex="1" href ="' + attachments_urls_arr[j] + '">' + accordion_bullet + ' ';
                          attachment_links += attachments_titles_arr[j];
                          attachment_links += ' [' + attachments_urls_arr[j].substr(attachments_urls_arr[j].lastIndexOf(".") + 1, 4).toUpperCase() + ']</a><br />';
                        }
                       }
                    }

                    // End Attachment Links Code. Begin HTML for the content block/widget, inserted via jQuery.
                    accordion_html += '<h3 class="image_accordion_heading">';
                    accordion_html += accordion_title;
                    accordion_html += '</h3>';
                    accordion_html += '<div class="image_accordion_content">';
                    if (accordion_thumbnail) {
                      accordion_html += '<div class="fill_narrow_blind_wrap_onecol_accordion">';
                      accordion_html += '<a tabindex="1" href="' + temp_collection_urls[0] + '" title="' + accordion_title + '">';
                      accordion_html += '<img alt="' + accordion_title + '" title="' + accordion_title + '" src="' + accordion_thumbnail + '" width="226"  height="170" align="Bottom" border="0" style="margin: -9px 0 0 -13.8px"/>';
                      accordion_html += '</a>';
                      accordion_html += '</div>';
                    }
                    accordion_html += '<p>';
                    accordion_html += accordion_promo_leader_sentence;
                    accordion_html += '</p>';
                    accordion_html += url_links;
                    accordion_html += attachment_links;
                    accordion_html += '<br /><div class="story_link">';
                    if (data_collectionlink == 1) {
                      accordion_html += '<a tabindex="1" href="' + item.node.path + '" title="' + accordion_title + '">&rsaquo; View Full Collection</a>';
                    } else {
                    }
                    accordion_html += '</div>';
                    accordion_html += '</div>';
                });
                accordion_html += '</div>';
                if (data_morelink_url!= '' && data_morelink_text!='' && ( data.count > data_items)) {
                    accordion_html += '<div class="accordion-more-link">';
                    accordion_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    accordion_html += '</div>';
                }
                accordion_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(accordion_html);

            jQuery("#collection_accordion_container").accordion({ heightStyle: "content", event: "hoverintent" });
        }
    });
}

function MenuMissionLaunchBlock(data_attr) {

    var data_collections = data_attr['datacollections'];
    var data_routes = data_attr['dataroutes'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_item_type = data_attr['dataitemtype'];
    var data_calendar = data_attr['datacalendar'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Routes'] = data_routes;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['Item_type'] = data_item_type;
    json_obj['Calendar_Name'] = data_calendar;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('nexteventjsonp.jsonp', json_obj);

    var menu_mission_html = '';
    var menu_mission_title = '';
    var menu_mission_url = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                menu_mission_html += '<ul class="listing">';
                menu_mission_html += '<li>';
                menu_mission_html += '<b>Next Launch:</b>';
                menu_mission_html += '</li>';
                jQuery.each(data.nodes, function (i, item) {

                    menu_mission_title = item.node.title;
                    menu_mission_url = item.node.field_additional_link_1;

                    menu_mission_html += '<li>';
                    menu_mission_html += '<a tabindex="1" href="' + menu_mission_url + '">' + menu_mission_title + '</a>';
                    menu_mission_html += '</li>';


                });
                menu_mission_html += '</ul>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(menu_mission_html);
        }
    });
}

function ImageOfTheDayBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags= data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['Routes'] = data_routes;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    var image_of_the_day_html = '';
    var image_of_the_day_title = '';
    var image_of_the_day_url = '';
    var image_of_the_day_thumbnail = '';
    var image_of_the_day_auto_thumbnail = '';
    var image_of_the_day_caption = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                image_of_the_day_html += '<ul class="listing">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    image_of_the_day_title = item.node.promotional_title;
                    image_of_the_day_url = item.node.path;
                    image_of_the_day_thumbnail = item.node.image_100x75;
                    image_of_the_day_auto_thumbnail = item.node.image_466x248;
                    image_of_the_day_caption = item.node.field_image_caption;

                    if (!image_of_the_day_thumbnail)
                        image_of_the_day_thumbnail = image_of_the_day_auto_thumbnail;

                    image_of_the_day_caption = image_of_the_day_caption.replace(/"/g, '&quot;');

                    image_of_the_day_html += '<li>';
                    image_of_the_day_html += '<a tabindex="1" href="' + image_of_the_day_url + '">';
                    image_of_the_day_html += '<img align="Bottom" alt="' + image_of_the_day_caption + '" border="0" height="75" src="' + image_of_the_day_thumbnail + '" title="' + image_of_the_day_caption + '" width="100" />';
                    image_of_the_day_html += '<span>';
                    image_of_the_day_html += image_of_the_day_title;
                    image_of_the_day_html += '</span>';
                    image_of_the_day_html += '</a>';
                    image_of_the_day_html += '</li>';


                });
                image_of_the_day_html += '<li>';
                image_of_the_day_html += '<a tabindex="1" href="/multimedia/imagegallery/iotd.html">View Image Gallery</a>';
                image_of_the_day_html += '</li>';
                image_of_the_day_html += '</ul>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(image_of_the_day_html);
        }
    });
}

function InteractiveFeaturesBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_routes = data_attr['dataroutes'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_sticky = data_attr['datasticky'];

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Routes'] = data_routes;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var interactive_features_html = '';
    var interactive_features_title = '';
    var interactive_features_url = '';
    var interactive_features_thumbnail = '';
    var interactive_features_auto_thumbnail = '';
    var interactive_features_caption = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {

                interactive_features_html += '<ul class="listing">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    interactive_features_title = item.node.title;
                    if (item.node.link_urls) {
                        var temp_urls = new Array();
                        temp_urls = item.node.link_urls.split(",");
                        interactive_features_url = temp_urls[0];
                    }
                    interactive_features_thumbnail = item.node.field_thumbnail_image_100x75;
                    interactive_features_auto_thumbnail = item.node.image_100x75;

                    if (!interactive_features_thumbnail)
                        interactive_features_thumbnail = interactive_features_auto_thumbnail;

                    interactive_features_title = interactive_features_title.replace(/"/g, '&quot;');

                    interactive_features_html += '<li>';
                    interactive_features_html += '<a tabindex="1" href="' + interactive_features_url + '">';
                    interactive_features_html += '<img align="Bottom" alt="' + interactive_features_title + '" border="0" height="75" src="' + interactive_features_thumbnail + '" title="' + interactive_features_title + '" width="100" />';
                    interactive_features_html += '<span>';
                    interactive_features_html += interactive_features_title;
                    interactive_features_html += '</span>';
                    interactive_features_html += '</a>';
                    interactive_features_html += '</li>';


                });
                interactive_features_html += '<li>';
                interactive_features_html += '<a tabindex="1" href="/multimedia/mmgallery/index.html">All Interactive Features</a>';
                interactive_features_html += '</li>';
                interactive_features_html += '</ul>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(interactive_features_html);
        }
    });
}

function GetInvolvedBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_routes = data_attr['dataroutes'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Routes'] = data_routes;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var get_involved_html = '';
    var get_involved_title = '';
    var get_involved_url = '';
    var get_involved_thumbnail = '';
    var get_involved_auto_thumbnail = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                get_involved_html += '<ul class="listing">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    get_involved_title = item.node.title;
                    get_involved_url = item.node.link_urls;
                    get_involved_thumbnail = item.node.field_thumbnail_image_100x75;
                    get_involved_auto_thumbnail = item.node.image_100x75;

                    if (!get_involved_thumbnail)
                        get_involved_thumbnail = get_involved_auto_thumbnail;

                    get_involved_title = get_involved_title.replace(/"/g, '&quot;');

                    get_involved_html += '<li>';
                    get_involved_html += '<a tabindex="1" href="' + get_involved_url + '">';
                    get_involved_html += '<img align="Bottom" alt="' + get_involved_title + '" border="0" height="75" src="' + get_involved_thumbnail + '" title="' + get_involved_title + '" width="100" />';
                    get_involved_html += '<span>';
                    get_involved_html += get_involved_title;
                    get_involved_html += '</span>';
                    get_involved_html += '</a>';
                    get_involved_html += '</li>';


                });
                get_involved_html += '<li>';
                get_involved_html += '<a tabindex="1" href="/connect/index.html">View more opportunities for you to get involved</a>';
                get_involved_html += '</li>';
                get_involved_html += '</ul>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(get_involved_html);
        }
    });
}

function FeaturedBlogsBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Routes'] = data_routes;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var featued_blogs_html = '';
    var featued_blogs_title = '';
    var featued_blogs_url = '';
    var featued_blogs_thumbnail = '';
    var featued_blogs_auto_thumbnail = '';

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                featued_blogs_html += '<ul class="listing">';
                jQuery.each(data.nodes, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    featued_blogs_title = item.node.link_titles;
                    featued_blogs_url = item.node.link_urls;
                    featued_blogs_thumbnail = item.node.field_thumbnail_image_100x75;
                    featued_blogs_auto_thumbnail = item.node.image_100x75;

                    if (!featued_blogs_thumbnail)
                        featued_blogs_thumbnail = featued_blogs_auto_thumbnail;

                    featued_blogs_title = featued_blogs_title.replace(/"/g, '&quot;');

                    featued_blogs_html += '<li>';
                    featued_blogs_html += '<a tabindex="1" href="' + featued_blogs_url + '">';
                    featued_blogs_html += '<img align="Bottom" alt="' + featued_blogs_title + '" border="0" height="75" src="' + featued_blogs_thumbnail + '" title="' + featued_blogs_title + '" width="100" />';
                    featued_blogs_html += '<span>';
                    featued_blogs_html += featued_blogs_title;
                    featued_blogs_html += '</span>';
                    featued_blogs_html += '</a>';
                    featued_blogs_html += '</li>';


                });
                featued_blogs_html += '<li>';
                featued_blogs_html += '<a tabindex="1" href="http://blogs.nasa.gov/">All Blogs</a>';
                featued_blogs_html += '</li>';
                featued_blogs_html += '</ul>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(featued_blogs_html);
        }
    });
}

function MenuEventsBlock(data_attr) {

    var data_collections = data_attr['datacollections'];
    var data_routes = data_attr['dataroutes'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Routes'] = data_routes;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('homepageeventsview.jsonp', json_obj);

    var menu_events_html = '';
    var menu_events_url = '';
    var menu_events_title = '';
    var menu_event_time = '';

    var menu_event_timers = new Array();
    var menu_event_timer_classes = new Array();

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                menu_events_html += '<div class="menu-events-holder">';
                menu_events_html += '<div class="menu-events-block" id="menu_event_slider">';
                jQuery.each(data.events, function (i, item) {

                    if ((parseInt(i) + 1) > data_items)
                        return false;

                    menu_events_url = item.eventnode.LinkURL;
                    menu_events_title = item.eventnode.title;
                    menu_event_time = item.eventnode.field_event_date_and_time;
                    menu_event_time_now = item.eventnode.date_time_now;

                    menu_events_title = menu_events_title.replace(/"/g, '&quot;');

                    menu_events_html += '<div class="events">';
                    menu_events_html += '<a tabindex="1" href="' + menu_events_url + '" title="' + menu_events_title + '">';
                    menu_events_html += '<span class="info"><span class="count-down-info menu_count_timer_' + i + '"></span>' + menu_events_title + '</span>';
                    menu_events_html += '</a>';
                    menu_events_html += '</div>';

                    menu_event_timers.push(new Array(menu_event_time,menu_event_time_now));
                    menu_event_timer_classes.push("menu_count_timer_" + i);

                });
                menu_events_html += '</div>';
                menu_events_html += '<div id="menu_event_pager">';
                menu_events_html += '<span id="menu_event_prev"></span>';
                menu_events_html += '<span id="menu_event_next"></span>';
                menu_events_html += '</div>';
                menu_events_html += '</div>';
            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(menu_events_html);

            jQuery('#menu_event_slider').bxSlider({
                pager: false,
                speed: 1000,
                nextSelector: '#menu_event_next',
                prevSelector: '#menu_event_prev'
            });
            jQuery('.block_at_load').removeClass('block_at_load');


            jQuery.each(menu_event_timers, function (j, menu_event_timer_value) {

                if (menu_event_timer_value[0] != '') {
                    var menu_event_timer_class = menu_event_timer_classes[j];
                    var menu_event_timestamp = new Date(menu_event_timer_value[0]);
                    var now = new Date();
                    var menu_event_timestamp_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                    var opts = {};
                    opts[menu_event_timestamp >= Date.now() ? "until" : "since"] = menu_event_timestamp;
                    opts['serverSync'] = function(){ return menu_event_timestamp_now; }
                    jQuery('.' + menu_event_timer_class).countdown(opts);
                }
            });

        }
    });
}

function TopBlindsGalleyBlock(data_attr) {

    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_priority_ids = data_attr['datapriorityids'];

    var ajax_processing_complete = false;
    var json_obj = {};


    if(data_priority_ids) {
        var data_priority_obj = {};
        json_obj['Nodes'] = data_priority_ids;
        var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);
        jQuery.ajax({
            type: 'GET',
            url: json_url,
            
            success: function(priority_data) {
                 data_priority_obj = priority_data;
                 ajax_processing_complete = true;
             }
        });

        window['check_processing_' + tag_id]  = setInterval(function(){
             if (ajax_processing_complete == true) {
                  window.clearInterval( window['check_processing_' + tag_id] );
                  LoadTopBlindsGalleyBlock(data_attr, data_priority_obj );
              };
        }, 1000);

    } else {
         LoadTopBlindsGalleyBlock(data_attr);
    }
}

function LoadTopBlindsGalleyBlock(data_attr, data_priority_obj) {

    var data_collections = data_attr['datacollections'];
    var data_routes = data_attr['dataroutes'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_priority_ids = data_attr['datapriorityids'];

    var priority_ids_arr        = new Array();

    if(data_priority_obj) {
        priority_ids_arr            = data_priority_ids.split(',');
        var priority_object_count   = data_priority_obj.count;
        data_items                  = parseInt(data_items) -  parseInt(priority_object_count) ;
    }

    var json_obj = {};


    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['Routes'] = data_routes;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = data_offset;

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var blinds_html_obj = {};
    var blinks_data_obj = {}

    var top_blinds_html = '';

    var top_blinds_auto_image_100x75 = '';
    var top_blinds_auto_image_360x225 = '';
    var top_blinds_title = '';
    var top_blinds_field_promo_leader_sentence = '';
    var top_blinds_url = '';
    var top_blinds_link_title = '';

    var new_tag_id = tag_id +'_1';

    if(data_priority_obj && typeof (data_priority_obj) == 'object') {
        jQuery.each(data_priority_obj.nodes, function (i, priority_item) {
            top_blinds_auto_image_100x75 = priority_item.node.image_100x75;
            top_blinds_auto_image_360x225 = priority_item.node.image_360x225;
            top_blinds_title = priority_item.node.title;
            top_blinds_field_promo_leader_sentence = priority_item.node.field_promo_leader_sentence;
            top_blinds_url = priority_item.node.link_urls;
            top_blinds_link_title = priority_item.node.link_titles;

            if (jQuery.inArray(priority_item.node.nid, priority_ids_arr) == -1)
                priority_ids_arr.push(priority_item.node.nid);

            top_blinds_html = '';

            top_blinds_html = '<div class="cycle_slider" id="'+ priority_item.node.nid +'">';
                top_blinds_html += '<a tabindex="1" href="' + top_blinds_url + '" class="top_blinds_title">';
                    top_blinds_html += '<h3>' + top_blinds_title + '</h3>';
                top_blinds_html += '</a>';
                top_blinds_html += '<a tabindex="1" href="' + top_blinds_url + '" class="top_blinds_image">';
                    top_blinds_html += '<img src="' + top_blinds_auto_image_360x225 + '" class="CycIMG"/>';
                top_blinds_html += '</a>';
                top_blinds_html += '<div class="CycSlideContent">';
                    top_blinds_html += '<div class="CycDetails">';
                        top_blinds_html += '<div class="Slide1">';
                            top_blinds_html += '<div class="slider_desc">' + top_blinds_field_promo_leader_sentence + '</div>';
                        top_blinds_html += '</div>';
                    top_blinds_html += '</div>';
                top_blinds_html += '</div>';
            top_blinds_html += '</div>';

            blinds_html_obj[priority_item.node.nid] = top_blinds_html;

            if (!jQuery.isPlainObject(blinks_data_obj[priority_item.node.nid]))
             blinks_data_obj[priority_item.node.nid] = {};

            blinks_data_obj[priority_item.node.nid]['title'] = top_blinds_link_title;
            blinks_data_obj[priority_item.node.nid]['image'] = top_blinds_auto_image_100x75;
            blinks_data_obj[priority_item.node.nid]['url']  = top_blinds_url;

        });
    }

    if (data_items > 0) {
        jQuery.ajax({
            type: "GET",
            url: json_url,
            
            success: function (data) {
                if(data && typeof (data) == 'object') {
                     jQuery.each(data.nodes, function (i, priority_item) {
                         top_blinds_auto_image_100x75 = priority_item.node.image_100x75;
                         top_blinds_auto_image_360x225 = priority_item.node.image_360x225;
                         top_blinds_title = priority_item.node.title;
                         top_blinds_field_promo_leader_sentence = priority_item.node.field_promo_leader_sentence;
                         top_blinds_url = priority_item.node.link_urls;
                         top_blinds_link_title = priority_item.node.link_titles;

                         if (jQuery.inArray(priority_item.node.nid, priority_ids_arr) == -1)
                            priority_ids_arr.push(priority_item.node.nid);

                         top_blinds_html = '';

                         top_blinds_html = '<div class="cycle_slider" id="'+ priority_item.node.nid +'">';
                            top_blinds_html += '<a tabindex="1" href="' + top_blinds_url + '" class="top_blinds_title">';
                                top_blinds_html += '<h3>' + top_blinds_title + '</h3>';
                            top_blinds_html += '</a>';
                            top_blinds_html += '<a tabindex="1" href="' + top_blinds_url + '" class="top_blinds_image">';
                                top_blinds_html += '<img src="' + top_blinds_auto_image_360x225 + '" class="CycIMG"/>';
                            top_blinds_html += '</a>';
                            top_blinds_html += '<div class="CycSlideContent">';
                                top_blinds_html += '<div class="CycDetails">';
                                    top_blinds_html += '<div class="Slide1">';
                                        top_blinds_html += '<div class="slider_desc">' + top_blinds_field_promo_leader_sentence + '</div>';
                                    top_blinds_html += '</div>';
                                top_blinds_html += '</div>';
                            top_blinds_html += '</div>';
                         top_blinds_html += '</div>';

                         blinds_html_obj[priority_item.node.nid] = top_blinds_html;

                         if (!jQuery.isPlainObject(blinks_data_obj[priority_item.node.nid]))
                             blinks_data_obj[priority_item.node.nid] = {};

                         blinks_data_obj[priority_item.node.nid]['title'] = top_blinds_link_title;
                         blinks_data_obj[priority_item.node.nid]['image'] = top_blinds_auto_image_100x75;
                         blinks_data_obj[priority_item.node.nid]['url']     = top_blinds_url;

                     });
                }
                createTopBlindshtml(data_attr, blinds_html_obj, blinks_data_obj, priority_ids_arr);
            }
        });
    } else {
        createTopBlindshtml(data_attr, blinds_html_obj, blinks_data_obj, priority_ids_arr);
    }
}

function createTopBlindshtml(data_attr, blinds_html_obj, blinks_data_obj, priority_ids_arr) {

    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var blinds_block_html = '';
    var top_blinds_title_array = new Array();
    var top_blinds_images_array = new Array();
    var top_blinds_urls_array = new Array();
    var thumb_label_maxlength = 19;

    blinds_block_html += '<div class="slider-wrap">';
        blinds_block_html += '<div class="CycleWrapper">';
            blinds_block_html += '<div id="Cycle_'+ tag_id +'" class="pics Cycle"> ';
                jQuery.each(priority_ids_arr, function (i, priority_data_id) {
                    if (typeof blinks_data_obj[priority_data_id] != 'undefined') {
                        blinds_block_html += blinds_html_obj[priority_data_id];
                        top_blinds_title_array.push(blinks_data_obj[priority_data_id]['title']);
                        top_blinds_images_array.push(blinks_data_obj[priority_data_id]['image']);
                        top_blinds_urls_array.push(blinks_data_obj[priority_data_id]['url']);
                    }
                });
            blinds_block_html += '</div>';
        blinds_block_html += '</div>';
    blinds_block_html += '</div>';

    jQuery(current_tag).empty();
    jQuery(current_tag).html(blinds_block_html);

    jQuery('#Cycle_'+ tag_id).after('<ul class="CycNav" id="CycNav_'+ tag_id+'">').cycle({
        fx: 'fade',
        speed: '400',
        timeout: 0,
        pager: '#CycNav_'+ tag_id,
        pause: 1,
        pauseOnPagerHover: true,
        startingSlide: 0, // zero-based ,
        slideExpr: 'div.cycle_slider',
        pagerAnchorBuilder: function (id, slide) {

             var thumb_label = '';
             var new_src = '';
             var new_link_url = '';
             thumb_label = top_blinds_title_array[id];
             new_src = top_blinds_images_array[id];
             new_link_url = top_blinds_urls_array[id];

             if ( thumb_label.length >  thumb_label_maxlength) {
                thumb_label = thumb_label.substr(0, thumb_label_maxlength);
                thumb_label = thumb_label + '...';
             }

             // Set this as the source for our image
             return '<li><a tabindex="1" href="#"><img src="' + new_src + '" width="100" height="75" /></a><span class="img-label"><a tabindex="1" class="thumb_link" href="' + new_link_url + '">' + thumb_label + '</a></span></li>';
         }
     });

     jQuery('#CycNav_'+ tag_id).after('<div class="nasa-home-thumb"><a tabindex="1" href="http://www.nasa.gov/home/archive/topstories_archive_collection_archive_1.html"></a><span class="img-label"><a tabindex="1" href="http://www.nasa.gov/home/archive/topstories_archive_collection_archive_1.html">&rsaquo; More Stories</a></span></div>');

}

function MediaCastBlock(data_attr,reload_content_only) {

    var data_collections = data_attr['datacollections'];
    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var data_pagination = data_attr['datapagination'];
    var data_show_podcast = data_attr['datashowpodcast'];
    var data_show_vodcast = data_attr['datashowvodcast'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var data_sticky = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};
    
    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url = create_jsonp_url('mediacastjsonp.jsonp', json_obj);

    var mediacast_html = '';
    var mediacast_content_html = '';
    var mediacast_url_title = '';
    var mediacast_title = '';
    var mediacast_auto_image_100x75 = '';
    var mediacast_field_mc_mediacast_url = '';
    var mediacast_field_mc_mediacast_rss_url = '';
    var mediacast_field_itunes_link = '';

    var pagination_click = false;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    mediacast_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                }
                mediacast_html += '<div class="podcast-wrap">';
                jQuery.each(data.nodes, function (i, item) {

                    mediacast_url_title = item.node.path;
                    mediacast_title = item.node.title;
                    mediacast_auto_image_100x75 = item.node.image_100x75;
                    mediacast_field_mc_mediacast_url = item.node.podcast;
                    mediacast_field_mc_mediacast_rss_url = item.node.podcast_rss_url;
                    mediacast_field_itunes_link = item.node.podcast_itunes_url;

                    mediacast_title = mediacast_title.replace(/"/g, '&quot;');


                    mediacast_content_html += '<div class="pod-cast">';
                    mediacast_content_html += '<a tabindex="1" href="' + mediacast_url_title + '">'
                    mediacast_content_html += '<img align="Bottom" alt="' + mediacast_title + '" border="0" height="75" src="' + mediacast_auto_image_100x75 + '" title="' + mediacast_title + '" width="100">'
                    mediacast_content_html += '</a>';
                    mediacast_content_html += '<a tabindex="1" href="' + mediacast_url_title + '">' + mediacast_title + '</a>';
                    if(data_show_vodcast=="1"){
                        mediacast_content_html += '<div class="vodcast-links">';
                        mediacast_content_html += '<div>Video: </div>';
                        mediacast_content_html += '<div class="mediacast_rss_link">';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.vodcast_rss_url + '"" target="_blank">Subscribe</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '<div class="mediacast_itunes_link">';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.vodcast_itunes_url + '" target="_blank">iTunes</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '<div>';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.vodcast + '" target="_blank">› Watch Now</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '<br>';
                    }
                    if(data_show_podcast=="1"){
                        mediacast_content_html += '<div class="podcast-links">';
                        mediacast_content_html += '<div>Audio: </div>';
                        mediacast_content_html += '<div class="mediacast_rss_link">';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.podcast_rss_url + '"" target="_blank">Subscribe</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '<div class="mediacast_itunes_link">';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.podcast_itunes_url + '" target="_blank">iTunes</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '<div>';
                        mediacast_content_html += '<a tabindex="1" href="' + item.node.podcast + '" target="_blank">› Listen Now</a>';
                        mediacast_content_html += '</div>';
                        mediacast_content_html += '</div>';
                    }
                    mediacast_content_html += '</div>';

                });
                mediacast_html += mediacast_content_html;
                mediacast_html += '</div>';
                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    mediacast_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }
                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    mediacast_html += '<div class="podcast-more">';
                    mediacast_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    mediacast_html += '</div>';
                }

            }
            if (reload_content_only == true) {
                 jQuery('.podcast-wrap', current_tag).empty();
                 jQuery('.podcast-wrap', current_tag).html(mediacast_content_html);
            } else {
                jQuery(current_tag).empty();
                jQuery(current_tag).html(mediacast_html);
                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    jQuery('.pagination-box', current_tag).pagination({
                        items: data.count,
                        itemsOnPage: data_items,
                        onPageClick : function (pageNumber, event) {
                            if (pagination_click == true)
                                return true;
                            var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                            data_attr['paginationoffset'] = pagination_offset;
                            MediaCastBlock(data_attr, true);
                            pagination_click = true;
                            jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                            pagination_click = false;
                        }
                    });

                    jQuery('.footer-pagination-box', current_tag).pagination({
                        items: data.count,
                        itemsOnPage: data_items,
                        onPageClick : function (pageNumber, event) {
                            if (pagination_click == true)
                                return true;
                            var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                            data_attr['paginationoffset'] = pagination_offset;
                            MediaCastBlock(data_attr, true);
                            pagination_click = true;
                            jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                            pagination_click = false;
                        }
                    });
                }
            }

        }
    });

}

function NasaImageOfTheDayBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags   = data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];

    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['Routes'] = data_routes;

    var json_url = create_jsonp_url('image_gallery.jsonp', json_obj);

    var nasa_image_of_the_day_html = '';
    var nasa_image_of_the_day_title = '';
    var nasa_image_of_the_day_caption = '';
    var nasa_image_of_the_day_promo = '';
    var nasa_image_of_the_day_image = '';
    var nasa_image_of_the_day_maxlength = 100;

    jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {
            if (data && typeof (data) == 'object') {
                nasa_image_of_the_day_html += '<div class="images-wrap">';
                nasa_image_of_the_day_html += '<div id="' + tag_id + '_tabs" class="image_day_tabs">';
                nasa_image_of_the_day_html += '<ul>';
                nasa_image_of_the_day_html += '<li>';
                nasa_image_of_the_day_html += '<a tabindex="1" href="#' + tag_id + '_imageofday">Image of the day</a>';
                nasa_image_of_the_day_html += '</li>';
                nasa_image_of_the_day_html += '<li>';
                nasa_image_of_the_day_html += '<a tabindex="1" href="#' + tag_id + '_nasaimages">nasaimages.org</a>';
                nasa_image_of_the_day_html += '</li>';
                nasa_image_of_the_day_html += '</ul>';
                jQuery.each(data.nodes, function (i, item) {

                    if (i > 0)
                        return false;

                    nasa_image_of_the_day_title = item.node.title;
                    nasa_image_of_the_day_caption = item.node.image_caption;
                    nasa_image_of_the_day_promo = item.node.promotional_leader_sentence;
                    if (nasa_image_of_the_day_promo) {
                        nasa_image_of_the_day_caption = nasa_image_of_the_day_promo;
                    }
                    nasa_image_of_the_day_image = item.node.image_346x260;

                    nasa_image_of_the_day_title = nasa_image_of_the_day_title.replace(/"/g, '&quot;');

                    if (nasa_image_of_the_day_caption.length > nasa_image_of_the_day_maxlength) {
                        nasa_image_of_the_day_caption = nasa_image_of_the_day_caption.substr(0, nasa_image_of_the_day_maxlength);
                        nasa_image_of_the_day_caption = nasa_image_of_the_day_caption.substr(0, Math.min(nasa_image_of_the_day_caption.length, nasa_image_of_the_day_caption.lastIndexOf(" ")));
                        nasa_image_of_the_day_caption = nasa_image_of_the_day_caption + ' ...';
                    }

                    nasa_image_of_the_day_html += '<div id="' + tag_id + '_imageofday" >';
                    nasa_image_of_the_day_html += '<div class="obj-image">';
                    nasa_image_of_the_day_html += '<a tabindex="1" href="' + item.node.path + '">';
                    nasa_image_of_the_day_html += '<img alt="' + nasa_image_of_the_day_title + '" src="' + nasa_image_of_the_day_image + '" width="346" height="260"/>';
                    nasa_image_of_the_day_html += '</a>';
                    nasa_image_of_the_day_html += '</div>';
                    nasa_image_of_the_day_html += '<div class="desc">';
                    nasa_image_of_the_day_html += '<h3>' + nasa_image_of_the_day_title + '</h3>';
                    nasa_image_of_the_day_html += '<p>' + nasa_image_of_the_day_caption + '</p>';
                    nasa_image_of_the_day_html += '<p class="short-link">';
                    nasa_image_of_the_day_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/imagegallery/iotd.html">&rsaquo; View Image Gallery</a>';
                    nasa_image_of_the_day_html += '</p>';
                    nasa_image_of_the_day_html += '</div>';
                    nasa_image_of_the_day_html += '</div>';

                });
                nasa_image_of_the_day_html += '<div id="' + tag_id + '_nasaimages">';
                nasa_image_of_the_day_html += '<div class="obj-image">';
                nasa_image_of_the_day_html += '<a tabindex="1" href="http://www.nasaimages.org">';
                nasa_image_of_the_day_html += '<img alt="" src="sites/all/themes/custom/NASAOmegaHTML5/images/709350main_NASAimageslogo346.jpg" />';
                nasa_image_of_the_day_html += '</a>';
                nasa_image_of_the_day_html += '</div>';
                nasa_image_of_the_day_html += '<div class="desc">';
                nasa_image_of_the_day_html += '<p>The most comprehensive compilation of NASA stills, film and video.</p>';
                nasa_image_of_the_day_html += '<p class="short-link">';
                nasa_image_of_the_day_html += '<a tabindex="1" href="http://www.nasaimages.org">&rsaquo; Start your search</a>';
                nasa_image_of_the_day_html += '</p>';
                nasa_image_of_the_day_html += '</div>';
                nasa_image_of_the_day_html += '</div>';
                nasa_image_of_the_day_html += '</div>';
                nasa_image_of_the_day_html += '</div>';

            }

            jQuery(current_tag).empty();
            jQuery(current_tag).html(nasa_image_of_the_day_html);

            jQuery('#' + tag_id + '_tabs').tabs();

        }
    });
}

function MediaCastLinks(data_attr){
  var data_podcast  = jQuery('#mediacast_links').attr("data-podcast");
  var data_podcast_url = jQuery('#mediacast_links').attr("data-podcast-url");

  var browser_is_ie = false;
    if (navigator.appVersion.indexOf("MSIE") != -1)
    {
        var browser_is_ie = true;
    }

  var mediacast_hostname = 'http://'
    mediacast_hostname += location.hostname;
    if (browser_is_ie)
    {
        mediacast_hostname += '/'
    }

  if (data_podcast != ""){
    data_podcast_url = getUrlParts(data_podcast_url);
    jQuery('<p><div><a tabindex="1" href="' + mediacast_hostname + data_podcast_url.pathname + '">› Listen Now</a></div></p>').appendTo('#mediacast_links');
  }

  var data_vodcast  = jQuery('#mediacast_links').attr("data-vodcast");
  var data_vodcast_url = jQuery('#mediacast_links').attr("data-vodcast-url");

  if (data_vodcast != ""){
    data_vodcast_url = getUrlParts(data_vodcast_url);
    jQuery('<p><div><a tabindex="1" href="' + mediacast_hostname + data_vodcast_url.pathname + '">› View Now</a></div></p>').appendTo('#mediacast_links');
  }
}

function MediaCastLinks_2(data_attr){
  var data_podcast     = jQuery('#mediacast_links_2').attr("data-podcast");
  var data_podcast_url = jQuery('#mediacast_links_2').attr("data-podcast-url");

  var browser_is_ie = false;
    if (navigator.appVersion.indexOf("MSIE") != -1)
    {
        var browser_is_ie = true;
    }

  var mediacast_hostname = 'http://'
    mediacast_hostname += location.hostname;
    if (browser_is_ie)
    {
        mediacast_hostname += '/'
    }

  if (data_podcast != ""){
    data_podcast_url = getUrlParts(data_podcast_url);
    jQuery('<p><div><a tabindex="1" href="' + mediacast_hostname + data_podcast_url.pathname + '">› Listen Now</a></div></p>').appendTo('#mediacast_links');
  }

  var data_vodcast     = jQuery('#mediacast_links_2').attr("data-vodcast");
  var data_vodcast_url = jQuery('#mediacast_links_2').attr("data-vodcast-url");

  if (data_vodcast != ""){
    data_vodcast_url = getUrlParts(data_vodcast_url);
    jQuery('<p><div><a tabindex="1" href="' + mediacast_hostname + data_vodcast_url.pathname + '">› View Now</a></div></p>').appendTo('#mediacast_links');
  }
}

function linkTo(inURL){
  window.open(inURL);
}

function getUrlParts(url) {
    var a = document.createElement('a');
    a.href = url;

    return {
        href: a.href,
        host: a.host,
        hostname: a.hostname,
        port: a.port,
        pathname: a.pathname,
        protocol: a.protocol,
        hash: a.hash,
        search: a.search
    };
}

function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

function NASAVideoGalleryThumbnails(data_attr){
  var gallery_string = hereDoc(function() {/*!
  <div ng-app='video_gallery'>
    <div id='PaginationDemoCtrl' ng-controller='PaginationDemoCtrl'>
      <pagination on-select-page='doSearch(page)'  num-pages='noOfPages' current-page='currentPage' max-size='maxSize'></pagination>
      <div class='video_search_container'>
        <input id='video_search' type='text' ng-model='searchTerm'/>
        <input class='searchbtn' title='searchbutton' type='submit' value='Search' ng-click='openNewSearch(searchTerm);' youtube-search='youtubeSearch'>
      </div>
      <div id='video_gallery' ng-show='videos.length > 0'>
        <ul id='browsebox'>
          <li  ng-repeat='video in videos'>
            <a tabindex="1" class='loadable' href='{{video.video.player.default}}' onclick='return false;'  ng-click='load_video(video.video);'><img src='{{video.video.thumbnail.sqDefault}}'><span>{{video.video.title|truncate}}</span></a>
          </li>
        </ul>
      </div>
      <div  ng-show='!videos'>
        There are no results for this search.
      </div>
    </div>
  </div>
  */});
  var app = angular.module('video_gallery', ['ngResource', 'ui.bootstrap', 'filters']);
  angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 60;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });
  app.factory("Comments", function($resource){
    return $resource('http://gdata.youtube.com/feeds/api/videos/:id/comments',
    {
      action:'search.json',
      callback:'JSON_CALLBACK',
      v: 2,
      alt: "json",
    },
    {
        get:{method:'JSONP'}
    }
    );
  });

  app.factory("Nasa", function($resource){
    return $resource('http://gdata.youtube.com/feeds/api/playlists/' + data_attr['dataplaylist'],
      {
          action:'search.json',
          callback:'JSON_CALLBACK',
          v: 2,
          alt: "jsonc",
      },
      {
          get:{method:'JSONP'}
      }
    );
  })

  app.controller('PaginationDemoCtrl', function ($scope, $resource, $http, Comments, Nasa) {
    $scope.noOfPages    = 0;
    $scope.currentPage  = 1;
    $scope.maxSize      = 7;
    $scope.items_per_page = 9; //Nasa gallery code
    $scope.$watch('youtubeSearch', function(){
      $scope.currentPage = 1;
      //or any other code here
    });

    //stores the whole list of actual (the "results" field of the JSON response) videos
    $scope.videos = [];
    //stores only the last "result_per_page" videos with all the info (original JSON response)
    $scope.lastVideosWithInfo = null;
    //change this if you want more than 5 videos per time
    $scope.resultsPerPage = 9;
    //start from 1, not 0
    $scope.page = 1;
    //used to avoid duplicated videos see https://dev.twitter.com/docs/working-with-timelines
    $scope.max_id = null;

    $scope.load_video = function(video){
      $scope.comments = Comments.get({"id": video.id}, function(data){ });
      jQuery('#video_gallery_main_video').empty();
      //jQuery('<object width="470" height="300"><param name="movie" value="http://www.youtube.com/v/x-GYo0BbJiI?version=3&rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowScriptAccess" value="always"></param><embed src="https://www.youtube.com/v/'+ video.id + '?version=3" type="application/x-shockwave-flash" allowfullscreen="true" allowScriptAccess="always" width="470" height="300"></embed></object>').appendTo('#video_gallery_main_video');
      jQuery('<iframe src="http://www.youtube.com/embed/'+ video.id + '?enablejsapi=1&rel=0" width="470" height="300" frameborder="0" allowfullscreen=""></iframe>').appendTo('#video_gallery_main_video');
      jQuery('<div class="details"><h3><b>'+video.title+'</b></h3><div class="expandable_view"><p>'+video.description+'</p></div></div>').appendTo('#video_gallery_main_video');
      //attach_expansion();
      return false;
    }

    $scope.openNewSearch = function(term){
      window.open("http://www.youtube.com/user/NASAgovVideo/search?query=" + term);
    }

    $scope.doSearch = function (page) {
      $scope.currentPage = page || 1;
      current_page = $scope.currentPage;
      start_index = (($scope.currentPage - 1) * $scope.resultsPerPage) + 1;
      //$scope.lastVideosWithInfo = $scope.nasa.get({"max-results": $scope.resultsPerPage, "start-index": start_index, "q": $scope.searchTerm}, function(){
      $scope.lastVideosWithInfo = Nasa.get({"max-results": $scope.resultsPerPage, "start-index": start_index}, function(){
        $scope.currentPage = current_page;
          //reinit the video list when a new search is done
        $scope.videos = [];
        updateVideosAndParams();
      });
    };

    function updateVideosAndParams(){
        $scope.videos = $scope.lastVideosWithInfo.data['items'];
        $scope.noOfPages =  Math.ceil($scope.lastVideosWithInfo.data['totalItems']/$scope.items_per_page);
        $scope.max_id = $scope.lastVideosWithInfo.max_id;
    }
    //do the search  for the first time
    $scope.doSearch();
  });
  jQuery('#video_gallery_thumbnails').html(gallery_string);
}

function NASAVideoGalleryMainVideo(data_attr){
  var item = new Object();
  if (jQuery.browser.msie && window.XDomainRequest) {
    // Use Microsoft XDR
    setTimeout(function(){
      var xdr = new XDomainRequest();
      var url = 'http://gdata.youtube.com/feeds/api/playlists/' + data_attr['dataplaylist'] + '?v=2&alt=jsonc';
      xdr.onload = function() {
        data = jQuery.parseJSON(xdr.responseText)
        item = data.data.items[0];
        jQuery('<iframe id="ytplayer" type="text/html" width="470" height="300" src="http://www.youtube.com/embed/'+item.video.id+'?rel=0" frameborder="0" allowfullscreen>').appendTo('#video_gallery_main_video');
        jQuery('<div class="details"><h3><b>'+item.video.title+'</b></h3><div class="expandable_view"><p>'+item.video.description+'</p></div></div>').appendTo('#video_gallery_main_video');
      };
      xdr.open("get", url);
      xdr.send();
    },100)
  } else {
    jQuery.getJSON('http://gdata.youtube.com/feeds/api/playlists/' + data_attr['dataplaylist'] + '?v=2&alt=jsonc', function(data) {
      item=data.data.items[0];
      jQuery('<iframe id="ytplayer" type="text/html" width="470" height="300" src="http://www.youtube.com/embed/'+item.video.id+'?rel=0" frameborder="0" allowfullscreen>').appendTo('#video_gallery_main_video');
      jQuery('<div class="details"><h3><b>'+item.video.title+'</b></h3><div class="expandable_view"><p>'+item.video.description+'</p></div></div>').appendTo('#video_gallery_main_video');
      //jQuery('<div class="comments"><h3>Comments ('+item.video.commentCount+')</h3></div>').appendTo('#video_gallery_main_video');
    });
  }
}

function NasaCountDownClock(data_attr) {
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_date = data_attr['datadate'];
    var data_date_now = data_attr['datadatenow'];
    var data_description = data_attr['datadescription'];
    var data_description_link = data_attr['datadescriptionlink'];

    var json_obj = {};

    var countdown_clock_html = '';

    countdown_clock_html += '<div class="count-down-timer-container">';
    countdown_clock_html += '<span id="' + tag_id + '_countdown" class="count-down-timer"></span>';

    countdown_clock_html += '<div class="countdown-description-container">';
    if (data_description_link != '') {
        countdown_clock_html += '<a tabindex="1" href="' + data_description_link + '">';
    }

    countdown_clock_html += '<span class="countdown-description">';
    countdown_clock_html += data_description;
    countdown_clock_html += '</span>';

    if (data_description_link != '') {
        countdown_clock_html += '</a>';
    }
    countdown_clock_html += '</div>';

    countdown_clock_html += '</div>';

    jQuery(current_tag).empty();
    jQuery(current_tag).html(countdown_clock_html);

        var countdown_timestamp = new Date(data_date);
    var now = new Date();
    var countdown_timestamp_now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var opts = {};
    opts[countdown_timestamp >= Date.now() ? "until" : "since"] = countdown_timestamp;
    opts['onExpiry'] = function() {NasaCountDownClock(data_attr)};
    opts['serverSync'] = function() {return countdown_timestamp_now};
    jQuery('#' + tag_id + '_countdown').countdown(opts);


}

function imageAddThisBlock(data_attr) {
    var image_url = data_attr['dataurl'];
    var current_tag = data_attr['currenttag'];

    var json_obj = {};

    var image_add_block_html = '';

image_add_block_html +='<!-- AddThis Button BEGIN -->';
if(image_url!=""){
    image_add_block_html +='<div class="back-gal">'
    image_add_block_html +='<a tabindex="1" href="'
    image_add_block_html += image_url;
    image_add_block_html +='"><span></span>Back to Gallery</a>';
    image_add_block_html +='</div>'
}
image_add_block_html +='<div class="addthis_toolbox addthis_default_style addthis_32x32_style join-txt move-right ">';
image_add_block_html +='<span>Text Size</span>';
image_add_block_html +='<a tabindex="1" class="increaseFont" data-role="button"></a> ';
image_add_block_html +='<a tabindex="1" class="decreaseFont" data-role="button"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_facebook"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_twitter"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_google_plusone_share"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_pinterest_share"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_email"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_print"></a>';
image_add_block_html +='<a tabindex="1" class="addthis_button_compact"></a>';
//image_add_block_html +='<a tabindex="1" class="addthis_counter addthis_bubble_style"></a>';
image_add_block_html +='</div>';
image_add_block_html +='<script type="text/javascript">';
image_add_block_html +='var addthis_config = addthis_config||{};';
image_add_block_html +="addthis_config.services_exclude = 'facebook';";
image_add_block_html +='</script>';
image_add_block_html +='<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=addthisforshare"></script>';
image_add_block_html +='<!-- AddThis Button END -->';

    jQuery(current_tag).empty();
    jQuery(current_tag).html(image_add_block_html);


}
function ImageDownloadLinks(data_attr) {
    // var image_url = data_attr['dataurl'];
    var current_tag = data_attr['currenttag'];


    var imgurl = data_attr['imgurl'];
    var imgurl1920 = data_attr['imgurl1920'];
    var imgurl1600 = data_attr['imgurl1600'];
    var imgurl1366 = data_attr['imgurl1366'];
    var imgurl1024 = data_attr['imgurl1024'];
    var imgurl800 = data_attr['imgurl800'];
    imgurl = getUrlParts(imgurl);
    imgurl1920 = getUrlParts(imgurl1920);
    imgurl1600 = getUrlParts(imgurl1600);
    imgurl1366 = getUrlParts(imgurl1366);
    imgurl1024 = getUrlParts(imgurl1024);
    imgurl800 = getUrlParts(imgurl800);

    // var json_obj = {};

    var image_download_links_html = '<p><b>Download Links</b></p>';
    var browser_is_ie = false;
    if (navigator.appVersion.indexOf("MSIE") != -1)
    {
        var browser_is_ie = true;
    }

    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl.pathname;
    image_download_links_html += imgurl.search;
    image_download_links_html += '">› Full size</a></p>';
    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl1920.pathname;
    image_download_links_html += imgurl1920.search;
    image_download_links_html += '">› 1920x1080</a></p>';
    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl1600.pathname;
    image_download_links_html += imgurl1600.search;
    image_download_links_html += '">› 1600x1200</a></p>';
    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl1366.pathname;
    image_download_links_html += imgurl1366.search;
    image_download_links_html += '">› 1366x768</a></p>';
    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl1024.pathname;
    image_download_links_html += imgurl1024.search;
    image_download_links_html += '">› 1024x768</a></p>';
    image_download_links_html += '<p><a tabindex="1" href="http://'
    image_download_links_html += location.hostname;
    if (browser_is_ie)
    {
        image_download_links_html += '/'
    }
    image_download_links_html += imgurl800.pathname;
    image_download_links_html += imgurl800.search;
    image_download_links_html += '">› 800x600</a></p>';

    jQuery(current_tag).empty();
    jQuery(current_tag).html(image_download_links_html);


}

function CollectionListing(data_attr,reload_content_only) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var data_show_attachments = data_attr['datashowattachments'];
    var data_show_links = data_attr['datashowlinks'];
    var data_show_date = data_attr['datashowdate'];
    var data_full_image = data_attr['datafullimage'];
    var data_routes = data_attr['dataroutes'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_pagination = data_attr['datapagination'];
    var data_sticky = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Routes'] = data_routes;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);

    var json_url = create_jsonp_url('collectionassetjsonp.jsonp', json_obj);

    var collection_listing_html = '';
    var collection_content_listing_html = '';
    var collection_listing_title = '';
    var collection_listing_title_html = '';
    var collection_listing_promo_date = '';
    var collection_listing_promo_sentence = '';
    var collection_listing_promo_sentence_html = '';
    var collection_listing_image = '';
    var collection_listing_image_html = '';
    var collection_listing_url = '';

    var collection_listing_promo_sentence_maxlength = data_attr['datamaxlength'];

    var pagination_click = false;

    if (window[tag_id + '_ajax_call'])
        window[tag_id + '_ajax_call'].abort();

    //alert(data_full_image);
    window[tag_id + '_ajax_call'] = jQuery.ajax({
        type: "GET",
        url: json_url,
        
        success: function (data) {

            if (data && typeof (data) == 'object') {
                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        collection_listing_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                    }


                collection_listing_html += '<div class="spacestn-features">';
                collection_listing_html += '<div class="feature-list">';
                collection_listing_html += '<div class="browseArchive">';
                collection_listing_html += '<ul class="no-list-style">';

                jQuery.each(data.nodes, function (i, node_data) {


                    var links_titles = node_data.node.link_titles;
                    var links_titles_arr = links_titles.split(',');
                    var links = node_data.node.links;
                    var link_length = links_titles_arr.length;
                    var bottom_links = '';
                    var hyphen = '';

                    var attachments_titles      = node_data.node.attachment_titles;
                    var attachments_urls        = node_data.node.attachment_urls;

                    var attachments_titles_arr  = attachments_titles.split(',');
                    var attachments_urls_arr    = attachments_urls.split(',');
                    var attachments_length      = attachments_titles_arr.length;
                    var attachment_links        = '';


                    if(link_length > 0 && data_show_links == 1) {
                        for(var j=0; j < link_length; j++) {
                            bottom_links += '<a tabindex="1" href ="' + links[j] + '">' + links_titles_arr[j] + '</a>';
                        }
                    }

                    if(attachments_length > 0  && data_show_attachments == 1) {
                        for(var j=0; j < attachments_length; j++) {
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace('://',':**');
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace('//','/');
                            attachments_urls_arr[j]=attachments_urls_arr[j].replace(':**','://');
                            attachment_links += '<a tabindex="1" href ="' + attachments_urls_arr[j] + '">' + attachments_titles_arr[j] + '</a>';
                        }
                    }

                    collection_listing_title = node_data.node.title;
                    collection_listing_promo_date = node_data.node.promotional_date;
                    collection_listing_promo_sentence = node_data.node.promotional_leader_sentence;
                    collection_listing_image = (data_full_image == '1' ? node_data.node.image_466x248 : node_data.node.image_100x75);
                   // collection_listing_url = node_data.node.link_urls;

                    collection_listing_url='';

                    if( link_length > 0) {
                        collection_listing_url = String(links[0]);
                        if (collection_listing_url == 'undefined')
                            {
                                collection_listing_url='';
                            }
                    }

                    var div = document.createElement("div");
                    div.innerHTML = node_data.node.promotional_leader_sentence;
                    var collection_listing_promo_sentence = div.textContent || div.innerText || "";

                    if (collection_listing_promo_sentence.length > collection_listing_promo_sentence_maxlength) {
                        collection_listing_promo_sentence = collection_listing_promo_sentence.substr(0, collection_listing_promo_sentence_maxlength);
                        collection_listing_promo_sentence = collection_listing_promo_sentence + ' ...';
                    }

                    if(collection_listing_promo_sentence.length)
                        hyphen = '-';

                    if (data_show_date == 0)
                    {
                        collection_listing_promo_date = '';
                        hyphen = '';
                    }


                    if (collection_listing_image) {
                        if (collection_listing_url.length > 0) {
                            collection_listing_image_html = '<a tabindex="1" href="' + collection_listing_url + '" class="small_legacy_wrap">';
                        } else {
                            collection_listing_image_html = '<div class="small_legacy_wrap">';
                        }
                        collection_listing_image_html += '<img height="' + (data_full_image == '1' ?248:75) + '" border="0" align="Bottom" width="' + (data_full_image == '1' ?466:100) + '" src="' + collection_listing_image + '" class="collection_image">';
                        if (collection_listing_url.length > 0) {
                            collection_listing_image_html += '</a>';
                        } else {
                            collection_listing_image_html += '</div>';
                        }
                    } else {
                        collection_listing_image_html = '';
                    }


                    collection_listing_title_html = '<h3 class="collection_title">';

                    if (collection_listing_url.length > 0) {

                        collection_listing_title_html += '<a tabindex="1" href="' + collection_listing_url + '">';
                        if(data_full_image == '1'){
                            collection_listing_title_html += collection_listing_promo_date + ' ' + hyphen + ' '
                            collection_listing_promo_date = '';
                            hyphen = '';
                        }
                        collection_listing_title_html += collection_listing_title;
                        collection_listing_title_html += '</a>';
                    } else {

                        collection_listing_title_html += '<b>' + collection_listing_title+ '</b>';
                    }
                    collection_listing_title_html += '</h3>';


                    collection_listing_promo_sentence_html = '<p>' + collection_listing_promo_date + ' ' + hyphen + ' ' + collection_listing_promo_sentence + '</p>';
                    if (bottom_links.length > 0) {
                        collection_listing_promo_sentence_html += '<p>' + bottom_links + '</p>';
                    }
                    if (attachment_links.length > 0) {
                        collection_listing_promo_sentence_html += '<p>' + attachment_links + '</p>';
                    }


                    if(data_full_image == '1'){
                        collection_content_listing_html += '<li>' + collection_listing_title_html + collection_listing_image_html + collection_listing_promo_sentence_html + '</li>';
                    }else{
                        collection_content_listing_html += '<li>' + collection_listing_image_html + collection_listing_title_html + collection_listing_promo_sentence_html + '</li>';
                    }

                });

               

                collection_listing_html += collection_content_listing_html;
                collection_listing_html += '</ul>';
                collection_listing_html += '</div>';


                if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                    collection_listing_html += '<div class="space-station-more">';
                    collection_listing_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                    collection_listing_html += '</div>';
                }

                collection_listing_html += '</div>';

                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    collection_listing_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(collection_content_listing_html);
                }  else {
                jQuery(current_tag).empty();
                jQuery(current_tag).html(collection_listing_html);

                        if( ( data_pagination=='1') && ( data.count > data_items) ) {
                            jQuery('.pagination-box', current_tag).pagination({
                                items: data.count,
                                itemsOnPage: data_items,
                                onPageClick : function (pageNumber, event) {
                                    if (pagination_click == true)
                                        return true;
                                    var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                    data_attr['paginationoffset'] = pagination_offset;
                                    CollectionListing(data_attr, true);
                                    pagination_click = true;
                                    jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                    pagination_click = false;
            }
                            });

                            jQuery('.footer-pagination-box', current_tag).pagination({
                                items: data.count,
                                itemsOnPage: data_items,
                                onPageClick : function (pageNumber, event) {
                                    if (pagination_click == true)
                                        return true;
                                    var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                    data_attr['paginationoffset'] = pagination_offset;
                                    CollectionListing(data_attr, true);
                                    pagination_click = true;
                                    jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                    pagination_click = false;
                                }
                            });
                        }

                }

            }
        }
    });
}

function ImageListing (data_attr, reload_content_only) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags   = data_attr['dataother_tags'];
    var data_items = data_attr['dataitems'];
    var data_offset = data_attr['dataoffset'];
    var data_morelink_url = data_attr['datamorelinkurl'];
    var data_morelink_text = data_attr['datamorelinktext'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var data_pagination = data_attr['datapagination'];
    var data_routes = data_attr['dataroutes'];
    var pagination_offset = (data_attr['paginationoffset'] ? data_attr['paginationoffset'] : 0);
    var data_sticky = data_attr['datasticky'];
    var pagination_uniqueId = tag_id+'_'+jQuery('.node-panel').attr('id');
    var pagination_cookie = readCookie('pagination_'+pagination_uniqueId);
    if(pagination_cookie != null){
        pagination_offset = Number(pagination_cookie) * data_items;
    }

    var json_obj = {};

    json_obj['sticky'] = data_sticky;
    json_obj['Topics'] = data_topics;
    json_obj['Missions'] = data_missions;
    json_obj['Collections'] = data_collections;
    json_obj['other_tags'] = data_other_tags;
    json_obj['limit'] = data_items;
    json_obj['offset'] = Number(data_offset) + Number(pagination_offset);
    json_obj['Routes'] = data_routes;

    var image_listing_html = '';
    var image_content_listing_html      = '';
    var image_listing_title = '';
    var image_listing_promo_date = '';
    var image_listing_promo_sentence = '';
    var image_listing_image = '';
    var image_listing_url = '';
    var image_listing_promo_sentence_maxlength = data_attr['datamaxlength'];

    var json_url        = create_jsonp_url ('image_gallery.jsonp', json_obj);

    var pagination_click = false;

    if (window[tag_id + '_ajax_call'])
        window[tag_id + '_ajax_call'].abort();

    window[tag_id + '_ajax_call'] = jQuery.ajax({
            type: "GET",
            url: json_url,
            
            success: function (data) {
            if (data && typeof (data) == 'object') {
                if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    image_listing_html += '<div class="pagination-container"><div class="pagination-box"></div></div>';
                    }

            image_listing_html += '<div class="spacestn-features">';
            image_listing_html += '<div class="feature-list">';
            image_listing_html += '<div class="browseArchive">';
            image_listing_html += '<ul class="no-list-style">';

            jQuery.each(data.nodes, function (i, node_data) {

                image_listing_title = node_data.node.promotional_title;
                image_listing_promo_date = node_data.node.promotional_date;
                image_listing_promo_sentence = node_data.node.promotional_leader_sentence;
                image_listing_image = node_data.node.image_100x75;
                image_listing_url = node_data.node.path;


                                     if (image_listing_promo_sentence.length > image_listing_promo_sentence_maxlength) {
                                         image_listing_promo_sentence = image_listing_promo_sentence.substr(0, image_listing_promo_sentence_maxlength);
                                         image_listing_promo_sentence = image_listing_promo_sentence.substr(0, Math.min(image_listing_promo_sentence.length, image_listing_promo_sentence.lastIndexOf(" ")));
                                         image_listing_promo_sentence = image_listing_promo_sentence + ' ...';
                                     }

                                    image_content_listing_html += '<li>';
                                        image_content_listing_html += '<a tabindex="1" href="'+ image_listing_url +'" class="small_legacy_wrap">';
                                            image_content_listing_html += '<img height="75" border="0" align="Bottom" width="100" src="'+ image_listing_image +'" class="collection_image">';
                                        image_content_listing_html += '</a>';
                                        image_content_listing_html += '<h3 class="collection_title">';
                                            image_content_listing_html += '<a tabindex="1" href="'+ image_listing_url +'">';
                                                image_content_listing_html += image_listing_title ;
                                            image_content_listing_html += '</a>';
                                        image_content_listing_html += '</h3>';
                                        image_content_listing_html +='<p>' + image_listing_promo_date + ' - ' + image_listing_promo_sentence + '</p>';
                                    image_content_listing_html += '</li>';

                                });

                                image_listing_html += image_content_listing_html;
                            image_listing_html += '</ul>';
            image_listing_html += '</div>';

            if( data_morelink_url!='' && data_morelink_text!='' && ( data.count > data_items)){
                image_listing_html += '<div class="space-station-more">';
                image_listing_html += '<a tabindex="1" href="' + data_morelink_url + '">&rsaquo; ' + data_morelink_text + '</a>';
                image_listing_html += '</div>';
            }

            image_listing_html += '</div>';
            image_listing_html += '</div>';

               if( ( data_pagination=='1') && ( data.count > data_items) ) {
                    image_listing_html += '<div class="pagination-container"><div class="footer-pagination-box"></div></div>';
                }

                if (reload_content_only == true) {
                     jQuery('.browseArchive ul', current_tag).empty();
                     jQuery('.browseArchive ul', current_tag).html(image_content_listing_html);
                } else {
            jQuery(current_tag).empty();
            jQuery(current_tag).html(image_listing_html);

                    if( ( data_pagination=='1') && ( data.count > data_items) ) {
                        jQuery('.pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                ImageListing(data_attr, true);
                                pagination_click = true;
                                jQuery('.footer-pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
    }
                        });

                        jQuery('.footer-pagination-box', current_tag).pagination({
                            items: data.count,
                            itemsOnPage: data_items,
                            onPageClick : function (pageNumber, event) {
                                if (pagination_click == true)
                                    return true;
                                var pagination_offset = (parseInt(pageNumber) - 1) * parseInt(data_items);
                                data_attr['paginationoffset'] = pagination_offset;
                                ImageListing(data_attr, true);
                                pagination_click = true;
                                jQuery('.pagination-box', current_tag).pagination('selectPage', pageNumber);
                                pagination_click = false;
                            }
        });
    }
                }
            }
        }
    });

}

function MultimediaBlock(data_attr) {

    var data_topics = data_attr['datatopics'];
    var data_missions = data_attr['datamissions'];
    var data_collections = data_attr['datacollections'];
    var data_other_tags = data_attr['dataother_tags'];
    var data_routes = data_attr['dataroutes'];
    var xmlsource = data_attr['xmlsource'];
    var data_playlist = data_attr['dataplaylist'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];

    var interactive_json_obj = {};
    var mediacast_json_obj = {};

    var youtube_callback = tag_id + "_youtube";
    var interactive_callback = tag_id + "_interactive";
    var mediacast_callback = tag_id + "_mediacast";

    interactive_json_obj['Topics'] = data_topics;
    interactive_json_obj['Missions'] = data_missions;
    interactive_json_obj['Collections'] = data_collections;
    interactive_json_obj['other_tags'] = data_other_tags;
    interactive_json_obj['Routes'] = data_routes;
    interactive_json_obj['limit'] = 1;
    interactive_json_obj['offset'] = 0;

    mediacast_json_obj['Topics'] = data_topics;
    mediacast_json_obj['Missions'] = data_missions;
    mediacast_json_obj['Collections'] = data_collections;
    mediacast_json_obj['other_tags'] = data_other_tags;
    mediacast_json_obj['Routes'] = data_routes;
    mediacast_json_obj['limit'] = 1;
    mediacast_json_obj['offset'] = 0;

    var youtbe_json_url = xmlsource + '/' + data_playlist + "?v=2&alt=jsonc&max-results=1";
    var interactive_json_url = create_jsonp_url('collectionassetjsonp.jsonp', interactive_json_obj);
    var mediacast_json_url = create_jsonp_url('mediacastjsonp.jsonp', mediacast_json_obj);

    var multimedia_html = '';
    var interactive_title = '';
    var interactive_image = '';
    var interactive_url = '';
    var mediacast_title = '';
    var mediacast_image = '';
    var mediacast_url = '';

    var youtube_success = function(data){
        if (data && typeof (data) == 'object') {
            multimedia_html += '<div class="homepagevideo">';
            multimedia_html += '<ul>';
            multimedia_html += parseMultiMediaYoutubeVideo(data);

            multimedia_html += '<li>';
            multimedia_html += '<div class="img">';
            multimedia_html += '<img src="/sites/all/themes/custom/NASAOmegaHTML5/images/multimediaimage2.png" alt="" width="100" height="75" />';
            multimedia_html += '</div>';
            multimedia_html += '<div class="img-txt">';
            multimedia_html += '<p class="list-head">NASA Television</p>';
            multimedia_html += '<p class="desc-txt">';
            multimedia_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/nasatv/index.html">Watch Live Now</a>';
            multimedia_html += '</p>';
            multimedia_html += '<p class="short-link">';
            multimedia_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/nasatv/MM_NTV_Breaking.html">&rsaquo; View TV schedule</a>';
            multimedia_html += '</p>';
            multimedia_html += '</div>';
            multimedia_html += '</li>';

            jQuery.ajax({
                type: "GET",
                url: interactive_json_url,
                
                success: function (response) {
                    if (response && typeof (response) == 'object') {
                        jQuery.each(response.nodes, function (i, node_response) {

                            interactive_title = node_response.node.title;
                            interactive_image = node_response.node.image_100x75;
                            interactive_url = node_response.node.link_urls;

                            multimedia_html += '<li>';
                            multimedia_html += '<div class="img">';
                            multimedia_html += '<img src="' + interactive_image + '" alt="" width="100" height="75" />';
                            multimedia_html += '</div>';
                            multimedia_html += '<div class="img-txt">';
                            multimedia_html += '<p class="list-head">Interactive Features</p>';
                            multimedia_html += '<p class="desc-txt">';
                            multimedia_html += '<a tabindex="1" href="' + interactive_url + '">' + interactive_title + '</a>';
                            multimedia_html += '</p>';
                            multimedia_html += '<p class="short-link">';
                            multimedia_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/mmgallery/index.html">&rsaquo; More Interactive Features</a>';
                            multimedia_html += '</p>';
                            multimedia_html += '</div>';
                            multimedia_html += '</li>';
                        });
                    }

                    jQuery.ajax({
                        type: "GET",
                        url: mediacast_json_url,
                        
                        success: function (output) {
                            if (response && typeof (output) == 'object') {
                                jQuery.each(output.nodes, function (i, node_output) {

                                    mediacast_title = node_output.node.title;
                                    mediacast_image = node_output.node.image_100x75;
                                    mediacast_url = node_output.node.path;

                                    multimedia_html += '<li>';
                                    multimedia_html += '<div class="img">';
                                    multimedia_html += '<img src="' + mediacast_image + '" alt="" width="100" height="75" />';
                                    multimedia_html += '</div>';
                                    multimedia_html += '<div class="img-txt">';
                                    multimedia_html += '<p class="list-head">Podcasts & Vodcasts</p>';
                                    multimedia_html += '<p class="desc-txt">';
                                    multimedia_html += '<a tabindex="1" href="' + mediacast_url + '">' + mediacast_title + '</a>';
                                    multimedia_html += '</p>';
                                    multimedia_html += '<p class="short-link">';
                                    multimedia_html += '<a tabindex="1" href="http://www.nasa.gov/multimedia/podcasting/index.html">&rsaquo; More Podcasts & Vodcasts</a>';
                                    multimedia_html += '</p>';
                                    multimedia_html += '</div>';
                                    multimedia_html += '</li>';
                                });
                            }

                            multimedia_html += '</ul>';
                            multimedia_html += '</div>';

                            jQuery(current_tag).empty();
                            jQuery(current_tag).html(multimedia_html);
                        }
                    });
                }
            });
        }
    }

    if (jQuery.browser.msie && window.XDomainRequest) {
    // Use Microsoft XDR
        setTimeout(function(){
          var xdr = new XDomainRequest();
          var url = youtbe_json_url.replace('https://',window.location.protocol+'//');
          xdr.onload = function() {
            data = jQuery.parseJSON(xdr.responseText)
            if (data && typeof (data) == 'object') {
                youtube_success(data);
            }
          };
          xdr.open("get", url);  
          xdr.send();  
        },100);
    } else {
        jQuery.ajax({
            type: "GET",
            url: youtbe_json_url,
            success: function(data){
                youtube_success(data);
            }
        });
    } 
    

}

function parseMultiMediaYoutubeVideo(response) {

    var multimedia_youtube_html = '';
    var multimedia_playlist_id = '';
    var multimedia_video_id = '';
    var multimedia_video_title = '';
    var multimedia_video_thumbnail = '';
    var multimedia_video_position = '';
    var multimedia_video_url = '';

    multimedia_playlist_id = jQuery("div[data-blocktype='MultimediaBlock']").attr('data-playlist-code');

    if (response && typeof (response) == 'object') {
        jQuery.each(response.data.items, function (i, item) {
            multimedia_video_id = item.video.id;
            multimedia_video_title = item.video.title;
            multimedia_video_thumbnail = item.video.thumbnail.hqDefault;
            multimedia_video_position = item.position;
            multimedia_video_url = 'http://www.youtube.com/watch?v=' + multimedia_video_id + '&list=' + multimedia_playlist_id + '&index=' + multimedia_video_position;

            multimedia_youtube_html += '<li>';
            multimedia_youtube_html += '<div class="img">';
            multimedia_youtube_html += '<img src="' + multimedia_video_thumbnail + '" alt="" width="100" height="75"/>';
            multimedia_youtube_html += '</div>';
            multimedia_youtube_html += '<div class="img-txt">';
            multimedia_youtube_html += '<p class="list-head">Videos</p>';
            multimedia_youtube_html += '<p class="desc-txt">';
            multimedia_youtube_html += '<a tabindex="1" href="' + multimedia_video_url + '">' + multimedia_video_title + '</a>';
            multimedia_youtube_html += '</p>';
            multimedia_youtube_html += '<p class="short-link">';
            multimedia_youtube_html += '<a tabindex="1" href="/multimedia/videogallery/index.html" target="_blank">&rsaquo; More Videos</a>';
            multimedia_youtube_html += '</p>';
            multimedia_youtube_html += '</div>';
            multimedia_youtube_html += '</li>';

        });
    }

    return multimedia_youtube_html;

}

function eventsCalendar(data_attr) {

    var data_width = data_attr['datawidth'];
    var data_height = data_attr['dataheight'];
    var tag_id = data_attr['tagid'];
    var current_tag = data_attr['currenttag'];
    var more_link = data_attr['datamorelinktext'];

    var jmonth_calendar_events = [];
    var calendar_options = {};

    var i = 1;

    jQuery('div.vevent', current_tag).each(function () {
        var jmonth_calendar_obj = {};
        var date = jQuery('.dtstart', this).html();
        var date_array = date.split('/');

        if (date_array[1] < 10)
            date_array[1] = '0' + date_array[1];

        if (date_array[0] < 10)
            date_array[0] = '0' + date_array[0];

        var new_date = date_array[2] + '-' + date_array[0] + '-' + date_array[1];

        jmonth_calendar_obj['EventID'] = tag_id + "_" + i;
        jmonth_calendar_obj['StartDateTime'] = new_date;
        jmonth_calendar_obj['Title'] = jQuery('.summary', this).html();
        jmonth_calendar_obj['URL'] = jQuery('.url', this).attr('href');
        jmonth_calendar_obj['Description'] = jQuery('.description', this).html();
        jmonth_calendar_obj['CssClass'] = '';

        jmonth_calendar_events.push(jmonth_calendar_obj);

        i++;
    });

    if(more_link==""){

    }else{
        data_height-=32;
    }

    calendar_options = {
        height: data_height,
        width: data_width,
        containerId: "#calendar_" + tag_id,
        navHeight: 25,
        labelHeight: 25,
        navLinks: {
            enableToday: true,
            enableNextYear: false,
            enablePrevYear: false,
            p: '&lsaquo; Prev',
            n: 'Next &rsaquo;',
            t: 'Today'
        }
    };

    jQuery(".loader", current_tag).remove();
    jQuery.jMonthCalendar.Initialize(calendar_options, jmonth_calendar_events);

    return true;
}

function create_jsonp_url(jsonp_file, input_data) {

    var jsonp_url = '';
    var url_params = '';

    jQuery.each(input_data, function (index, input_data_value) {
        input_data_value = jQuery.trim(input_data_value);
        if (input_data_value != '' && input_data_value != 'all') {
            input_data_value = input_data_value.replace(/\s/g, "%20");
            url_params += '&' + index + '=' + input_data_value;
        }
    });

    //  jsonp_url               = '/rest/v/'+ jsonp_file + '?format_output=1&display_id=page_1'+ url_params;
    if(Drupal.settings.basePath == undefined){
      Drupal.settings.basePath = '/';
    }
    jsonp_url = get_services_url() + Drupal.settings.basePath + 'ws/' + jsonp_file + '?format_output=1&display_id=page_1' + url_params;

    return jsonp_url;

}

function process_casini_slide_actions($slideElement, oldIndex, newIndex) {

    var div_id = $slideElement[0].id;
    var image_caption = jQuery('#' + div_id + ' img').attr('caption');
    var image_title = jQuery('#' + div_id + ' img').attr('title');
    var img_url = jQuery('#' + div_id + ' img').attr('data-image-path');
    var total_slide_count = casini_slider.getSlideCount();
    var current_slide = parseInt(newIndex) + 1;

    var img_title_html = '<p><a tabindex="1" href="' + img_url + '">' + image_title + ' -- ' + current_slide + ' of ' + total_slide_count + ' images</a></p>';
    image_caption = '<p>' + image_caption + '</p>';

    jQuery('#img_title').empty();
    jQuery('#img_title').html(img_title_html);

    jQuery('#image_captions').empty();
    jQuery('#image_captions').html(image_caption);

    return true;
}

function pauseSlide(slide_type) {

    if (!slide_type)
        return false;

    switch (slide_type) {
        case "casini":
            if (!casini_slider)
                return false;
            casini_slider.stopAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="playSlide(\'casini\');">Play</a>';
            jQuery('#btn_pauseslideshow_small').addClass('playslideshow');
            jQuery('#btn_pauseslideshow_small').empty();
            jQuery('#btn_pauseslideshow_small').html(play_pause_html);
            casini_paused = true;
            break;
        case "featured_gallery":
            if (!latest_featured_slider)
                return false;
            latest_featured_slider.stopAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="playSlide(\'featured_gallery\');">Play</a>';
            jQuery('.pause_featured_gallery').addClass('play_featured_gallery');
            jQuery('.pause_featured_gallery').empty();
            jQuery('.pause_featured_gallery').html(play_pause_html);
            feature_slider_paused = true;
            break;
        case "multicontent_slider":
            if (!multicontent_slider)
                return false;
            multicontent_slider.stopAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="playSlide(\'multicontent_slider\');">Play</a>';
            jQuery('.pause_multicontent_slider').addClass('play_multicontent_slider');
            jQuery('.pause_multicontent_slider').empty();
            jQuery('.pause_multicontent_slider').html(play_pause_html);
            feature_slider_paused = true;
            break;
        default:
            break;
    }

    return true;
}

function playSlide(slide_type) {

    if (!slide_type)
        return false;

    switch (slide_type) {
        case "casini":
            if (!casini_slider)
                return false;
            casini_slider.startAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="pauseSlide(\'casini\');">Pause</a>';
            jQuery('#btn_pauseslideshow_small').removeClass('playslideshow');
            jQuery('#btn_pauseslideshow_small').empty();
            jQuery('#btn_pauseslideshow_small').html(play_pause_html);
            casini_paused = false;
            break;
        case "featured_gallery":
            if (!latest_featured_slider)
                return false;
            latest_featured_slider.startAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="pauseSlide(\'featured_gallery\');">Pause</a>';
            jQuery('.pause_featured_gallery').removeClass('play_featured_gallery');
            jQuery('.pause_featured_gallery').empty();
            jQuery('.pause_featured_gallery').html(play_pause_html);
            feature_slider_paused = false;
            break;
        case "multicontent_slider":
            if (!multicontent_slider)
                return false;
            multicontent_slider.startAuto();
            play_pause_html = '<a tabindex="1" href="javascript:void(0);" onClick="pauseSlide(\'multicontent_slider\');">Pause</a>';
            jQuery('.pause_multicontent_slider').removeClass('play_multicontent_slider');
            jQuery('.pause_multicontent_slider').empty();
            jQuery('.pause_multicontent_slider').html(play_pause_html);
            feature_slider_paused = false;
            break;
        default:
            break;
    }

    return true;

}

function govdelivery_subscribe() {
    window.location = "https://public.govdelivery.com/accounts/USNASA/subscribers/qualify?code=" + document.govdelivery.folder.value + "&email=" + document.govdelivery.textinput.value + "&origin=" + window.location.href;
}

function showfaq(arg, faq) {
    var isVisible = jQuery('#' + arg).is(':visible');
    jQuery(".showanswer").removeClass("showanswer").addClass("hideanswer");
    jQuery(".faq_minus").removeClass("faq_minus").addClass("faq_plus");

    if (isVisible) {
        jQuery('#' + arg).removeClass('showanswer');
        jQuery('#' + arg).addClass('hideanswer');
        jQuery('#' + arg).stop(true, true).slideUp(500);
        jQuery('#' + faq).attr('src', 'http://nasacss.mobomo.com/sites/all/themes/custom/NASAOmegaHTML5/images/faqminus.gif');
        jQuery('#' + faq).removeClass('faq_minus');
        jQuery('#' + faq).addClass('faq_plus');
    } else {
        jQuery('#' + arg).addClass('showanswer');
        jQuery('#' + arg).removeClass('hideanswer');
        jQuery('#' + arg).stop(true, true).slideDown(500);
        jQuery('#' + faq).removeClass('faq_plus');
        jQuery('#' + faq).addClass('faq_minus');
    }
}

function timeDifference(date_time) {

    var date = new Date(date_time);
    var cur_date = new Date();

    var difference = cur_date.getTime() - date.getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    var secondsDifference = Math.floor(difference / 1000);

    if (daysDifference > 0) {
        if (daysDifference >= 365) {
            var year = cur_date.getFullYear() - date.getFullYear();
            if (year == 0) year = 1;
            date_time = year + (year > 1 ? " years" : " year") + " ago";
        } else {
            var month = 0;

            if (daysDifference > (32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate())) {
                month = Math.abs(((cur_date.getFullYear() - date.getFullYear()) * 12) + (cur_date.getMonth() - date.getMonth()));
            }

            if (month > 0) {
                date_time = month + (month > 1 ? " months" : " month") + " ago";
            } else {
                date_time = daysDifference + (daysDifference > 1 ? " days" : " day") + " ago";
            }
        }
    } else if (hoursDifference > 0) {
        date_time = hoursDifference + (hoursDifference > 1 ? " hours" : " hour") + " ago";
    } else if (minutesDifference > 0) {
        date_time = minutesDifference + (minutesDifference > 1 ? " mins" : " min") + " ago";
    } else if (secondsDifference > 0) {
        date_time = secondsDifference + (secondsDifference > 1 ? " secs" : " sec") + " ago";
    } else {
        date_time = "just now";
    }

    return date_time;

}

function show_next_tip_event() {

    if (jQuery(".shown_event").next().hasClass("Event")) {
        var next_event_element = jQuery(".shown_event").next();
    } else {
        var next_event_element = jQuery("#tiptip_content .Event:first");
    }

    var current_event_element = jQuery(".shown_event");
    jQuery(".shown_event").removeClass("shown_event");
    current_event_element.hide();
    next_event_element.show();
    next_event_element.addClass("shown_event");

    var event_count = jQuery("#tiptip_content .Event").length;
    var $lines = jQuery('#tiptip_content .Event');
    var current_event_count = $lines.index($lines.filter('.shown_event'))
    current_event_count = parseInt(current_event_count) + 1;

    var event_tooltip_title = '<p>Event <span class="curr-num">' + current_event_count + '</span> of <span class="total-num">' + event_count + '</span></p>';
    jQuery("#tiptip_content .event-title").html(event_tooltip_title);
}

function show_prev_tip_event() {

    if (jQuery(".shown_event").prev().hasClass("Event")) {
        var prev_event_element = jQuery(".shown_event").prev();
    } else {
        var prev_event_element = jQuery("#tiptip_content .Event:last");
    }

    var current_event_element = jQuery(".shown_event");
    jQuery(".shown_event").removeClass("shown_event");
    current_event_element.hide();
    prev_event_element.show();
    prev_event_element.addClass("shown_event");

    var event_count = jQuery("#tiptip_content .Event").length;
    var $lines = jQuery('#tiptip_content .Event');
    var current_event_count = $lines.index($lines.filter('.shown_event'))
    current_event_count = parseInt(current_event_count) + 1;
    var event_tooltip_title = '<p>Event <span class="curr-num">' + current_event_count + '</span> of <span class="total-num">' + event_count + '</span></p>';
    jQuery("#tiptip_content .event-title").html(event_tooltip_title);

}

function get_tooltip_content(event_id) {

    var event_tooltip_data = jQuery('#event_holder_' + event_id).html();
    var event_count = jQuery('#event_holder_' + event_id + " .Event").length;
    var event_tooltip_container = "";

    event_tooltip_container += '<div class="cal-wrap">';
    if (event_count > 1) {
        event_tooltip_container += '<div class="nav-tool">';
        event_tooltip_container += '<div class="cal-prev">';
        event_tooltip_container += '<a tabindex="1" href="javascript:void(0);" onClick="show_prev_tip_event();"></a>';
        event_tooltip_container += '</div>';
        event_tooltip_container += '<div class="event-title">';
        event_tooltip_container += '<p>Event <span class="curr-num">1</span> of <span class="total-num">' + event_count + '</span></p>';
        event_tooltip_container += '</div>';
        event_tooltip_container += '<div class="cal-nxt">';
        event_tooltip_container += '<a tabindex="1" href="javascript:void(0);" onClick="show_next_tip_event();"></a>';
        event_tooltip_container += '</div>'
        event_tooltip_container += '</div>';
    }
    event_tooltip_container += event_tooltip_data;
    event_tooltip_container += '</div>';

    return event_tooltip_container;


}

function submitPopUpEmail() {
     newwin = window.open("","myNewWin","menubar=no,location=no,toolbar=no,directories=no,scrollbars=yes,status=no,resizable=yes,width=720,height=640,toolbar=0");
     newwin.focus();
     var a = window.setTimeout("document.emailForm.submit();",500);
}

function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}