(function($){

	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				prevText: 'Prev',
				nextText: 'Next',
				firstText: 'First',
				lastText: 'Last',
				ellipseText: '&hellip;',
				cssStyle: 'light-theme',
				selectOnClick: true,
				uniqueId: '',
				onPageClick: function(pageNumber, event) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function() {
					// Callback triggered immediately after initialization
				}
			}, options || {});

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			o.currentPage = o.currentPage - 1;
			o.halfDisplayed = o.displayedPages / 2;
			if($(this).parents('.embedTag').attr('id')){
				o.uniqueId = $(this).parents('.embedTag').attr('id')+'_'+$('.node-panel').attr('id');
				var pageCookie = methods.readCookie.call(self,'pagination_'+o.uniqueId);
				if(pageCookie){
					o.currentPage = Number(pageCookie);
				}
			}

			this.each(function() {
				self.addClass(o.cssStyle + ' pagination-inner-container').data('pagination', o);
				methods._draw.call(self);
			});

			o.onInit();			

			return this;
		},
		createCookie: function (name, value, days) {
		    if (days) {
		        var date = new Date();
		        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		        var expires = "; expires=" + date.toGMTString();
		    } else var expires = "";
		    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
		},
		readCookie: function (name) {
		    var nameEQ = escape(name) + "=";
		    var ca = document.cookie.split(';');
		    for (var i = 0; i < ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
		    }
		    return null;
		},
		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function() {
			var o = this.data('pagination');
			if (o.currentPage > 0) {
				methods._selectPage.call(this, o.currentPage - 1);
			}
			return this;
		},

		nextPage: function() {
			var o = this.data('pagination');
			if (o.currentPage < o.pages - 1) {
				methods._selectPage.call(this, o.currentPage + 1);
			}
			return this;
		},
		
		firstPage: function() {
			var o = this.data('pagination');
			methods._selectPage.call(this, 1);
			return this;
		},

		lastPage: function() {
			var o = this.data('pagination');
			methods._selectPage.call(this, o.pages);
			return this;
		},

		getPagesCount: function() {
			return this.data('pagination').pages;
		},

		getCurrentPage: function () {
			return this.data('pagination').currentPage + 1;
		},

		destroy: function(){
			this.empty();
			return this;
		},

		redraw: function(){
			methods._draw.call(this);
			return this;
		},

		disable: function(){
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		enable: function(){
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		_draw: function() {
			var	o = this.data('pagination'),
				interval = methods._getInterval(o),
				i;

			methods.destroy.call(this);

			var $panel = this.attr("tagName") === "UL" ? this : $('<ul></ul>').appendTo(this);

			// Generate First link
			if (o.firstText) {
				methods._appendItem.call(this, 0, {text: o.firstText, classes: 'page-first'});
			}
			
			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, o.currentPage - 1, {text: o.prevText, classes: 'page-prev'});
			}

			// Generate start edges
			if (interval.start > 0 && o.edges > 0) {
				var end = Math.min(o.edges, interval.start);
				for (i = 0; i < end; i++) {
					methods._appendItem.call(this, i);
				}
				if (o.edges < interval.start && (interval.start - o.edges != 1)) {
					$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
				} else if (interval.start - o.edges == 1) {
					methods._appendItem.call(this, o.edges);
				}
			}

			// Generate interval links
			for (i = interval.start; i < interval.end; i++) {
				methods._appendItem.call(this, i);
			}

			// Generate end edges
			if (interval.end < o.pages && o.edges > 0) {
				if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
					$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
				} else if (o.pages - o.edges - interval.end == 1) {
					methods._appendItem.call(this, interval.end++);
				}
				var begin = Math.max(o.pages - o.edges, interval.end);
				for (i = begin; i < o.pages; i++) {
					methods._appendItem.call(this, i);
				}
			}

			// Generate Next link
			if (o.nextText) {
				methods._appendItem.call(this, o.currentPage + 1, {text: o.nextText, classes: 'page-next'});
			}
			
			// Generate Last link
			if (o.lastText) {
				methods._appendItem.call(this, o.pages, {text: o.lastText, classes: 'page-last'});
			}
		},

		_getInterval: function(o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			};
		},

		_appendItem: function(pageIndex, opts) {
			
			var self = this, options, $link, o = self.data('pagination'), $ul = self.find('ul');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

			options = $.extend({
				text: pageIndex + 1,
				classes: ''
			}, opts || {});

			if (options.text == 1) {
				var first_last_class = "class='paginate-link-first'";
			} else if(options.text == o.pages) {
				var first_last_class = "class='paginate-link-last'";
			} else {
				var first_last_class = " ";
			}
			
			$linkWrapper = $('<li '+ first_last_class +'></li>')
			
			if (pageIndex == o.currentPage || o.disabled) {
				if (o.disabled) {
					$linkWrapper.addClass('disabled');
				} else {
					$linkWrapper.addClass('active');
				}
				$link = $('<span class="current">' + (options.text) + '</span>');
			} else {
				$link = $('<a href="javascript:void(0);" class="page-link">' + (options.text) + '</a>');
				$link.click(function(event){ 
					return methods._selectPage.call(self, pageIndex, event);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			$linkWrapper.append($link);

			if ($ul.length) {
				$ul.append($linkWrapper);
			} else {
				self.append($linkWrapper);
			}
		},

		_selectPage: function(pageIndex, event) {
			var o = this.data('pagination');
			o.currentPage = pageIndex;
			if(o.uniqueId){
				methods.createCookie.call(this,'pagination_'+o.uniqueId,pageIndex);
			}			
			if (o.selectOnClick) {
				methods._draw.call(this);
			}
			return o.onPageClick(pageIndex + 1, event);
		}

	};
	
	$.fn.pagination = function(method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.pagination');
		}

	};

})(jQuery);