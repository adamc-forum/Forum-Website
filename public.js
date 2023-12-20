$(function(){
    'use strict';

   var $page = $('#smoothscroll'),
       options = {
           debug: false,
           trigger_container: $(document),
           anchors: 'a[href]',
           scroll: false,
           blacklist: '.no-smoothState, [href^="mailto:"], .carousel a',
           cacheLength: 0,
           prefetch: true,

           onBefore: function($trigger, $container){
               Website._transition._init(false);
           },

           onReady: {
               render: function ($container, $newContent, classes, page_title, url) {
                   Website._transition.end_transition_queue($newContent, page_title, url);
               }
           }
   };
   
   // Detect IE
       if (Website._functions.internet_explorer())
       {
           window.location = '/internet-explorer';
           return;
       }

   Website._smoothState = $page.smoothState(options).data('smoothState');
   Website._init(true);
});

/** Primary Controller ******************************/
   var Website = function(){
       return {
           _register: { breakpoints: {}, callbacks: [], controllers: [], data: { }, queries: [], transition: { container: $('#smoothscroll'), state: false, timer: { duration: 0, interval: false, timer: false } }, width: 0 },

           _init: function(init){
               this._base(init);
               this._controllers();
               
               if (init)
               {
                   Website._functions.lighthouse();
                   this._events();
               }
           },

           _base: function(init){
               if (init)
               {
                   // Write breakpoints
                       $.each(['mobile', 'tablet', 'laptop', 'desktop', 'laptop_desktop', 'laptop_desktop_notouch'], function(index, breakpoint){
                           $('body').append('<code class="device" id="_' + breakpoint + '"></code>');
                           
                           Website._register.breakpoints[breakpoint] = false;
                       });
                       
                   // Initialize SmoothScroll
                       SmoothScroll._init(true);
                   
                   // Ready
                       setTimeout(function(){ $('body').addClass('ready'); }, 100);
               }
               else
                   SmoothScroll.reset();

               setTimeout(function(){
                   // Initialize Smoothscroll Handlers
                       Website._resize._init(true);
                       Website._scroll._init(true);
   
                   // Initialize Smoothscroll Animations
                       SmoothScroll._scroll(true, false, 0, false, true);
               }, 1);
           },

           _controllers: function(){
               // Register controllers
                   Website._register.controllers.length = 0;

                   $('[controller]').each(function(){
                       var controller = $(this).attr('controller').replace(/-/g, ' ').replace(/\w\S*/g, function(ctrl){ return ctrl.charAt(0).toUpperCase() + ctrl.substr(1).toLowerCase(); }).replace(/ /g, '');

                       if (typeof window[controller] == 'object' && $.inArray(controller, Website._register.controllers) == -1)
                       {
                           Website._register.controllers.push(controller);
                           window[controller]._init();
                       }
                   });
           },

           _events: function(init){
               // Stop all page scrolling animations when the mousewheel is touched
                   $(document).bind('mousewheel touchstart', function(e){ $('html, body').stop(); });
                   
               // Resize
                   $(window).on('resize', function(){ Website._resize._init(false); });

               // Scroll
                   $(window).on('scroll', function(){ Website._scroll._init(false); });
           },

           _events_unload: function(){
               // Unload controller events
                   $.each(Website._register.controllers, function(index, controller){
                       window[controller]._events_unload();
                   });
           },

           _functions: function(){
               return {
                   internet_explorer: function(){
                       return window.navigator.userAgent.indexOf('MSIE ') > 0 || window.navigator.userAgent.indexOf('Trident/') > 0;
                   },
                   
                   lighthouse: function(){
                       if (window.navigator.userAgent.toLowerCase().indexOf('lighthouse') > 0)
                       {
                           Website._register.lighthouse = true;
                           $('body').addClass('no-reveals');
                       }
                   },
               }
           }(),

           _interaction: function(){
               return {
               }
           }(),

           _resize: function(){
               return {
                   _init: function(init){
                       // Call controller resize events
                           $.each(Website._register.controllers, function(index, controller){
                               if (typeof window[controller]._resize == 'object' && typeof window[controller]._resize._init == 'function')
                                   window[controller]._resize._init();
                           });
                       
                       // Get breakpoint
                           $.each(['mobile', 'tablet', 'laptop', 'desktop', 'laptop_desktop', 'laptop_desktop_notouch'], function(index, breakpoint){
                               Website._register.breakpoints[breakpoint] = !!$('#_' + breakpoint + ':visible').length;
                           });

                       // Set page height
                           if (document.documentElement.clientWidth >= 1025 || Math.max(document.documentElement.clientWidth, 320) != Website._register.width)
                           {
                               Website._register.width = Math.max(document.documentElement.clientWidth, 320);

                               let vh_fixed = window.innerHeight * 0.01;
                               document.documentElement.style.setProperty('--vh_fixed', `${vh_fixed}px`);
                           }

                       // Set page height
                           let vh = window.innerHeight * 0.01;
                           document.documentElement.style.setProperty('--vh', `${vh}px`);

                       // Set page width
                           clientWidth = Math.max(document.documentElement.clientWidth, 320);

                           let vw = clientWidth * 0.01;
                           document.documentElement.style.setProperty('--vw', `${vw}px`);

                           let mVw = Math.min(clientWidth, 1440) * 0.01;
                           document.documentElement.style.setProperty('--mVw', `${mVw}px`);
                       
                       // Set scrollbar width
                           let sw = window.innerWidth - clientWidth;
                           document.documentElement.style.setProperty('--sw', `${sw}px`);
                   },
               }
           }(),

           _scroll: function(){
               return {
                   _scrollTop: 0,
                   _scroll: false,
                   _direction: true,

                   _init: function(init){
                       // Call controller scroll events
                           $.each(Website._register.controllers, function(index, controller){
                               if (typeof window[controller]._scroll == 'object' && typeof window[controller]._scroll._init == 'function')
                                   window[controller]._scroll._init();
                           });

                       if ($('body').attr('smoothscrolling') == 'off')
                       {
                           this._direction = $(window).scrollTop() >= this._scrollTop ? true : false;
                           this._scrollTop = $(window).scrollTop();

                           this.header();
                       }
                   },

                   header: function(){
                       if ($(window).scrollTop() > 0 && this._direction && !this._scroll)
                       {
                           this._scroll = true;
                           $('header').addClass('scroll');
                           $('body').removeClass('header-visible');
                       }

                       if (!this._direction && this._scroll)
                       {
                           this._scroll = false;
                           $('header').removeClass('scroll');
                           $('body').addClass('header-visible');
                       }

                       $('header').toggleClass('initial', $(window).scrollTop() < 10);
                   }
               }
           }(),

           _transition: function(){
               return {
                   _init: function(popstate){
                       // Unload events
                           Website._events_unload();
                       
                       // Add transition class
                           setTimeout(function(){ $('body').addClass('transition'); }, $('header').hasClass('menu') ? 600 : 0);
                       
                       // Close menu if open
                           Global._interaction.menu.close();
                   },

                   begin_transition: function(){
                       // Begin transition timer
                           Website._register.transition.timer.duration = 0;
                           Website._register.transition.timer.interval = setInterval(function(){ Website._register.transition.timer.duration += 1 }, 1);
                   },

                   end_transition_queue: function($newContent, page_title, url)
                   {
                       setTimeout(function(){
                           Website._transition.end_transition($newContent, page_title, url);
                           clearInterval(Website._register.transition.timer.interval);
                       }, Math.max(1200 - Website._register.transition.timer.duration, 0));
                   },

                   end_transition: function($newContent, page_title, url){	
                       // Unload smoothscroll
                           SmoothScroll.unload();
                       
                       // Load new page content
                           Website._register.transition.container.html($newContent);
                       
                       // Highlight correct nav item
                           $('html').removeClass();
                           $('body').removeClass('ready');
                           $('header').removeClass('nav splash splash-active splash-complete white')
                                      .find('.active').removeClass('active').end()
                                      .find('a[href="/' + url.split('/').pop() + '"]').addClass('active');							
                                      
                       // Initialize new page		  
                           setTimeout(function(){ Website._init(false); }, 400);

                       // Remove transition layer
                           $('body').addClass('transition complete');
                           setTimeout(function(){ $('body').addClass('ready').removeClass('transition complete'); }, 800);
                           
                           _hsq.push(['setPath', url]);
                           _hsq.push(['trackPageView']);
                   }
               }
           }()
       }
   }();



/**** Pages ******************************************************************************************/

   /** Global ******************************/
       var Global = function(){
           return {
               _register: { scroll: 0 },

               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // 1. Text reveal
                       Global._functions.text_reveal._init();
                       
                   // 2. Buttons
                       Global._functions.buttons();
                                   
                   // Carousel
                       Global._functions.carousel();
                   
                   // Parallax images
                       Global._functions.parallax_images();
                       
                   // Scrolling Text
                       Global._functions.scrolling_text();
                                   
                   // Ticker
                       Global._functions.ticker();
               },

               _events: function(){
                   // General
                       $(document).on('click', 'button[action="goto"]', function(){ Global._interaction.goto($(this).attr('target')); });
                       $(document).on('click', 'button[action="accordion"]', function(){ Global._interaction.accordion._init($(this)); });
                   
                   // Menu
                       $(document).on('click', 'button[action="menu.open"]', function(){ Global._interaction.menu.open(); });
                       $(document).on('click', 'button[action="menu.close"]', function(){ Global._interaction.menu.close(); });
                       $(document).on('click', 'button[action="menu.menu"]', function(){ Global._interaction.menu.menu($(this).attr('menu')); });
                       $(document).on('mouseover', 'section#menu nav#secondary-nav a:last-child:not(.hover)', function(){ Global._interaction.menu.button.mouseover($(this)); });
                       $(document).on('mouseout', 'section#menu nav#secondary-nav a:last-child.hover', function(){ Global._interaction.menu.button.mouseout($(this)); });
                   
                   // Buttons
                       $(document).on('mouseover', '.button:not(.hover):not(.pre-init)', function(){ Global._interaction.button.mouseover($(this)); });
                       $(document).on('mouseout', '.button.hover', function(){ Global._interaction.button.mouseout($(this)); });
                   
                   // Carousel
                       $(document).on('mousedown', 'div.carousel ul:not(.sliding) li', function(){ Global._interaction.carousel.mousedown($(this)); });			
                       $(document).on('click', 'div.carousel ul:not(.sliding) li a', function(event){ Global._interaction.carousel.click($(this), event); });
               },

               _events_unload: function(){
                   // General
                       $(document).off('click', 'button[action="goto"]');
                       $(document).off('click', 'button[action="accordion"]');
                   
                   // Menu
                       $(document).off('click', 'button[action="menu.open"]');
                       $(document).off('click', 'button[action="menu.close"]');
                       $(document).off('click', 'button[action="menu.menu"]');
                       $(document).off('mouseover', 'section#menu nav#secondary-nav a:last-child:not(.hover)');
                       $(document).off('mouseut', 'section#menu nav#secondary-nav a:last-child.hover');
                   
                   // Buttons
                       $(document).off('mouseover', '.button:not(.hover):not(.pre-init)');
                       $(document).off('mouseout', '.button.hover');
                   
                   // Carousel
                       $(document).off('mousedown', 'div.carousel ul:not(.sliding) li');
                       $(document).off('click', 'div.carousel ul:not(.sliding) li a');
               },
               
               _functions: function(){
                   return {
                       above_the_fold: function($element, animation_class, only_on_reveal = false){
                           if (!$element.length)
                               return;
                               
                           let element = $element.get()[0],
                               top = element.offsetTop +
                                     element.parentElement.offsetTop +
                                     element.parentElement.parentElement.offsetTop +
                                     element.parentElement.parentElement.parentElement.offsetTop +
                                     element.parentElement.parentElement.parentElement.parentElement.offsetTop;
                               
                           $element.toggleClass('above-the-fold', top < $(window).height() - 30);
                           
                           if (animation_class && (top < $(window).height() - 30 || !only_on_reveal))
                               setTimeout(function(){ $element.addClass(animation_class); }, 10);
                       },
                       
                       buttons: function(){
                           $('.button').each(function(){
                               $(this).append('<circle><icon><arrow></arrow></icon></circle>');
                           });						
                       },
                       
                       carousel: function(){
                           $('div.carousel div.carousel-text').each(function(){
                               let $container = $('<div></div>'),
                                   message = $(this).text() + '  —  ';
                               
                               while (message.length < 500)
                                   message += $(this).text() + '  —  ';
                               
                               $message = $('<div>').append(message);
                               $message.clone().andSelf().appendTo($container);
                               
                               $(this).html($container);
                           });
                       },
                       
                       parallax_images: function(){
                           $('figure[scroll*="parallax"] img, figure[scroll*="parallax"] video').each(function(){
                               $(this).wrap('<span></span>');
                           });
                       },
                       
                       scrolling_text: function(){
                           $('[scroll="scrolling-text"]').each(function(){
                               $(this).wrapInner('<span></span>');
                           });
                       },
                       
                       text_reveal: function(){
                           return {
                               _init: function(method){
                                   $('.text-reveal').each(function(){
                                       let _reveal = Global._functions.text_reveal;
                                       
                                       if ($(this).hasClass('set'))
                                           return;
                                       
                                       // Buttons
                                           else if ($(this).hasClass('button') && $(this).find('strong').length)
                                               _reveal.prepare.buttons($(this), _reveal, '');
                                       
                                       // Menu
                                           else if ($(this).parents('#menu').length)
                                               _reveal.prepare.menu($(this), _reveal, '');
                                       
                                       // Headings
                                           else
                                               _reveal.prepare.headings($(this), _reveal, '');
                                   });
                               },
                               
                               get: function(){
                                   return {
                                       lines: function(text){
                                           return $.trim(text).split("\n");
                                       },
                                       
                                       words: function(text){
                                           return $.trim(text).split(' ');
                                       },
                                       
                                       wrap: function(text){
                                           return '<span><sub>' + text + '</sub></span>';
                                       }
                                   }
                               }(),
                               
                               set: function($element, $container, html, index = false){
                                   $element.addClass('set');
                                   
                                   $container.html(html)
                                             .find('span:last sub').html($.trim($container.find('span:last sub').text().replace('™', '<sup>™</sup>')));
                                   
                                   $container.find('sup').each(function(){ $(this).parents('sub').addClass('sup'); });
                                   
                                   if (index)
                                   {
                                       $element.find('span').each(function(index){
                                           $(this).get(0).style.setProperty('--index', index);
                                       });
                                   }
                               },
                               
                               prepare: function(){
                                   return {
                                       buttons: function($element, _reveal, html){
                                           $container = $element.find('strong');
                                           
                                           $.each(_reveal.get.lines($container.text()), function(lIndex, line){
                                               html += (lIndex ? "\n" : '') + _reveal.get.wrap(line);
                                           });
                                           
                                           _reveal.set($element, $container, html, true);
                                       },
                                       
                                       headings: function($element, _reveal, html){
                                           $element.addClass('headline');
                                           
                                           $container = $element;
                                           
                                           $.each(_reveal.get.lines($container.text()), function(lIndex, line){
                                               $.each(_reveal.get.words(line), function(wIndex, word){
                                                   html += (lIndex && !wIndex ? "\n" : '') + _reveal.get.wrap(word + (wIndex < $.trim(line).split(' ').length - 1 ? ' ' : ''));
                                               });				
                                           });
                                           
                                           _reveal.set($element, $container, html, true);
                                       },
                                       
                                       menu: function($element, _reveal, html){
                                           $container = $element;
                                           
                                           $.each(_reveal.get.lines($container.text()), function(lIndex, line){
                                               $.each(_reveal.get.words(line), function(wIndex, word){
                                                   html += (lIndex && !wIndex ? "\n" : '') + _reveal.get.wrap(word + (wIndex < $.trim(line).split(' ').length - 1 ? ' ' : ''));
                                               });				
                                           });
                                           
                                           _reveal.set($element, $container, html, false);
                                       },
                                   }
                               }(),
                           }
                       }(),
                       
                       ticker: function(){
                           $('div.ticker').each(function(){
                               let $container = $('<div class="ticker-container"></div>'),
                                   message = $(this).text() + '   ·   ';
                               
                               while (message.length < 2000)
                                   message += $(this).text() + '   ·   ';
                               
                               $message = $('<div>').append(message);
                               $message.clone().andSelf().appendTo($container);
                               
                               $(this).html($container);
                           });
                       }
                   }
               }(),

               _interaction: function(){
                   return {
                       accordion: function(){
                           return {
                               _init: function($button){
                                   $li = $button.parents('li:first');
   
                                   clearTimeout($li.prop('animate'));
                                   clearTimeout($li.prop('activate'));
   
                                   this[$li.hasClass('active') ? 'deactivate' : 'activate']($li);
                               },
   
                               activate: function($li){
                                   $li.addClass('animate')
                                      .find('div.accordion-outer').css('height', $li.find('div.accordion-inner').height())
   
                                   $li.prop('activate', setTimeout(function(){ $li.addClass('active'); }, 1));
                                   $li.prop('animate', setTimeout(function(){ $li.removeClass('animate'); }, 401));
                                   setTimeout(function(){ $li.find('div.accordion-outer').removeAttr('style'); }, 401);
                               },
   
                               deactivate: function($li){
                                   $li.find('div.accordion-outer').css('height', $li.find('div.accordion-inner').height());
   
                                   $li.prop('activate', setTimeout(function(){
                                       $li.addClass('animate')
                                          .removeClass('active')
                                          .find('> div').removeAttr('style');
                                   }, 10));
   
                                   $li.prop('animate', setTimeout(function(){ $li.removeClass('animate'); }, 430));
                               }
                           }
                       }(),
                       
                       button: function(){
                           return {
                               mouseover: function($button){
                                   clearTimeout($button.prop('inactive'));
                                   
                                   $button.addClass('hover')
                                          .prop('inactive-delay', Date.now() + 1000);
                               },
                               
                               mouseout: function($button){
                                   $button.prop('inactive', setTimeout(function(){ $button.removeClass('hover').addClass('pre-init'); }, Math.max($button.prop('inactive-delay') - Date.now(), 0)))
                                          .prop('pre-init', setTimeout(function(){ $button.removeClass('pre-init'); }, Math.max($button.prop('inactive-delay') - Date.now(), 0) + 800));
                               }
                           }
                       }(),
                       
                       carousel: function(){
                           return {
                               click: function($a, event){
                                   event.preventDefault();
                                   
                                   if ($a.parents('div.carousel ul').prop('link'))
                                   {
                                       Website._transition._init();
                                       Website._smoothState.load($a.attr('href'));
                                   }
                                   
                               },
                               
                               mousedown: function($li){
                                   $li.parents('div.carousel ul').prop('link', true);
                               },
                           }
                       }(),
                       
                       form: function(){
                           return {
                               success: function($form){
                                   $container = $form.parents('.form-container');
                                   $container.addClass('fade-out')
                                             .css('height', $container.height());
                                   
                                   setTimeout(function(){
                                       $container.css('height', $container.find('> p').height());
                                       Global._interaction.goto($form.parents('section').offset().top);
                                   }, 1);
                                   setTimeout(function(){ $container.addClass('complete'); }, 600);
                                   setTimeout(function(){ $container.removeClass('fade-out'); }, 1200);
                               }
                           }
                       }(),
                       
                       goto: function(target){
                           let top = 0,
                               current_top = SmoothScroll._attributes.transition.previous;
                           
                           if (!isNaN(target))
                               top = target;
                           else
                           {
                               if (typeof target !== 'object')
                                   target = document.getElementById(target);
                               
                               top = target.offsetTop +
                                       target.parentElement.offsetTop +
                                       target.parentElement.parentElement.offsetTop +
                                       target.parentElement.parentElement.parentElement.offsetTop +
                                       target.parentElement.parentElement.parentElement.parentElement.offsetTop;
                           }
                           
                           $(SmoothScroll._attributes.document.main_scroll).stop().animate({ 'scrollTop': top - (top > current_top ? 0 : 94) }, 800, 'easeInOutCubic');
                           
                           SmoothScroll._attributes.header.scroll_lock = true;
                           setTimeout(function(){ SmoothScroll._attributes.header.scroll_lock = false; }, 2000);
                       },
                       
                       menu: function(){
                           return {
                               button: function(){
                                   return {
                                       mouseover: function($button){
                                           clearTimeout($button.prop('inactive'));
                                           
                                           $button.addClass('hover')
                                                  .prop('inactive-delay', Date.now() + 1000);
                                       },
                                       
                                       mouseout: function($button){
                                           $button.prop('inactive', setTimeout(function(){ $button.removeClass('hover'); }, Math.max($button.prop('inactive-delay') - Date.now(), 0)));
                                       }
                                   }
                               }(),
                               
                               close: function(){
                                   $('header').removeClass('menu')
                                              .find('#menu').addClass('animate')
                                                            .prop('animate', setTimeout(function(){ $('#menu').removeClass('animate'); }, 800));
                                   
                                   SmoothScroll.unlock();
                               },
                               
                               open: function(){
                                   $('header').addClass('menu')
                                              .find('#menu').addClass('animate')
                                                            .prop('animate', setTimeout(function(){
                                                               $('#menu').removeClass('animate');	
                                                               SmoothScroll.lock();
                                                            }, 800));
                                                            
                                   $('section#menu div.container').stop().animate({ 'scrollTop': 0 }, 0);
                                   $('section#menu [activate]').removeClass('reveal')
                                                               .prop('reveal', setTimeout(function(){ $('section#menu [activate]').addClass('reveal'); }, 1));
                                   
                                   this.menu('main', true);
                               },
                               
                               menu: function(menu, init = false){
                                   if (!init)
                                       $('#menu').addClass('transitioning')
                                   
                                   $menu = $('#menu div[menu="' + menu + '"]');
                                   
                                   setTimeout(function(){
                                       $('#menu').removeClass('transitioning');
                                       
                                       $('#menu div[menu]').removeClass('active')
                                                           .each(function(){
                                                               $(this).find('.text-reveal, button.para').removeClass('reveal')
                                                                                           .each(function(index, element){
                                                                                               $(this).removeClass('reveal')
                                                                                                      .find('span').attr('style', '--index:' + index + ';');
                                                                                               });
                                                           });
                                       
                                       $menu.addClass('active')
                                            .prop('animate', setTimeout(function(){ $menu.find('.text-reveal, button.para').addClass('reveal'); }, !init ? 0 : 300));
                                   }, !init ? 400 : 0);
                               }
                           }
                       }()
                   }
               }()
           }
       }();
       
       
   /** Homepage ******************************/
       var Homepage = function(){
           return {
               _register: { sliders: {} },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#homepage-hero figure[scroll="reveal"]'), 'reveal', true);
                       Global._functions.above_the_fold($('#homepage-hero figure[scroll="parallax"]'), 'reveal', true);
                       
                   // Sliders
                       Homepage._register.sliders.real_estate = new Drag($('#homepage-real-estate div.carousel'), { cursor: true, cursorText: 'Drag' });
                       Homepage._register.sliders.private_equity = new Drag($('#homepage-private-equity div.carousel'), { cursor: true, cursorText: 'Drag' });
                       Homepage._register.sliders.infrastructure = new Drag($('#homepage-infrastructure div.carousel'), { cursor: true, cursorText: 'Drag' });
                   
                   // Videos
                       $('iframe[data-src]').each(function(){
                           $(this).attr('src', $(this).attr('data-src'))
                                  .removeAttr('data-src');
                       });
               },
       
               _events: function(){
               },

               _events_unload: function(){
                   Homepage._register.sliders.real_estate._unload();
                   Homepage._register.sliders.private_equity._unload();
                   Homepage._register.sliders.infrastructure._unload();
               }
           }
       }();
       
       
   /** About ******************************/
       var About = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#about-hero figure[scroll="parallax"]'), 'reveal', true);
                   
               },
       
               _events: function(){
               },

               _events_unload: function(){
               }
           }
       }();
       
       
   /** Careers ******************************/
       var Careers = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#careers-hero p.lg'), 'fade-up');
               },

               _events: function(){
                   $(document).on('click', '#stakeholder-model button[action="stakeholder"]', function(){ Careers._interaction.stakeholders.stakeholder($(this)); });
                   $(document).on('click', '#stakeholder-model button[action="stakeholder.prev"]', function(){ Careers._interaction.stakeholders.prev(); });
                   $(document).on('click', '#stakeholder-model button[action="stakeholder.next"]', function(){ Careers._interaction.stakeholders.next(); });
               },

               _events_unload: function(){
                   $(document).off('click', '#stakeholder-model button[action="stakeholder"]');
                   $(document).off('click', '#stakeholder-model button[action="stakeholder.prev"]');
                   $(document).off('click', '#stakeholder-model button[action="stakeholder.next"]');
               },

               _interaction: function(){
                   return {
                       stakeholders: function(){
                           return {
                               prev: function(){
                                   const $button = $('#stakeholders div.active').prevAll(':visible').length ? $('#stakeholders div.active').prevAll(':visible').first() : $('#stakeholders div:visible:last');
                                   this.stakeholder($button.find('button'));
                               },
                               
                               next: function(){
                                   const $button = $('#stakeholders div.active').nextAll(':visible').length ? $('#stakeholders div.active').nextAll(':visible').first() : $('#stakeholders div:first');
                                   this.stakeholder($button.find('button'));
                               },
                               
                               stakeholder: function($button){		
                                   if ($('#stakeholders').hasClass('animation'))
                                       return;
                                       
                                   let prev_button = $('#stakeholders div.active').prevAll().length;
                                   
                                   $button.parent('div').addClass('active')
                                          .siblings().removeClass('active');
                                   
                                   let current_button = $button.parent('div').prevAll().length,
                                       replacement_button = current_button;
                                   
                                   if (current_button == 0 && prev_button == 6)
                                   {
                                       current_button = 7;
                                       replacement_button = 0;
                                   }
                                   else if (current_button == 6 && prev_button == 0)
                                   {
                                       current_button = -1;
                                       replacement_button = 6;
                                   }
                                       
                                   $('#stakeholder-model').addClass('active transition')
                                                          .prop('animation', setTimeout(() => {
                                                              $('#stakeholder-model').attr('stakeholder', $button.attr('stakeholder'))
                                                                                        .removeClass('transition');
                                                          }, 600))
                                                           
                                   $('#stakeholders').addClass('animation')
                                                     .prop('animation', setTimeout(() => {
                                                         $('#stakeholders').removeClass('animation')
                                                                           .get()[0].style.setProperty('--active', replacement_button)
                                                      }, 600))
                                                     .get()[0].style.setProperty('--active', current_button)
                                                     
                                   $('#stakeholder').addClass('transition')
                                                    .prop('content', setTimeout(() => {
                                                           $('#stakeholder').removeClass('transition')
                                                                            .find('strong').text($button.attr('stakeholder')).end()
                                                                            .find('p').text($button.attr('description'));
                                                    }, 300));									
                               }
                           }
                       }()
                   }
               }(),
/*
               _resize: function(){
                   return {
                       _init: function(){

                           
                           if ($('#stakeholders div.active:not(:visible)').length)
                           {
                               $('#stakeholders div:visible button[stakeholder="' + $('#stakeholders div.active button').attr('stakeholder') + '"]').parent('div')
                                                                                                                                                   .addClass('active')
                                                                                                                                                   .siblings().removeClass('active');
                               $('#stakeholders').get()[0].style.setProperty('--active',  $('#stakeholders div.active').prevAll().length);
                           }
                       }
                   }
               }()
*/
           }
       }();
       
       
   /** Career ******************************/
       var Career = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   $('#cv').uploadifive({
                       auto       	     : false,
                       dnd				 : false,
                       multi       	 : false,
                       queueID    	     : 'queue',
                       uploadScript  	 : $('#apply form').attr('handler'),
                       onAddQueueItem	 : function(file){ $('#uploadifive-cv span').html('<strong>Attached:</strong> ' + file.name); },
                       onUploadComplete : function(file, data){ Form._interaction.success($('#apply form'), data); },
                       onError			 : function(file, fileType, data){ console.log(file); }
                   });
                   
                   $('#uploadifive-cv + span').appendTo('#uploadifive-cv');
               },

               _events: function(){
               },

               _events_unload: function(){
               },

               _interaction: function(){
                   return {
                       form: function(){
                           return {
                               
                           }
                       }()
                   }
               }()
           }
       }();
    
       
    /** Charity ******************************/
        var Charity = function(){
            return {
                _register: { sliders: {} },
                
                _init: function(){
                    this._base();
                    this._events();
                },

                _base: function(){
                    // Carousel
                        Charity._register.sliders.partners = new Drag($('#partner-logos'), { cursor: true, cursorText: 'Drag' });
                },
        
                _events: function(){
                    $(document).on('mousedown', '#partner-logos ul:not(.sliding) li', function(){ Charity._interaction.partners.mousedown($(this)); });
                    $(document).on('mouseup', '#partner-logos ul:not(.sliding) li', function(){ Charity._interaction.partners.mouseup($(this)); });
                },
                
                _events_unload: function(){
                    Charity._register.sliders.partners._unload();
                    
                    $(document).off('mousedown', '#partner-logos ul:not(.sliding) li');
                    $(document).off('mouseup', '#partner-logos ul:not(.sliding) li');
                },

                _interaction: function(){
                    return {
                        partners: function(){
                            return {
                                mousedown: function($li){
                                    $('#partner-logos').prop('link', $li.find('a'));
                                },
                                
                                mouseup: function($li){
                                    if ($('#partner-logos').prop('link'))
                                    {
                                        window.open($('#partner-logos').prop('link').attr('href'), '_blank').focus();
                                        $('#partner-logos').removeProp('link');
                                    }
                                },
                            }
                        }()
                    }
                }()
            }
        }();
       
       
   /** Culture ******************************/
       var Culture = function(){
           return {
               _register: { sliders: {} },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#culture-hero div.para'));
                       Global._functions.above_the_fold($('#culture-hero figure'), 'reveal');
                       Global._functions.above_the_fold($('#culture-hero div.flex div.para'), 'fade-up');
                   
                   // Carousel
                       Culture._register.sliders.charities = new Drag($('#charities div'), { cursor: true, cursorText: 'Drag' });
               },
       
               _events: function(){
                   $(document).on('mousedown', '#charity-logos ul:not(.sliding) li', function(){ Culture._interaction.charities.mousedown($(this)); });
                   $(document).on('mouseup', '#charity-logos ul:not(.sliding) li', function(){ Culture._interaction.charities.mouseup($(this)); });
               },
               
               _events_unload: function(){
                   Culture._register.sliders.charities._unload();
                   
                   $(document).off('mousedown', '#charity-logos ul:not(.sliding) li');
                   $(document).off('mouseup', '#charity-logos ul:not(.sliding) li');
               },

               _interaction: function(){
                   return {
                       charities: function(){
                           return {
                               mousedown: function($li){
                                   $('#charity-logos').prop('link', $li.find('a'));
                               },
                               
                               mouseup: function($li){
                                   if ($('#charity-logos').prop('link'))
                                   {
                                       window.open($('#charity-logos').prop('link').attr('href'), '_blank').focus();
                                       $('#charity-logos').removeProp('link');
                                   }
                               },
                           }
                       }()
                   }
               }()
           }
       }();  
       
   /** News ******************************/
       var News = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   this._interaction.filter($('button[action="news.filters"].active'));
               },

               _events: function(){
                   $(document).on('click', 'button[action="news.filter"]', function(){ News._interaction.filter($(this)); });
               },

               _events_unload: function(){
                   $(document).off('click', 'button[action="news.filter"]');
               },

               _interaction: function(){
                   return {
                       filter: function($filter){
                           $filter.addClass('active').siblings().removeClass('active');
                           
                           let filter = $filter.attr('filter');
                           
                           // Fade out
                               $('#news-hero, #news-articles').addClass('filter-transition');
                           
                           // Filter content
                               setTimeout(function(){
                                   $('#news-hero').toggleClass('filtered', !!filter);
                                   $('#news-articles div.container').removeClass('reveal');
                                   $('#news-articles ul li').removeClass('filtered').removeAttr('position')
                                                            .filter('[category!="' + filter + '"]').toggleClass('filtered', !!filter);
                                   
                                   if (!filter)
                                       $('#news-articles ul li[featured-article]').addClass('filtered');
                                   
                                   $('#news-articles ul li:not(.filtered)').each(function(index, value){
                                        $(this).attr({ position: (index % 12) + 1, slot_2: index % 2, slot_3: index % 3 });
                                    }).not(':lt(12)').addClass('infinite');
                               }, 600);
                           
                           // Fade in
                               setTimeout(function(){
                                   $('#news-hero, #news-articles').removeClass('filter-transition');
                                   $('#news-articles div.container').addClass('reveal');
                                   
                                   SmoothScroll._resize(false, false, true);
                               }, 800);
                       }
                   }
               }()
           }
       }();
       
       
   /** News Article ******************************/
       var NewsArticle = function(){
           return {
               _register: { sliders: {} },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#article-body article > *:first-child'));
                       
                   NewsArticle._register.sliders.more_news = new Drag($('#more-news div.carousel'), { cursor: true, cursorText: 'Drag' });
               },
       
               _events: function(){
               },

               _events_unload: function(){
                   NewsArticle._register.sliders.more_news._unload();
               }
           }
       }();
       
       
       
   /** Portfolio ******************************/
       var Portfolio = function(){
           return {
               _register: { hover: { active: false, currentX: 0, currentY: 0, targetX: 0, targetY: 0 } },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#portfolio-projects div.container'), 'fade-up');
                       
                       if ($('#investment-strategy').length)
                       {
                           Global._functions.above_the_fold($('#investment-strategy h2'), 'reveal', true);
                           Global._functions.above_the_fold($('#investment-strategy p.bullet'), 'reveal', true);
                           Global._functions.above_the_fold($('#investment-strategy figure'), 'reveal', true);
                       }
                       
                       
                   // Initialize Portfolio Filters
                       Portfolio._functions.filter.split();
               },
       
               _events: function(){
                   $(document).on('click', 'button[action="portfolio.filter"]', function(){ Portfolio._interaction.filter($(this)); });
               },

               _events_unload: function(){
                   $(document).off('click', 'button[action="portfolio.filter"]');
               },
               
               _functions: function(){
                   return {
                       filter: function(){
                           return {
                               consolidate: function(){
                                   $('.portfolio-projects.extended li').appendTo('.portfolio-projects:not(.extended) ul')
                               },
                               
                               split: function(){
                                   $('.portfolio-projects:not(.extended) li:not(.filtered):gt(5)').appendTo('.portfolio-projects.extended ul');
                                   $('.portfolio-projects').each(function(){
                                       $(this).find('li:not(.filtered)').each(function(index, value){
                                           $(this).attr({ count: index + 1, position: (index % 6) + 1 });
                                       });
                                   });
                                   
                                   $('#extended-portfolio').toggleClass('filtered', !$('.portfolio-projects.extended li:not(.filtered)').length);
                               }
                           }
                       }(),
                               
                       round(n, p) {
                           var p = (typeof p === 'undefined') ? 100 : Math.pow(10, p);
                           return Math.round(n * p) / p;
                       }
                   }
               }(),

               _interaction: function(){
                   return {
                       filter: function($filter){
                           $filter.addClass('active').siblings().removeClass('active');
                           
                           let filter = $filter.attr('filter');
                           
                           // Fade out
                               $('.portfolio-projects').addClass('filter-transition');
                           
                           // Filter content
                               setTimeout(function(){
                                   Portfolio._functions.filter.consolidate();
                                   
                                   $('#portfolio-projects div.container').removeClass('reveal above-the-fold');
                                   $('.portfolio-projects li').removeClass('filtered')
                                                              .removeAttr('position count')
                                                              .filter('[status!="' + filter + '"]').toggleClass('filtered', !!filter);
                               
                                   Portfolio._functions.filter.split();
                               }, 600);
                           
                           // Fade in
                               setTimeout(function(){
                               $('.portfolio-projects').removeClass('filter-transition');
                               $('#portfolio-projects div.container').addClass('reveal');
                                   
                                   SmoothScroll._resize(false, false, true);
                               }, 800);
                       }
                   }
               }()
           }
       }();
       
       
   /** Project ******************************/
       var Project = function(){
           return {
               _register: { sliders: {} },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#project-hero div.flex figure'), 'reveal');
                       
                   Project._register.sliders.more_projects = new Drag($('#more-projects div.carousel'), { cursor: true, cursorText: 'Drag' });
               },
       
               _events: function(){
               },

               _events_unload: function(){
                   Project._register.sliders.more_projects._unload();
               }
           }
       }();
       
       
       
   /** REIIF ******************************/
       var Reiif = function(){
           return {
               _register: { video: false },
               
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#reiif-hero strong.h3'), 'fade-up');
                   
                   // Vimeo
                       if (!Website._register.lighthouse && !Website._register.vimeo_sdk)
                       {
                           $('<script src="https://player.vimeo.com/api/player.js" async></script>').appendTo('body');
                           Website._register.vimeo_sdk = true;
                       }
               },

               _events: function(){
                   $(document).on('click', 'button[action="video.open"]', function(event){ Reiif._interaction.video.open(); });
                   $(document).on('click', 'button[action="video.close"]', function(event){ Reiif._interaction.video.close(); });
               },

               _events_unload: function(){
                   $(document).off('click', 'button[action="video.open"]');
                   $(document).off('click', 'button[action="video.close"]');
               },

               _interaction: function(){
                   return {
                       video: function(){
                           return {
                               open: function(){
                                   $('#reiif-video').addClass('active');
                                   
                                   if (!Reiif._register.video)
                                   {
                                       const iframe = $('#reiif-video iframe').get()[0];
                                       Reiif._register.player = new Vimeo.Player(iframe);
                                   }
                                   
                                   $('#reiif-video iframe').removeClass('reveal');
                                   
                                   Reiif._register.player.setCurrentTime(0);
                                   Reiif._register.player.setVolume(0);
                                   Reiif._register.player.play();
                                       
                                   setTimeout(function(){
                                       $('#reiif-video iframe').addClass('reveal');
                                       
                                       Reiif._register.player.setVolume(1);
                                   }, 600);
                               },
                               
                               close: function(){
                                   $('#reiif-video').removeClass('active');
                                   Reiif._register.player.pause();
                               }
                           }
                       }()
                   }
               }()
           }
       }();
       
       
       
   /** FUIOF ******************************/
       var Fuiof = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#fuiof-hero figure.fuiof-hero-image'));
               },

               _events: function(){
               },

               _events_unload: function(){
               },

               _interaction: function(){
                   return {
                       form: function(){
                           return {
                               
                           }
                       }()
                   }
               }()
           }
       }();
       
       
       
   /** Team ******************************/
       var Team = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
                   // Animations
                       Global._functions.above_the_fold($('#team-hero p.lg'), 'fade-up');
                       Global._functions.above_the_fold($('#team-hero p.sm'), 'fade-up');
                       Global._functions.above_the_fold($('#team-hero figure:first-of-type'));
                       
                   // Team member
                       if ($('#team-member').attr('active'))
                           setTimeout(function(){ Team._interaction.team_member.open(false, false); }, 1300);
               },

               _events: function(){
                   $(document).on('click', 'a.team-member', function(event){ Team._interaction.team_member.open($(this).parent(), event); });
                   $(document).on('click', 'button[action="team-member.close"]', function(event){ Team._interaction.team_member.close(); });
               },

               _events_unload: function(){
                   $(document).off('click', 'a.team-member');
                   $(document).off('click', 'button[action="team-member.close"]');
               },

               _interaction: function(){
                   return {
                       team_member: function(){
                           return {
                               open: function($member, event){
                                   $('#team-member').addClass('active')
                                                    .attr('group', $member.parents('section').attr('id'));
                                   
                                   if ($member)
                                   {
                                       $('#team-member').find('figure').empty().append($member.find('img').clone()).end()
                                                        .find('div.container').empty().append($member.find('div').children().clone());
                                   }
                                   
                                   $('#team-member').find('figure').removeClass('reveal');
                                   setTimeout(function(){ $('#team-member [activate]').addClass('reveal'); }, 200);
                           
                                   $('#team-member').stop().animate({ 'scrollTop': 0 }, 0);
                                   
                                   if (event)
                                       event.preventDefault();
                               },
                               
                               close: function(){
                                   $('#team-member').removeClass('active');
                               }
                           }
                       }()
                   }
               }()
           }
       }();
       
       
       

/**** Modules ******************************************************************************************/

   /** Form ******************************/
       var Form = function(){
           return {
               _init: function(){
                   this._base();
                   this._events();
               },

               _base: function(){
               },

               _events: function(){
                   // Form submission
                       $(document).on('mousemove', 'form[controller="form"]', function(event){ $(document).off('mousemove', $(this)); $(this).attr('action', $(this).attr('handler')); });
                       $(document).on('submit', 'form[controller="form"]', function(event){ Form._interaction.post($(this), false, false); event.preventDefault(); });

                   // Form labels
                       $(document).on('keyup', 'form[controller="form"] input, form[controller="form"] select, form[controller="form"] textarea', function(){ Form._interaction.controls.label($(this)); });

                   // Expanding textarea
                       $(document).on('keydown', 'form[controller="form"] textarea[auto-expand]', function(){ Form._interaction.controls.textarea($(this)); });
                   
                   // Field toggles
                       $(document).on('change', 'input[type="checkbox"][toggle]', function(){ Form._interaction.controls.toggle._init($(this)); });
               },

               _events_unload: function(){
               },

               _interaction: function(){
                   return {
                       controls: function(){
                           return {
                               label: function($field){
                                   $field.parents('fieldset').toggleClass('active', !!$field.val());
                               },

                               textarea: function($textarea){
                                   setTimeout(function(){
                                       $textarea.css('height', 'auto');
                                       $textarea.css('height', ($textarea.prop('scrollHeight') + 2) + 'px');
                                   }, 0);
                               },
                               
                               toggle: function(){
                                   return {
                                       _init: function($checkbox){
                                           $div = $('div[toggle="' + $checkbox.attr('name') + '"]');
       
                                           clearTimeout($div.prop('animate'));
                                           clearTimeout($div.prop('activate'));
                                           
                                           this[!$checkbox.prop('checked') ? 'deactivate' : 'activate']($div);
                                       },
       
                                       activate: function($div){
                                           $div.addClass('animate').css('height', $div.find('div').height())
       
                                           $div.prop('activate', setTimeout(function(){ $div.addClass('active'); }, 1));
                                           $div.prop('animate', setTimeout(function(){ $div.removeClass('animate'); }, 410));
                                           setTimeout(function(){ $div.removeAttr('style'); }, 420);
                                       },
       
                                       deactivate: function($div){
                                           $div.css('height', $div.find('div').height());
       
                                           $div.prop('activate', setTimeout(function(){
                                               $div.addClass('animate')
                                                   .removeClass('active')
                                                   .removeAttr('style');
                                           }, 10));
       
                                           $div.prop('animate', setTimeout(function(){ $div.removeClass('animate'); }, 430));
                                       }	
                                   }
                               }()
                           }
                       }(),

                       post: function($form, action, data){
                           if ($form.prop('processing'))
                               return;

                           $form.prop('processing', true);
                           
                           
                           $form.find('fieldset.error').removeClass('error')
                                .find('span.error').addClass('hide').each(function(){
                                    $error = $(this);
                                    setTimeout(function(){ $error.remove(); }, 200);
                                });
                           
                           if ($('#queue').children().length)
                           {								
                               var fields = { };
                               $.each($('#apply form').serializeArray(), function() { fields[this.name] = this.value; });
                               
                               console.log(fields);
                               
                               $('#cv').data('uploadifive').settings.formData = fields;
                               $('#cv').uploadifive('upload'); 
                           }
                           else
                               $.post(action ? action : $form.attr('action'), data ? data : $form.serialize(), function(response){ Form._interaction.success($form, response); });
                       },
                       
                       success: function($form, response){
                           console.log(response);
                           $form.removeProp('processing');
                           
                           $response = $.parseJSON(response);

                           if ($response.status == 'ok')
                           {
                               switch ($response.data.action)
                               {
                                   case 'thank-you':
                                       Global._interaction.form.success($form);
                                       break;				
                               }
                           }
                           else
                               Form._interaction.errors($form, $response.data);
                       },

                       errors: function($form, $errors){
                           console.log($errors);

                           $.each($errors, function(index, error){
                               error = error.toString().split(':');

                               if (error[0].indexOf('{') > -1)
                               {
                                   error[0] = error[0].split('{');
                                   error[0][1] = error[0][1].substring(0, error[0][1].length - 1);
                               }
                               else
                                   error[0] = [error[0], '0'];


                               if ($form.find('[name="' + error[0][0] + '"]').length)
                                   $form.find('[name="' + error[0][0] + '"]:eq(' + error[0][1] + ')').parents('fieldset').addClass('error').append('<span class="error">' + error[1] + '</span>');
                               else if (error[0][0] == 'alert')
                                   alert(error[1]);
                                   
                               if (!index)
                                   Global._interaction.goto($form.find('[name^="' + error[0][0] + '"]:eq(' + error[0][1] + ')').parents('fieldset').get()[0]);
                           });
                           
                           
                       }
                   }
               }(),
           }
       }();


/**** Dependencies ******************************************************************************************/

   /** Eases ******************************/
       jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4}else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b}});

   /** jQuery Mobile v1.4.5 ******************************/
       (function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,n,r){function T(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function N(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=T(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function C(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function k(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function L(){g=!1}function A(){g=!0}function O(){E=0,v.length=0,m=!1,A()}function M(){L()}function _(){D(),c=setTimeout(function(){c=0,O()},e.vmouse.resetTimerDuration)}function D(){c&&(clearTimeout(c),c=0)}function P(t,n,r){var i;if(r&&r[t]||!r&&k(n.target,t))i=N(n,t),e(n.target).trigger(i);return i}function H(t){var n=e.data(t.target,s),r;!m&&(!E||E!==n)&&(r=P("v"+t.type,t),r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation()))}function B(t){var n=T(t).touches,r,i,o;n&&n.length===1&&(r=t.target,i=C(r),i.hasVirtualBinding&&(E=w++,e.data(r,s,E),D(),M(),d=!1,o=T(t).touches[0],h=o.pageX,p=o.pageY,P("vmouseover",t,i),P("vmousedown",t,i)))}function j(e){if(g)return;d||P("vmousecancel",e,C(e.target)),d=!0,_()}function F(t){if(g)return;var n=T(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=C(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&P("vmousecancel",t,s),P("vmousemove",t,s),_()}function I(e){if(g)return;A();var t=C(e.target),n,r;P("vmouseup",e,t),d||(n=P("vclick",e,t),n&&n.isDefaultPrevented()&&(r=T(e).changedTouches[0],v.push({touchID:E,x:r.clientX,y:r.clientY}),m=!0)),P("vmouseout",e,t),d=!1,_()}function q(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function R(){}function U(t){var n=t.substr(1);return{setup:function(){q(this)||e.data(this,i,{});var r=e.data(this,i);r[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,H),e(this).bind(n,R),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",B).bind("touchend",I).bind("touchmove",F).bind("scroll",j))},teardown:function(){--l[t],l[t]||b.unbind(n,H),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",B).unbind("touchmove",F).unbind("touchend",I).unbind("scroll",j));var r=e(this),s=e.data(this,i);s&&(s[t]=!1),r.unbind(n,R),q(this)||r.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S,x;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(x=0;x<o.length;x++)e.event.special[o[x]]=U(o[x]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)})(e,t,n),function(e){e.mobile={}}(e),function(e,t){var r={touch:"ontouchend"in n};e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,t,r){function l(t,n,i,s){var o=i.type;i.type=n,s?e.event.trigger(i,r,t):e.event.dispatch.call(t,i),i.type=o}var i=e(n),s=e.mobile.support.touch,o="touchmove scroll",u=s?"touchstart":"mousedown",a=s?"touchend":"mouseup",f=s?"touchmove":"mousemove";e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)}),e.event.special.scrollstart={enabled:!0,setup:function(){function s(e,n){r=n,l(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(o,function(t){if(!e.event.special.scrollstart.enabled)return;r||s(t,!0),clearTimeout(i),i=setTimeout(function(){s(t,!1)},50)})},teardown:function(){e(this).unbind(o)}},e.event.special.tap={tapholdThreshold:750,emitTapOnTaphold:!0,setup:function(){var t=this,n=e(t),r=!1;n.bind("vmousedown",function(s){function a(){clearTimeout(u)}function f(){a(),n.unbind("vclick",c).unbind("vmouseup",a),i.unbind("vmousecancel",f)}function c(e){f(),!r&&o===e.target?l(t,"tap",e):r&&e.preventDefault()}r=!1;if(s.which&&s.which!==1)return!1;var o=s.target,u;n.bind("vmouseup",a).bind("vclick",c),i.bind("vmousecancel",f),u=setTimeout(function(){e.event.special.tap.emitTapOnTaphold||(r=!0),l(t,"taphold",e.Event("taphold",{target:o}))},e.event.special.tap.tapholdThreshold)})},teardown:function(){e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),i.unbind("vmousecancel")}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:30,getLocation:function(e){var n=t.pageXOffset,r=t.pageYOffset,i=e.clientX,s=e.clientY;if(e.pageY===0&&Math.floor(s)>Math.floor(e.pageY)||e.pageX===0&&Math.floor(i)>Math.floor(e.pageX))i-=n,s-=r;else if(s<e.pageY-r||i<e.pageX-n)i=e.pageX-n,s=e.pageY-r;return{x:i,y:s}},start:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y],origin:e(t.target)}},stop:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y]}},handleSwipe:function(t,n,r,i){if(n.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-n.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-n.coords[1])<e.event.special.swipe.verticalDistanceThreshold){var s=t.coords[0]>n.coords[0]?"swipeleft":"swiperight";return l(r,"swipe",e.Event("swipe",{target:i,swipestart:t,swipestop:n}),!0),l(r,s,e.Event(s,{target:i,swipestart:t,swipestop:n}),!0),!0}return!1},eventInProgress:!1,setup:function(){var t,n=this,r=e(n),s={};t=e.data(this,"mobile-events"),t||(t={length:0},e.data(this,"mobile-events",t)),t.length++,t.swipe=s,s.start=function(t){if(e.event.special.swipe.eventInProgress)return;e.event.special.swipe.eventInProgress=!0;var r,o=e.event.special.swipe.start(t),u=t.target,l=!1;s.move=function(t){if(!o||t.isDefaultPrevented())return;r=e.event.special.swipe.stop(t),l||(l=e.event.special.swipe.handleSwipe(o,r,n,u),l&&(e.event.special.swipe.eventInProgress=!1)),Math.abs(o.coords[0]-r.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault()},s.stop=function(){l=!0,e.event.special.swipe.eventInProgress=!1,i.off(f,s.move),s.move=null},i.on(f,s.move).one(a,s.stop)},r.on(u,s.start)},teardown:function(){var t,n;t=e.data(this,"mobile-events"),t&&(n=t.swipe,delete t.swipe,t.length--,t.length===0&&e.removeData(this,"mobile-events")),n&&(n.start&&e(this).off(u,n.start),n.move&&i.off(f,n.move),n.stop&&i.off(a,n.stop))}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe.left",swiperight:"swipe.right"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)},teardown:function(){e(this).unbind(n)}}})}(e,this),function(e,t,n){e.extend(e.mobile,{version:"1.4.5",subPageUrlKey:"ui-page",hideUrlBar:!0,keepNative:":jqmData(role='none'), :jqmData(role='nojs')",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:!0,hashListeningEnabled:!0,linkBindingEnabled:!0,defaultPageTransition:"fade",maxTransitionWidth:!1,minScrollBack:0,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"a",phonegapNavigationEnabled:!1,autoInitializePage:!0,pushStateEnabled:!0,ignoreContentEnabled:!1,buttonMarkup:{hoverDelay:200},dynamicBaseEnabled:!0,pageContainer:e(),allowCrossDomainPages:!1,dialogHashKey:"&ui-state=dialog"})}(e,this),function(e,t,n){var r={},i=e.find,s=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,o=/:jqmData\(([^)]*)\)/g;e.extend(e.mobile,{ns:"",getAttribute:function(t,n){var r;t=t.jquery?t[0]:t,t&&t.getAttribute&&(r=t.getAttribute("data-"+e.mobile.ns+n));try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:s.test(r)?JSON.parse(r):r}catch(i){}return r},nsNormalizeDict:r,nsNormalize:function(t){return r[t]||(r[t]=e.camelCase(e.mobile.ns+t))},closestPageData:function(e){return e.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page")}}),e.fn.jqmData=function(t,r){var i;return typeof t!="undefined"&&(t&&(t=e.mobile.nsNormalize(t)),arguments.length<2||r===n?i=this.data(t):i=this.data(t,r)),i},e.jqmData=function(t,n,r){var i;return typeof n!="undefined"&&(i=e.data(t,n?e.mobile.nsNormalize(n):n,r)),i},e.fn.jqmRemoveData=function(t){return this.removeData(e.mobile.nsNormalize(t))},e.jqmRemoveData=function(t,n){return e.removeData(t,e.mobile.nsNormalize(n))},e.find=function(t,n,r,s){return t.indexOf(":jqmData")>-1&&(t=t.replace(o,"[data-"+(e.mobile.ns||"")+"$1]")),i.call(this,t,n,r,s)},e.extend(e.find,i)}(e,this),function(e,t){function s(t,n){var r,i,s,u=t.nodeName.toLowerCase();return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(s=e("img[usemap=#"+i+"]")[0],!!s&&o(s))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&o(t)}function o(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return e.css(this,"visibility")==="hidden"}).length}var r=0,i=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"c0ab71056b936627e8a7821f03c044aec6280a40",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(n,r){return typeof n=="number"?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),r&&r.call(t)},n)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(this[0].ownerDocument||n):t},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++r)})},removeUniqueId:function(){return this.each(function(){i.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,r){return!!e.data(t,r[3])},focusable:function(t){return s(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);return(r||n>=0)&&s(t,!r)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0)}),n}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px")})},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(n){return arguments.length?t.call(this,e.camelCase(n)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in n.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(r){if(r!==t)return this.css("zIndex",r);if(this.length){var i=e(this[0]),s,o;while(i.length&&i[0]!==n){s=i.css("position");if(s==="absolute"||s==="relative"||s==="fixed"){o=parseInt(i.css("zIndex"),10);if(!isNaN(o)&&o!==0)return o}i=i.parent()}}return 0}}),e.ui.plugin={add:function(t,n,r){var i,s=e.ui[t].prototype;for(i in r)s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]])},call:function(e,t,n,r){var i,s=e.plugins[t];if(!s)return;if(!r&&(!e.element[0].parentNode||e.element[0].parentNode.nodeType===11))return;for(i=0;i<s.length;i++)e.options[s[i][0]]&&s[i][1].apply(e.element,n)}}}(e),function(e,t,r){var i=function(t,n){var r=t.parent(),i=[],s=function(){var t=e(this),n=e.mobile.toolbar&&t.data("mobile-toolbar")?t.toolbar("option"):{position:t.attr("data-"+e.mobile.ns+"position"),updatePagePadding:t.attr("data-"+e.mobile.ns+"update-page-padding")!==!1};return n.position!=="fixed"||n.updatePagePadding!==!0},o=r.children(":jqmData(role='header')").filter(s),u=t.children(":jqmData(role='header')"),a=r.children(":jqmData(role='footer')").filter(s),f=t.children(":jqmData(role='footer')");return u.length===0&&o.length>0&&(i=i.concat(o.toArray())),f.length===0&&a.length>0&&(i=i.concat(a.toArray())),e.each(i,function(t,r){n-=e(r).outerHeight()}),Math.max(0,n)};e.extend(e.mobile,{window:e(t),document:e(n),keyCode:e.ui.keyCode,behaviors:{},silentScroll:function(n){e.type(n)!=="number"&&(n=e.mobile.defaultHomeScroll),e.event.special.scrollstart.enabled=!1,setTimeout(function(){t.scrollTo(0,n),e.mobile.document.trigger("silentscroll",{x:0,y:n})},20),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},getClosestBaseUrl:function(t){var n=e(t).closest(".ui-page").jqmData("url"),r=e.mobile.path.documentBase.hrefNoHash;if(!e.mobile.dynamicBaseEnabled||!n||!e.mobile.path.isPath(n))n=r;return e.mobile.path.makeUrlAbsolute(n,r)},removeActiveLinkClass:function(t){!!e.mobile.activeClickedLink&&(!e.mobile.activeClickedLink.closest("."+e.mobile.activePageClass).length||t)&&e.mobile.activeClickedLink.removeClass(e.mobile.activeBtnClass),e.mobile.activeClickedLink=null},getInheritedTheme:function(e,t){var n=e[0],r="",i=/ui-(bar|body|overlay)-([a-z])\b/,s,o;while(n){s=n.className||"";if(s&&(o=i.exec(s))&&(r=o[2]))break;n=n.parentNode}return r||t||"a"},enhanceable:function(e){return this.haveParents(e,"enhance")},hijackable:function(e){return this.haveParents(e,"ajax")},haveParents:function(t,n){if(!e.mobile.ignoreContentEnabled)return t;var r=t.length,i=e(),s,o,u,a,f;for(a=0;a<r;a++){o=t.eq(a),u=!1,s=t[a];while(s){f=s.getAttribute?s.getAttribute("data-"+e.mobile.ns+n):"";if(f==="false"){u=!0;break}s=s.parentNode}u||(i=i.add(o))}return i},getScreenHeight:function(){return t.innerHeight||e.mobile.window.height()},resetActivePageHeight:function(t){var n=e("."+e.mobile.activePageClass),r=n.height(),s=n.outerHeight(!0);t=i(n,typeof t=="number"?t:e.mobile.getScreenHeight()),n.css("min-height",""),n.height()<t&&n.css("min-height",t-(s-r))},loading:function(){var t=this.loading._widget||e(e.mobile.loader.prototype.defaultHtml).loader(),n=t.loader.apply(t,arguments);return this.loading._widget=t,n}}),e.addDependents=function(t,n){var r=e(t),i=r.jqmData("dependents")||e();r.jqmData("dependents",e(i).add(n))},e.fn.extend({removeWithDependents:function(){e.removeWithDependents(this)},enhanceWithin:function(){var t,n={},r=e.mobile.page.prototype.keepNativeSelector(),i=this;e.mobile.nojs&&e.mobile.nojs(this),e.mobile.links&&e.mobile.links(this),e.mobile.degradeInputsWithin&&e.mobile.degradeInputsWithin(this),e.fn.buttonMarkup&&this.find(e.fn.buttonMarkup.initSelector).not(r).jqmEnhanceable().buttonMarkup(),e.fn.fieldcontain&&this.find(":jqmData(role='fieldcontain')").not(r).jqmEnhanceable().fieldcontain(),e.each(e.mobile.widgets,function(t,s){if(s.initSelector){var o=e.mobile.enhanceable(i.find(s.initSelector));o.length>0&&(o=o.not(r)),o.length>0&&(n[s.prototype.widgetName]=o)}});for(t in n)n[t][t]();return this},addDependents:function(t){e.addDependents(this,t)},getEncodedText:function(){return e("<a>").text(this.text()).html()},jqmEnhanceable:function(){return e.mobile.enhanceable(this)},jqmHijackable:function(){return e.mobile.hijackable(this)}}),e.removeWithDependents=function(t){var n=e(t);(n.jqmData("dependents")||e()).remove(),n.remove()},e.addDependents=function(t,n){var r=e(t),i=r.jqmData("dependents")||e();r.jqmData("dependents",e(i).add(n))},e.find.matches=function(t,n){return e.find(t,null,null,n)},e.find.matchesSelector=function(t,n){return e.find(n,null,null,[t]).length>0}}(e,this),function(e,r){t.matchMedia=t.matchMedia||function(e,t){var n,r=e.documentElement,i=r.firstElementChild||r.firstChild,s=e.createElement("body"),o=e.createElement("div");return o.id="mq-test-1",o.style.cssText="position:absolute;top:-100em",s.style.background="none",s.appendChild(o),function(e){return o.innerHTML='&shy;<style media="'+e+'"> #mq-test-1 { width: 42px; }</style>',r.insertBefore(s,i),n=o.offsetWidth===42,r.removeChild(s),{matches:n,media:e}}}(n),e.mobile.media=function(e){return t.matchMedia(e).matches}}(e),function(e,n){e.extend(e.support,{orientation:"orientation"in t&&"onorientationchange"in t})}(e),function(e,r){function i(e){var t=e.charAt(0).toUpperCase()+e.substr(1),n=(e+" "+u.join(t+" ")+t).split(" "),i;for(i in n)if(o[n[i]]!==r)return!0}function h(){var n=t,r=!!n.document.createElementNS&&!!n.document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect&&(!n.opera||navigator.userAgent.indexOf("Chrome")!==-1),i=function(t){(!t||!r)&&e("html").addClass("ui-nosvg")},s=new n.Image;s.onerror=function(){i(!1)},s.onload=function(){i(s.width===1&&s.height===1)},s.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}function p(){var i="transform-3d",o=e.mobile.media("(-"+u.join("-"+i+"),(-")+"-"+i+"),("+i+")"),a,f,l;if(o)return!!o;a=n.createElement("div"),f={MozTransform:"-moz-transform",transform:"transform"},s.append(a);for(l in f)a.style[l]!==r&&(a.style[l]="translate3d( 100px, 1px, 1px )",o=t.getComputedStyle(a).getPropertyValue(f[l]));return!!o&&o!=="none"}function d(){var t=location.protocol+"//"+location.host+location.pathname+"ui-dir/",n=e("head base"),r=null,i="",o,u;return n.length?i=n.attr("href"):n=r=e("<base>",{href:t}).appendTo("head"),o=e("<a href='testurl' />").prependTo(s),u=o[0].href,n[0].href=i||location.pathname,r&&r.remove(),u.indexOf(t)===0}function v(){var e=n.createElement("x"),r=n.documentElement,i=t.getComputedStyle,s;return"pointerEvents"in e.style?(e.style.pointerEvents="auto",e.style.pointerEvents="x",r.appendChild(e),s=i&&i(e,"").pointerEvents==="auto",r.removeChild(e),!!s):!1}function m(){var e=n.createElement("div");return typeof e.getBoundingClientRect!="undefined"}function g(){var e=t,n=navigator.userAgent,r=navigator.platform,i=n.match(/AppleWebKit\/([0-9]+)/),s=!!i&&i[1],o=n.match(/Fennec\/([0-9]+)/),u=!!o&&o[1],a=n.match(/Opera Mobi\/([0-9]+)/),f=!!a&&a[1];return(r.indexOf("iPhone")>-1||r.indexOf("iPad")>-1||r.indexOf("iPod")>-1)&&s&&s<534||e.operamini&&{}.toString.call(e.operamini)==="[object OperaMini]"||a&&f<7458||n.indexOf("Android")>-1&&s&&s<533||u&&u<6||"palmGetResource"in t&&s&&s<534||n.indexOf("MeeGo")>-1&&n.indexOf("NokiaBrowser/8.5.0")>-1?!1:!0}var s=e("<body>").prependTo("html"),o=s[0].style,u=["Webkit","Moz","O"],a="palmGetResource"in t,f=t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]",l=t.blackberry&&!i("-webkit-transform"),c;e.extend(e.mobile,{browser:{}}),e.mobile.browser.oldIE=function(){var e=3,t=n.createElement("div"),r=t.all||[];do t.innerHTML="<!--[if gt IE "+ ++e+"]><br><![endif]-->";while(r[0]);return e>4?e:!e}(),e.extend(e.support,{pushState:"pushState"in history&&"replaceState"in history&&!(t.navigator.userAgent.indexOf("Firefox")>=0&&t.top!==t)&&t.navigator.userAgent.search(/CriOS/)===-1,mediaquery:e.mobile.media("only all"),cssPseudoElement:!!i("content"),touchOverflow:!!i("overflowScrolling"),cssTransform3d:p(),boxShadow:!!i("boxShadow")&&!l,fixedPosition:g(),scrollTop:("pageXOffset"in t||"scrollTop"in n.documentElement||"scrollTop"in s[0])&&!a&&!f,dynamicBaseTag:d(),cssPointerEvents:v(),boundingRect:m(),inlineSVG:h}),s.remove(),c=function(){var e=t.navigator.userAgent;return e.indexOf("Nokia")>-1&&(e.indexOf("Symbian/3")>-1||e.indexOf("Series60/5")>-1)&&e.indexOf("AppleWebKit")>-1&&e.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}(),e.mobile.gradeA=function(){return(e.support.mediaquery&&e.support.cssPseudoElement||e.mobile.browser.oldIE&&e.mobile.browser.oldIE>=8)&&(e.support.boundingRect||e.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)!==null)},e.mobile.ajaxBlacklist=t.blackberry&&!t.WebKitPoint||f||c,c&&e(function(){e("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")}),e.support.boxShadow||e("html").addClass("ui-noboxshadow")}(e)});
       
   /** Uploadifive ******************************/
       !function(e){var t={init:function(r){return this.each(function(){var n=e(this);n.data("uploadifive",{inputs:{},inputCount:0,fileID:0,queue:{count:0,selected:0,replaced:0,errors:0,queued:0,cancelled:0},uploads:{current:0,attempts:0,successful:0,errors:0,count:0}});var o=n.data("uploadifive"),a=o.settings=e.extend({auto:!0,buttonClass:!1,buttonText:"Select Files",checkScript:!1,dnd:!0,dropTarget:!1,fileObjName:"Filedata",fileSizeLimit:0,fileType:!1,formData:{},height:30,itemTemplate:!1,method:"post",multi:!0,overrideEvents:[],queueID:!1,queueSizeLimit:0,removeCompleted:!1,simUploadLimit:0,truncateLength:0,uploadLimit:0,uploadScript:"uploadifive.php",width:100},r);if(isNaN(a.fileSizeLimit)){var u=1.024*parseInt(a.fileSizeLimit);a.fileSizeLimit.indexOf("KB")>-1?a.fileSizeLimit=1e3*u:a.fileSizeLimit.indexOf("MB")>-1?a.fileSizeLimit=1e6*u:a.fileSizeLimit.indexOf("GB")>-1&&(a.fileSizeLimit=1e9*u)}else a.fileSizeLimit=1024*a.fileSizeLimit;if(o.inputTemplate=e(this).css({opacity:0,position:"absolute","z-index":999}),o.createInput=function(){var i=o.inputTemplate,r=i.name="input"+o.inputCount++;a.multi&&i.attr("multiple",!0),i.unbind("change"),i.bind("change",function(){o.queue.selected=0,o.queue.replaced=0,o.queue.errors=0,o.queue.queued=0;var i=this.files.length;if(o.queue.selected=i,o.queue.count+i>a.queueSizeLimit&&0!==a.queueSizeLimit)e.inArray("onError",a.overrideEvents)<0&&alert("The maximum number of queue items has been reached ("+a.queueSizeLimit+").  Please select fewer files."),"function"==typeof a.onError&&a.onError.call(n,"QUEUE_LIMIT_EXCEEDED");else{for(var u=0;u<i;u++)file=this.files[u],o.addQueueItem(file);o.inputs[r]=this,o.createInput()}a.auto&&t.upload.call(n),"function"==typeof a.onSelect&&a.onSelect.call(n,o.queue)}),o.currentInput&&o.currentInput.hide(),o.button.append(i),o.currentInput=i},o.destroyInput=function(t){e(o.inputs[t]).remove(),delete o.inputs[t],o.inputCount--},o.drop=function(i){o.queue.selected=0,o.queue.replaced=0,o.queue.errors=0,o.queue.queued=0;var r=i.dataTransfer,u=r.name="input"+o.inputCount++,l=r.files.length;if(o.queue.selected=l,o.queue.count+l>a.queueSizeLimit&&0!==a.queueSizeLimit)e.inArray("onError",a.overrideEvents)<0&&alert("The maximum number of queue items has been reached ("+a.queueSizeLimit+").  Please select fewer files."),"function"==typeof a.onError&&a.onError.call(n,"QUEUE_LIMIT_EXCEEDED");else{for(var s=0;s<l;s++)file=r.files[s],o.addQueueItem(file);o.inputs[u]=r}a.auto&&t.upload.call(n),"function"==typeof a.onDrop&&a.onDrop.call(n,r.files,r.files.length),i.preventDefault(),i.stopPropagation()},o.fileExistsInQueue=function(e){for(var t in o.inputs){input=o.inputs[t],limit=input.files.length;for(var i=0;i<limit;i++)if(existingFile=input.files[i],existingFile.name==e.name&&!existingFile.complete)return!0}return!1},o.removeExistingFile=function(i){for(var r in o.inputs){input=o.inputs[r],limit=input.files.length;for(var u=0;u<limit;u++)existingFile=input.files[u],existingFile.name!=i.name||existingFile.complete||(o.queue.replaced++,t.cancel.call(n,existingFile,!0),setTimeout(function(){e("#"+a.queueID+" div:not(:last-child)").remove()},10))}},0==a.itemTemplate?o.queueItem=e('<div class="uploadifive-queue-item">                        <a class="close" href="javascript:void(0);">&times;</a>                        <div class="filename"></div>                        <div class="progress progress-striped active">                            <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="fileinfo"></span></div>                        </div>                    </div>'):o.queueItem=e(a.itemTemplate),o.addQueueItem=function(i){if(e.inArray("onAddQueueItem",a.overrideEvents)<0){o.removeExistingFile(i),i.queueItem=o.queueItem.clone(),i.queueItem.attr("id",a.id+"-file-"+o.fileID++),i.queueItem.find(".close").bind("click",function(){return t.cancel.call(n,i),!1});var r=i.name;r.length>a.truncateLength&&0!=a.truncateLength&&(r=r.substring(0,a.truncateLength)+"..."),i.queueItem.find(".filename").html(r),i.queueItem.data("file",i),o.queueEl.append(i.queueItem)}if("function"==typeof a.onAddQueueItem&&a.onAddQueueItem.call(n,i),a.fileType)if(e.isArray(a.fileType)){for(var u=!1,l=0;l<a.fileType.length;l++)i.type.indexOf(a.fileType[l])>-1&&(u=!0);u||o.error("FORBIDDEN_FILE_TYPE",i)}else i.type.indexOf(a.fileType)<0&&o.error("FORBIDDEN_FILE_TYPE",i);i.size>a.fileSizeLimit&&0!=a.fileSizeLimit?o.error("FILE_SIZE_LIMIT_EXCEEDED",i):(o.queue.queued++,o.queue.count++)},o.removeQueueItem=function(e,t,i){i||(i=0);e.queueItem&&("Completed"!=e.queueItem.find(".fileinfo").html()&&e.queueItem.find(".fileinfo").html("Cancelled"),e.queueItem.find(".progress div").css("width","100%").attr("aria-valuenow","100").removeClass().addClass("progress-bar progress-bar-danger"),e.queueItem.addClass("complete"),delete e.queueItem,o.queue.count--)},o.filesToUpload=function(){var e=0;for(var t in o.inputs){input=o.inputs[t],limit=input.files.length;for(var i=0;i<limit;i++)file=input.files[i],file.skip||file.complete||e++}return e},o.checkExists=function(i){if(e.inArray("onCheck",a.overrideEvents)<0){e.ajaxSetup({async:!1});var r=e.extend(a.formData,{filename:i.name});if(e.post(a.checkScript,r,function(e){i.exists=parseInt(e)}),i.exists&&!confirm("A file named "+i.name+" already exists in the upload folder.\nWould you like to replace it?"))return t.cancel.call(n,i),!0}return"function"==typeof a.onCheck&&a.onCheck.call(n,i,i.exists),!1},o.uploadFile=function(t,r){if(t.completed)t.completed=!1;else if(!t.skip&&!t.complete&&!t.uploading)if(t.uploading=!0,o.uploads.current++,o.uploads.attempted++,xhr=t.xhr=new XMLHttpRequest,"function"==typeof FormData||"object"==typeof FormData){var u=new FormData;for(i in u.append(a.fileObjName,t),a.formData)u.append(i,a.formData[i]);xhr.open(a.method,a.uploadScript,!0),xhr.upload.addEventListener("progress",function(e){e.lengthComputable&&o.progress(e,t)},!1),xhr.addEventListener("load",function(e){4==this.readyState&&(t.uploading=!1,200==this.status?"Invalid file type."!==t.xhr.responseText?o.uploadComplete(e,t,r):o.error(t.xhr.responseText,t,r):404==this.status?o.error("404_FILE_NOT_FOUND",t,r):403==this.status?o.error("403_FORBIDDEN",t,uplaodAll):o.error("Unknown Error",t,r))}),xhr.send(u)}else{var l=new FileReader;l.onload=function(i){var u="-------------------------"+(new Date).getTime(),l="\r\n",s="";for(key in s+="--"+u+l,s+='Content-Disposition: form-data; name="'+a.fileObjName+'"',t.name&&(s+='; filename="'+t.name+'"'),s+=l,s+="Content-Type: application/octet-stream\r\n\r\n",s+=i.target.result+l,a.formData)s+="--"+u+l,s+='Content-Disposition: form-data; name="'+key+'"'+l+l,s+=a.formData[key]+l;s+="--"+u+"--"+l,xhr.upload.addEventListener("progress",function(e){o.progress(e,t)},!1),xhr.addEventListener("load",function(e){t.uploading=!1,404==this.status?o.error("404_FILE_NOT_FOUND",t,r):"Invalid file type."!=t.xhr.responseText?o.uploadComplete(e,t,r):o.error(t.xhr.responseText,t,r)},!1);a.uploadScript;"get"==a.method&&e(a.formData).param();xhr.open(a.method,a.uploadScript,!0),xhr.setRequestHeader("Content-Type","multipart/form-data; boundary="+u),"function"==typeof a.onUploadFile&&a.onUploadFile.call(n,t),xhr.sendAsBinary(s)},l.readAsBinaryString(t)}},o.progress=function(t,i){if(e.inArray("onProgress",a.overrideEvents)<0){if(t.lengthComputable)var r=Math.round(t.loaded/t.total*100);i.queueItem.find(".fileinfo").html(r+"%"),i.queueItem.find(".progress-bar").removeClass().css("width",r+"%").attr("aria-valuenow",r),r<=25?i.queueItem.find(".progress div").addClass("progress-bar progress-bar-primary"):r>25&&r<=50?i.queueItem.find(".progress div").addClass("progress-bar progress-bar-info"):r>50&&r<=85?i.queueItem.find(".progress div").addClass("progress-bar progress-bar-primary"):i.queueItem.find(".progress div").addClass("progress-bar progress-bar-info")}"function"==typeof a.onProgress&&a.onProgress.call(n,i,t)},o.error=function(i,r,u){if(e.inArray("onError",a.overrideEvents)<0){switch(i){case"404_FILE_NOT_FOUND":errorMsg="404 Error";break;case"403_FORBIDDEN":errorMsg="403 Forbidden";break;case"FORBIDDEN_FILE_TYPE":errorMsg="Forbidden File Type";break;case"FILE_SIZE_LIMIT_EXCEEDED":errorMsg="File Too Large";break;default:errorMsg="Unknown Error"}r.queueItem.addClass("error").find(".fileinfo").html(errorMsg),r.queueItem.find(".progress").remove()}"function"==typeof a.onError&&a.onError.call(n,i,r),"404_FILE_NOT_FOUND"==i?o.uploads.errors++:o.queue.errors++,u&&t.upload.call(n,null,!0)},o.uploadComplete=function(e,i,r){"function"==typeof a.onUploadComplete&&a.onUploadComplete.call(n,i,i.xhr.responseText),a.removeCompleted&&setTimeout(function(){t.cancel.call(n,i)},3e3),i.completed=!0,o.uploads.successful++,o.uploads.count++,o.uploads.current--,r&&t.upload.call(n,null,!0)},o.queueComplete=function(){"function"==typeof a.onQueueComplete&&a.onQueueComplete.call(n,o.uploads)},!(window.File&&window.FileList&&window.Blob&&(window.FileReader||window.FormData)))return"function"==typeof a.onFallback&&a.onFallback.call(n),!1;if(a.id="uploadifive-"+n.attr("id"),o.button=e('<div id="'+a.id+'" class="uploadifive-button btn btn-sm btn-success"></div>'),a.buttonClass&&o.button.addClass(a.buttonClass),n.before(o.button).appendTo(o.button).hide(),o.createInput.call(n),a.queueID?o.queueEl=e("#"+a.queueID):(a.queueID=a.id+"-queue",o.queueEl=e('<div id="'+a.queueID+'" class="uploadifive-queue" />'),o.button.after(o.queueEl)),a.dnd){var l=a.dropTarget?a.dropTarget.get(0):o.queueEl.get(0);l.addEventListener("dragleave",function(e){e.preventDefault(),e.stopPropagation()},!1),l.addEventListener("dragenter",function(e){e.preventDefault(),e.stopPropagation()},!1),l.addEventListener("dragover",function(e){e.preventDefault(),e.stopPropagation()},!1),l.addEventListener("drop",o.drop,!1)}XMLHttpRequest.prototype.sendAsBinary||(XMLHttpRequest.prototype.sendAsBinary=function(e){var t=Array.prototype.map.call(e,function(e){return 255&e.charCodeAt(0)}),i=new Uint8Array(t);this.send(i.buffer)}),"function"==typeof a.onInit&&a.onInit.call(n)})},debug:function(){return this.each(function(){console.log(e(this).data("uploadifive"))})},clearQueue:function(){this.each(function(){var r=e(this),n=r.data("uploadifive"),o=n.settings;for(var a in n.inputs)for(input=n.inputs[a],limit=input.files.length,i=0;i<limit;i++)file=input.files[i],t.cancel.call(r,file);"function"==typeof o.onClearQueue&&o.onClearQueue.call(r,e("#"+n.options.queueID))})},cancel:function(i,r){this.each(function(){var n=e(this),o=n.data("uploadifive"),a=o.settings;"string"==typeof i&&(isNaN(i)||(fileID="uploadifive-"+e(this).attr("id")+"-file-"+i),i=e("#"+fileID).data("file")),o.filesCancelled++,i.uploading&&(o.uploads.current--,i.uploading=!1,i.xhr.abort(),delete i.xhr,t.upload.call(n)),e.inArray("onCancel",a.overrideEvents)<0&&o.removeQueueItem(i,r),"function"==typeof a.onCancel&&a.onCancel.call(n,i)})},upload:function(t,i){this.each(function(){var r=e(this),n=r.data("uploadifive"),o=n.settings;if(t)n.uploadFile.call(r,t);else if(n.uploads.count+n.uploads.current<o.uploadLimit||0==o.uploadLimit){if(!i){n.uploads.attempted=0,n.uploads.successsful=0,n.uploads.errors=0;var a=n.filesToUpload();"function"==typeof o.onUpload&&o.onUpload.call(r,a)}e("#"+o.queueID).find(".uploadifive-queue-item").not(".error, .complete").each(function(){if(_file=e(this).data("file"),n.uploads.current>=o.simUploadLimit&&0!==o.simUploadLimit||n.uploads.current>=o.uploadLimit&&0!==o.uploadLimit||n.uploads.count>=o.uploadLimit&&0!==o.uploadLimit)return!1;o.checkScript?(_file.checking=!0,skipFile=n.checkExists(_file),_file.checking=!1,skipFile||n.uploadFile(_file,!0)):n.uploadFile(_file,!0)}),0==e("#"+o.queueID).find(".uploadifive-queue-item").not(".error, .complete").size()&&n.queueComplete()}else 0==n.uploads.current&&(e.inArray("onError",o.overrideEvents)<0&&n.filesToUpload()>0&&0!=o.uploadLimit&&alert("The maximum upload limit has been reached."),"function"==typeof o.onError&&o.onError.call(r,"UPLOAD_LIMIT_EXCEEDED",n.filesToUpload()))})},destroy:function(){this.each(function(){var i=e(this),r=i.data("uploadifive"),n=r.settings;t.clearQueue.call(i),n.queueID||e("#"+n.queueID).remove(),i.siblings("input").remove(),i.show().insertBefore(r.button),r.button.remove(),"function"==typeof n.onDestroy&&n.onDestroy.call(i)})}};e.fn.uploadifive=function(i){return t[i]?t[i].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof i&&i?void e.error("The method "+i+" does not exist in $.uploadify"):t.init.apply(this,arguments)}}(jQuery);
       
   /** Smooth Transitions ******************************/
   !function(t,n,e,o){"use strict";if(!n.history.pushState)return t.fn.smoothState=function(){return this},void(t.fn.smoothState.options={});if(!t.fn.smoothState){var r=t("html, body"),a=n.console,s={isExternal:function(t){var e=t.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);return"string"==typeof e[1]&&e[1].length>0&&e[1].toLowerCase()!==n.location.protocol||"string"==typeof e[2]&&e[2].length>0&&e[2].replace(new RegExp(":("+{"http:":80,"https:":443}[n.location.protocol]+")?$"),"")!==n.location.host},stripHash:function(t){return t.replace(/#.*/,"")},isHash:function(t,e){e=e||n.location.href;var o=t.indexOf("#")>-1,r=s.stripHash(t)===s.stripHash(e);return o&&r},translate:function(n){var e={dataType:"html",type:"GET"};return n="string"==typeof n?t.extend({},e,{url:n}):t.extend({},e,n)},shouldLoadAnchor:function(t,n,e){var o=t.prop("href");return!(s.isExternal(o)||s.isHash(o)||t.is(n)||t.prop("target")||void 0!==typeof e&&""!==e&&-1===t.prop("href").search(e))},clearIfOverCapacity:function(t,n){return Object.keys||(Object.keys=function(t){var n,e=[];for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.push(n);return e}),Object.keys(t).length>n&&(t={}),t},storePageIn:function(n,e,o,r,a){var s=t("<html></html>").append(t(o));return n[e]={status:"loaded",title:s.find("title").first().text(),html:s.find("#"+a),doc:o},r&&(n[e].classes=r),n},triggerAllAnimationEndEvent:function(n,e){e=" "+e||"";var o=0;n.on("animationstart webkitAnimationStart oanimationstart MSAnimationStart",function(e){t(e.delegateTarget).is(n)&&(e.stopPropagation(),o++)}),n.on("animationend webkitAnimationEnd oanimationend MSAnimationEnd",function(e){t(e.delegateTarget).is(n)&&(e.stopPropagation(),0==--o&&n.trigger("allanimationend"))}),n.on("allanimationend"+e,function(){o=0,s.redraw(n)})},redraw:function(t){t.height()}},i=function(o,i){var l,c=t(o),u=i.trigger_container,h=c.prop("id"),d=null,f=!1,p={},g=n.location.href,m=function(t){(t=t||!1)&&p.hasOwnProperty(t)?delete p[t]:p={},c.data("smoothState").cache=p},v=function(n,e){e=e||t.noop;var o=s.translate(n);if(!(p=s.clearIfOverCapacity(p,i.cacheLength)).hasOwnProperty(o.url)||void 0!==o.data){p[o.url]={status:"fetching"};var r=t.ajax(o);r.success(function(t){s.storePageIn(p,o.url,t,t.match(/body\sclass=['|"]([^'|"]*)['|"]/),h),c.data("smoothState").cache=p}),r.error(function(){p[o.url].status="error"}),e&&r.complete(e)}},y=function(o){var s="#"+h,l=p[o]?t(p[o].html.html()):null;l&&l.length?(e.title=p[o].title,c.data("smoothState").href=o,i.loadingClass&&r.removeClass(i.loadingClass),i.onReady.render(c,l,p[o].classes,p[o]?p[o].title:"",o),c.one("ss.onReadyEnd",function(){f=!1,i.onAfter(c,l,p[o].classes,o,p[o]?p[o].title:""),i.scroll&&function(){if(d){var n=t(d,c);if(n.length){var e=n.offset().top;r.scrollTop(e)}d=null}}()}),n.setTimeout(function(){c.trigger("ss.onReadyEnd")},i.onReady.duration)):!l&&i.debug&&a?a.warn("No element with an id of "+s+" in response from "+o+" in "+p):n.location=o},S=function(t,e,o){i.href=t.url;var l=s.translate(t);void 0===e&&(e=!0),void 0===o&&(o=!0);var u=!1,d=!1,f={loaded:function(){var t=u?"ss.onProgressEnd":"ss.onStartEnd";d&&u?d&&y(l.url):c.one(t,function(){y(l.url),o||m(l.url)}),e&&n.history.pushState({id:h},p[l.url].title,l.url),d&&!o&&m(l.url)},fetching:function(){u||(u=!0,c.one("ss.onStartEnd",function(){i.loadingClass&&r.addClass(i.loadingClass),i.onProgress.render(c),n.setTimeout(function(){c.trigger("ss.onProgressEnd"),d=!0},i.onProgress.duration)})),n.setTimeout(function(){p.hasOwnProperty(l.url)&&f[p[l.url].status]()},10)},error:function(){i.debug&&a?a.log("There was an error loading: "+l.url):n.location=l.url}};p.hasOwnProperty(l.url)||v(l),i.onStart.render(c),n.setTimeout(function(){i.scroll&&r.scrollTop(0),c.trigger("ss.onStartEnd")},i.onStart.duration),f[p[l.url].status]()},w=function(n){var e,o=t(n.currentTarget);s.shouldLoadAnchor(o,i.blacklist,i.hrefRegex)&&!f&&(n.stopPropagation(),e=s.translate(o.prop("href")),e=i.alterRequest(e),v(e))},E=function(n){var e=t(n.currentTarget);if(!n.metaKey&&!n.ctrlKey&&s.shouldLoadAnchor(e,i.blacklist,i.hrefRegex)&&(n.stopPropagation(),n.preventDefault(),!P())){C();var o=s.translate(e.prop("href"));f=!0,d=e.prop("hash"),o=i.alterRequest(o),i.onBefore(e,c),S(o)}},b=0,P=function(){var t=null===i.repeatDelay,n=parseInt(Date.now())>b;return!(t||n)},C=function(){b=parseInt(Date.now())+parseInt(i.repeatDelay)};return i=t.extend({},t.fn.smoothState.options,i),null===n.history.state&&n.history.replaceState({id:h},e.title,g),s.storePageIn(p,g,e.documentElement.outerHTML,t(e).find("body").attr("class"),h),s.triggerAllAnimationEndEvent(c,"ss.onStartEnd ss.onProgressEnd ss.onEndEnd"),l=u,i.anchors&&(l.on("click",i.anchors,E),i.prefetch&&l.on(i.prefetchOn,i.anchors,w)),{href:g,blacklist:function(t){i.blacklist=t},cache:p,clear:m,load:S,fetch:v,restartCSSAnimations:function(){var t=c.prop("class");c.removeClass(t),s.redraw(c),c.addClass(t)}}};n.onpopstate=function(e){if(null!==e.state){Website._transition._init(!0);var o=n.location.href,r=t("#"+e.state.id).data("smoothState");r.href===o||s.isHash(o,r.href)||r.load(o,!1)}},t.smoothStateUtility=s,t.fn.smoothState=function(n){return this.each(function(){var e=this.tagName.toLowerCase();this.id&&"body"!==e&&"html"!==e&&!t.data(this,"smoothState")?t.data(this,"smoothState",new i(this,n)):!this.id&&a?a.warn("Every smoothState container needs an id but the following one does not have one:",this):"body"!==e&&"html"!==e||!a||a.warn("The smoothstate container cannot be the "+this.tagName+" tag")})},t.fn.smoothState.options={debug:!1,anchors:"a",hrefRegex:"",forms:"form",allowFormCaching:!1,repeatDelay:500,blacklist:".no-smoothState",prefetch:!1,prefetchOn:"mouseover touchstart",cacheLength:0,loadingClass:"is-loading",scroll:!0,alterRequest:function(t){return t},onBefore:function(t,n){},onStart:{duration:0,render:function(t){}},onProgress:{duration:0,render:function(t){}},onReady:{duration:0,render:function(t,n,e,o,r){t.html(n)}},onAfter:function(t,n){}}}}(jQuery,window,document);
   
   /** Drag ******************************/
   class Drag{constructor(e,r={}){let s=this;this.active=!0,this.cursor_moved=!1,this._event={X:0,Y:0,cursorDown:!1,initialX:0,initialY:0,originalEvent:null},this.hasMouseEvent="onmousedown"in document,this.hasTouchEvent="ontouchstart"in document,this.hasTouchWinEvent=navigator.msMaxTouchPoints&&navigator.msMaxTouchPoints>1,this.hasPointerEvent=!!window.navigator.msPointerEnabled,this.isTouch=this.hasTouchEvent||this.hasTouchWinEvent||this.hasPointerEvent,this.msTouchAction=null,this.defaults={cursor:!!r.hasOwnProperty("cursor")&&r.cursor,cursorText:!!r.hasOwnProperty("cursorText")&&r.cursorText,exclude_breakpoints:!!r.hasOwnProperty("exclude_breakpoints")&&r.exclude_breakpoints},this.listeners={mouseenter:function(){s._onMouseEnter(event,s)},mouseleave:function(){s._onMouseLeave(event,s)},mousemove:function(){s._onMouseMove(event,s)},drag:function(){s._onDrag(event,s)},dragend:function(){s._onDragEnd(event,s)},dragstart:function(){s._onDragStart(event,s)},resize:function(){s._resize(s)}},this.slider=e.get()[0],this.slider.container=this.slider.querySelector("ul"),this.slider.properties={current:0,ease:.09,offset:0,rAF:null,target:0,width:0},this.cursor=document.createElement("div"),r.hasOwnProperty("cursorText")&&this.cursor.appendChild(document.createTextNode(r.cursorText)),this.cursor.classList.add("slider__cursor"),document.getElementById("smoothscroll").appendChild(this.cursor),this.cursor.properties={height:0,width:0,position:{currentX:0,currentY:0,targetX:0,targetY:0},scale:{current:1,target:1},down:!1},this.clampTarget(this),this.defaults.cursor&&requestAnimationFrame(function(){s.moveCursor(s)}),this._init(),this._resize(s)}_init(e=!1){this.active=!0,this.hasMouseEvent&&(this.defaults.cursor&&(this.slider.addEventListener("mouseenter",this.listeners.mouseenter),this.slider.addEventListener("mouseleave",this.listeners.mouseleave),this.slider.addEventListener("mousemove",this.listeners.mousemove)),this.slider.addEventListener("mousemove",this.listeners.drag),this.slider.addEventListener("mouseup",this.listeners.dragend),this.slider.addEventListener("mousedown",this.listeners.dragstart)),this.hasTouchEvent&&(this.slider.addEventListener("touchmove",this.listeners.drag),this.slider.addEventListener("touchend",this.listeners.dragend),this.slider.addEventListener("touchstart",this.listeners.dragstart)),this.hasPointerEvent&&this.hasTouchWinEvent&&(this.msTouchAction=this.slider.style.msTouchAction,this.slider.style.msTouchAction="none",this.slider.addEventListener("MSPointerMove",this.listeners.drag),this.slider.addEventListener("MSPointerUp",this.listeners.dragend),this.slider.addEventListener("MSPointerDown",this.listeners.dragstart)),e||window.addEventListener("resize",this.listeners.resize)}_unload(e=!1){this.active=!1,this.hasMouseEvent&&(this.defaults.cursor&&(this.slider.removeEventListener("mouseenter",this.listeners.mouseenter),this.slider.removeEventListener("mouseleave",this.listeners.mouseleave),this.slider.removeEventListener("mousemove",this.listeners.mousemousemove)),this.slider.removeEventListener("mouseup",this.listeners.dragend),this.slider.removeEventListener("mousedown",this.listeners.dragstart),this.slider.removeEventListener("mousemove",this.listeners.drag)),this.hasTouchEvent&&(this.slider.removeEventListener("touchmove",this.listeners.drag),this.slider.removeEventListener("touchend",this.listeners.dragend),this.slider.removeEventListener("touchstart",this.listeners.dragstart)),this.hasPointerEvent&&this.hasTouchWinEvent&&(this.msTouchAction&&(this.slider.style.msTouchAction=this.msTouchAction),this.slider.removeEventListener("MSPointerMove",this.listeners.drag),this.slider.removeEventListener("MSPointerUp",this.listeners.dragend),this.slider.removeEventListener("MSPointerDown",this.listeners.dragstart)),e||window.removeEventListener("resize",this.listeners.resize)}_resize(e){if(e.defaults.exclude_breakpoints){let r=!0;$.each(e.defaults.exclude_breakpoints,function(s,t){if($("#"+t+":visible").length&&(r=!1,e.active))return e._unload(!0),!1}),!e.active&&r&&e._init(!0)}e.defaults.cursor&&(e.cursor.properties.width=e.cursor.getBoundingClientRect().width,e.cursor.properties.height=e.cursor.getBoundingClientRect().height),setTimeout(function(){e.slider.properties.width=e.slider.container.getBoundingClientRect().width,e.clampTarget(e)},1),e.slider.properties.rAF=requestAnimationFrame(function(){e.moveSlider(e)})}_onDrag(e,r){r.cursor.properties.down&&(e.preventDefault(),r._notify(e,r),console.log(e),r.slider.container.classList.add("sliding"),console.log("Sliding"), r.slider.container.link=!1,$(r.slider).prop("link")&&$(r.slider).removeProp("link")),r.cursor.properties.position.targetX=e.clientX-r.cursor.properties.width/2,r.cursor.properties.position.targetY=e.clientY-r.cursor.properties.height/2}_onDragStart(e,r){var s=r.isTouch&&e.targetTouches?e.targetTouches[0]:e;r._event.initialX=s.pageX,r._event.initialY=s.pageY,r.cursor.properties.down=!0,r.defaults.cursor&&(r.cursor.properties.scale.target=.8,r.cursor.classList.add("is-pressed"))}_onDragEnd(e,r){r.cursor.properties.down=!1,r.slider.container.classList.remove("sliding"),r.defaults.cursor&&(r.cursor.properties.scale.target=1,r.cursor.classList.remove("is-pressed"))}_onMouseEnter(e,r){r.defaults.cursor&&(r.cursor.properties.position.currentX||r.cursor.properties.position.currentY)&&(r.cursor.visible=!0,r.cursor.classList.add("is-visible"))}_onMouseLeave(e,r){r._onDragEnd(e,r),r.defaults.cursor&&(r.cursor.classList.remove("is-visible"),r.cursor.properties.scale.target=1,r.cursor.classList.remove("is-pressed"))}_onMouseMove(e,r){r.defaults.cursor&&!r.cursor.visible&&(r.cursor.properties.position.currentX||r.cursor.properties.position.currentY)&&(r.cursor.visible=!0,r.cursor.classList.add("is-visible"))}_notify(e,r){var s=r.isTouch&&e.targetTouches?e.targetTouches[0]:e;r._event.X=2*(s.pageX-r._event.initialX),r._event.Y=2*(s.pageY-r._event.initialY),r._event.originalEvent=e,r._event.cursorDown=r.cursor.properties.down,r._event.initialX=s.pageX,r._event.initialY=s.pageY,r.calc(r)}moveSlider(e){e.slider.properties.offset=e.slider.properties.target-e.slider.properties.current,e.slider.properties.current+=e.slider.properties.offset*e.slider.properties.ease,e.slider.container.style.transform=`translate3d(${e.round(e.slider.properties.current)}px,0,0)`,console.log(e.slider.properties),e.slider.properties.rAF=0==e.slider.properties.offset.toFixed(2)?null:requestAnimationFrame(function(){e.moveSlider(e)})}moveCursor(e){e.cursor.properties.position.currentX+=.09*(e.cursor.properties.position.targetX-e.cursor.properties.position.currentX),e.cursor.properties.position.currentY+=.09*(e.cursor.properties.position.targetY-e.cursor.properties.position.currentY),e.cursor.properties.scale.current+=.06*(e.cursor.properties.scale.target-e.cursor.properties.scale.current),e.cursor.style.transform=`translate3d(${e.round(e.cursor.properties.position.currentX)}px, ${e.round(e.cursor.properties.position.currentY)}px, 0px) scale(${e.round(e.cursor.properties.scale.current)})`,requestAnimationFrame(function(){e.moveCursor(e)})}calc(e){console.log("calc events",e), e.slider.properties.target+=e._event.X,e.clampTarget(e),null===e.slider.properties.rAF&&requestAnimationFrame(function(){e.moveSlider(e)})}clampTarget(e){let r=e.slider.properties.width-window.innerWidth;e.slider.properties.target=e.clamp(e.slider.properties.target,-1*r,0)}clamp(e,r,s){return Math.min(Math.max(e,r),s)}round(e,r){r=void 0===r?100:Math.pow(10,r);return Math.round(e*r)/r}}
   
   /** Smoothscroll ******************************/
   class ScrollableItem{constructor(t){var e=this;this.item=t;var i=$(t);this.$item=i,this.target=i,this._triggers={},this.target._attributes={},this.item.is_hidden=!0,this.item.is_fixed="fixed"==this.item.getAttribute("smoothscroll"),this.item.translateYModifier=!1,this.item.is_carousel=!1,this.update_followup=!1,this.item.getAttribute("scroll")&&(this._triggers[this.item.getAttribute("scroll")]=[this.item]),this.item.querySelectorAll("[scroll]").forEach(function(t){t.getAttribute("scroll").split(",").forEach(i=>void 0!==e._triggers[i]?e._triggers[i].push(t):e._triggers[i]=[t])}),this._resize=function(){e.update(),e.render(!1),e.update_followup=setTimeout(function(){e.update(),e.render(!1)},1)},this._resize(),window.removeEventListener("resize",this._resize),window.addEventListener("resize",this._resize)}deconstruct(){window.removeEventListener("resize",this._resize)}update(){this.update_layout()}get_top(t){let e=0;for(;t.parentNode;)e+=t.offsetTop,t=t.parentNode;return e}render(t){if(!this.item.classList.contains("loading")){var e=this.item.offsetHeight,i=this.item.offsetTop-(SmoothScroll._attributes.transition.previous+SmoothScroll._attributes.window.height);if(!this.item.is_fixed){if(!this.item.translateYModifier&&!this.item.toggle_fixed&&!this.item.is_carousel&&(i>1.5*SmoothScroll._attributes.window.height||i+e+SmoothScroll._attributes.window.height<-1.5*SmoothScroll._attributes.window.height)&&(this.item.is_hidden||(this.item.is_hidden=!0,this.item.style.visibility="hidden"),!t))return;this.item.is_hidden&&(this.item.is_hidden=!1,this.item.style.visibility="visible"),1===SmoothScroll._attributes.transition.ease||this.item.translateYModifier||(this.item.style.transform=`translate3d(0,${-1*SmoothScroll._attributes.transition.previous}px,0)`)}this.layout()}}update_layout(){for(let[t,e]of Object.entries(this._triggers))for(const e of this._triggers[t])switch(t){case"background":e.top=this.get_top(e),e.bottom=e.top+e.offsetHeight,e.background=e.getAttribute("background"),e.container=$(".bg-container").get()[0],e.container.background=!1;break;case"header":e.header=e.parentElement,e.container=e.querySelector("div.container"),e.container_inside=e.container.querySelector("div");break;case"footer":e.height=e.parentElement.offsetHeight;break;case"iframe-video":case"image":e.top=this.get_top(e);break;case"parallax":e.top=this.get_top(e),e.center=e.top+e.offsetHeight/2,e.imgs=e.querySelectorAll("span"),$.each(e.imgs,function(t,e){e.img=e.querySelector("img")||e.querySelector("video"),e.speed=1/window.getComputedStyle(e.img).getPropertyValue("--parallax")});break;case"parallax.list":e.top=this.get_top(e),e.center=e.top+e.parentElement.offsetHeight/2,e.speed=1/window.getComputedStyle(e).getPropertyValue("--parallax");break;case"reveal":e.top=this.get_top(e);break;case"scrolling-text":e.top=this.get_top(e),e.direction="rtl"==$.trim(window.getComputedStyle(e).getPropertyValue("--scrolling-direction"));break;case"ticker":e.top=this.get_top(e),e.ticker=e.querySelector("div.ticker-container");break;case"video":e.top=this.get_top(e);break;case"news.infinite":e.top=this.get_top(e),e.height=e.offsetHeight,e.infinite=!!$(e).find(".infinite").length}}layout(){for(let[e,i]of Object.entries(this._triggers))for(const i of this._triggers[e])switch(e){case"background":SmoothScroll._attributes.transition.center>i.offsetTop&&SmoothScroll._attributes.transition.center<=i.bottom&&i.container.background!=i.background&&(i.container.setAttribute("background",i.background),i.container.background=i.background);break;case"footer":i.position=-.8*(this.item.offsetTop-(SmoothScroll._attributes.transition.baseline-i.height)),i.opacity=Math.min(Math.max((.8*i.height-Math.abs(i.position))/(.8*i.height),0)+.01,1),i.style.transform=`translate3d(0,${i.position}px,0)`,i.style.opacity=i.opacity;break;case"header":if(SmoothScroll._attributes.header.scroll_lock)return;switch(i.header.classList.toggle("bg",SmoothScroll._attributes.transition.previous>200),SmoothScroll._attributes.transition.direction){case!0:clearTimeout(i.reveal),i.reveal=setTimeout(function(){i.header.classList.remove("animate")},400),SmoothScroll._attributes.transition.previous>100&&(i.header.classList.add("scroll","animate"),i.header.scroll=!0);break;case!1:clearTimeout(i.reveal),i.reveal=setTimeout(function(){i.header.classList.remove("animate")},400),i.header.classList.add("animate"),SmoothScroll._attributes.transition.previous>100&&(i.header.classList.remove("scroll"),i.header.scroll=!1)}break;case"iframe-video":if(!i.is_playing&&SmoothScroll._attributes.transition.baseline-30>i.top){if("object"!=typeof Vimeo||!$(i).attr("src"))return;i.player=new Vimeo.Player(i),i.player.setCurrentTime(0),i.player.setVolume(0),i.player.setLoop(!0),i.player.play(),i.player.on("pause",function(t){i.is_paused=!0}),i.is_playing=!0}else i.is_paused&&SmoothScroll._attributes.transition.baseline-30>i.top&&SmoothScroll._attributes.transition.previous<i.top+i.offsetHeight+30&&i.player.play();break;case"image":!i.is_loaded&&SmoothScroll._attributes.transition.baseline+SmoothScroll._attributes.window.height>=i.top&&($(i).attr({src:$(i).attr("data-src"),srcset:$(i).attr("data-srcset")}).removeAttr("data-src"),i.is_loaded=!0);break;case"parallax":!0!==i.reveal&&SmoothScroll._attributes.transition.baseline-70>i.top&&(i.reveal=!0,$(i).addClass("reveal")),$.each(i.imgs,function(t,e){var s=i.center-SmoothScroll._attributes.transition.center,r=s/e.speed,o=Math.min(Math.max(1.1+s/5/20/100,1),1.3);e.style.transform=`translate3d(0, ${r}px, 0)`,e.img.style.transform=`scale(${o})`});break;case"parallax.list":!0!==i.reveal&&SmoothScroll._attributes.transition.baseline-70>i.top&&(i.reveal=!0,$(i).addClass("reveal"));var t=(i.center-SmoothScroll._attributes.transition.center)/i.speed;i.style.transform=`translate3d(0, ${t}px, 0)`;break;case"reveal":!0!==i.reveal&&SmoothScroll._attributes.transition.baseline-70>i.top&&($("header").addClass("init"),i.reveal=!0,$(i).addClass("reveal"));break;case"scrolling-text":i.translateX=SmoothScroll._attributes.transition.center-(i.top+i.offsetHeight/2),i.translateX*=i.direction?-1:1,i.style.transform=`translate3d(${i.translateX/2}px, 0, 0)`;break;case"ticker":if(!i.ticker)return;i.translateX=-Math.min(Math.max(SmoothScroll._attributes.transition.baseline-i.top-i.offsetHeight,0),SmoothScroll._attributes.window.height),i.ticker.style.transform=`translate3d(${(SmoothScroll._attributes.window.height-i.translateX)/4}px, 0, 0)`;break;case"video":if(!i.is_loaded&&SmoothScroll._attributes.transition.baseline+SmoothScroll._attributes.window.height>i.top&&($(i).attr("src",$(i).attr("data-src")).removeAttr("data-src"),i.is_loaded=!0),i.is_loaded&&!i.is_playing&&SmoothScroll._attributes.transition.baseline-30>i.top){if(Website._register.lighthouse)return;i.is_playing=!0,i.play()}break;case"news.infinite":SmoothScroll._attributes.transition.baseline>i.top+i.height-SmoothScroll._attributes.window.height&&i.infinite&&($(i).find("li.infinite:lt(12)").removeClass("infinite"),i.height=i.offsetHeight);break;case"reiif-value":if(!i.lines)return;i.translateX=-(SmoothScroll._attributes.transition.baseline-i.parentElement.offsetTop-i.offsetTop-i.offsetHeight/4),i.lines[0].style.transform=`translate3d(${i.translateX/2}px, 0, 0)`,i.lines[1].style.transform=`translate3d(${-i.translateX/2}px, 0, 0)`;break;case"team-people":i.translateX=-(SmoothScroll._attributes.transition.baseline-i.parentElement.offsetTop-i.offsetTop-i.offsetHeight/4),i.line.style.transform=`translate3d(${i.translateX/2}px, 0, 0)`}}}SmoothScroll={_MathUtils:{map:function(t,e,i,s,r){return(t-e)*(r-s)/(i-e)+s},lerp:function(t,e,i){return(1-i)*t+i*e}},_attributes:{content:{sized:!1},document:{container:document.getElementById("smoothscroll"),header:document.getElementsByTagName("header")[0],height:!1,last_menu:!1,main:document.getElementById("main"),menu:!1,scroll:!1},header:{display:!1,position:0,scroll:!1,scroll_lock:!1,sticky:!1},window:{height:!1,width:!1},animation:{frame:!1,stop:!0,timeout:!1,transition:!0},reveal_queue:0},_items:[],_init:function(t){if(_self=this,this._attributes.transition={previous:!1,current:0,differential:0,ease:.1,lock:!1},this._resize(!1,!1,!1),this._items=[],document.querySelectorAll("[smoothscroll]").forEach(t=>this._items.push(new ScrollableItem(t))),t)this._easing(),this._attributes.document.scroll=0,$(SmoothScroll._attributes.document.main_scroll).stop().animate({scrollTop:0},0),setTimeout(function(){window.removeEventListener("resize",_self._binding.resize),window.addEventListener("resize",_self._binding.resize),_self._easing()},100);else{window.removeEventListener("resize",_self._binding.resize),window.addEventListener("resize",_self._binding.resize);for(const t of this._items)t.deconstruct()}setTimeout(function(){_self._scroll(!1,!0),_self._resize(!1,!1,!0)},t?0:600)},_binding:{resize:function(){_self._resize(!1,!1,!1)},scroll:function(){_self._scroll(!1,!1)}},_easing:function(){_self._attributes.document.main.removeEventListener("scroll",_self._binding.scroll),this._attributes.transition.ease=parseFloat(window.getComputedStyle(document.body).getPropertyValue("--smoothScroll")),this._attributes.document.main!=window&&1!==this._attributes.transition.ease&&$(SmoothScroll._attributes.document.main_scroll).stop().animate({scrollTop:0},0),this._attributes.document.main=1!==this._attributes.transition.ease?window:document.getElementById("main"),this._attributes.document.main_body=1!==this._attributes.transition.ease?document.body:document.getElementById("main"),this._attributes.document.main_scroll=1!==this._attributes.transition.ease?"html, body":"main",this._attributes.transition.lock||(_self._attributes.document.main.removeEventListener("scroll",_self._binding.scroll),_self._attributes.document.main.addEventListener("scroll",_self._binding.scroll))},_resize:function(t,e,i){if(t||this._easing(),this._attributes.document.height!=this._attributes.document.container.offsetHeight||i||e){if(this._attributes.document.height=this._attributes.document.container.offsetHeight,this._attributes.window={height:window.innerHeight,width:window.innerWidth},this._attributes.document.main_body.style.height=`${this._attributes.document.height}px`,!e)for(const t of this._items)t._resize();t||this._scroll(!0,!1),i||e||(setTimeout(function(){_self._resize(!0,!1,!1)},500),setTimeout(function(){_self._resize(!0,!1,!1)},1e3),setTimeout(function(){_self._resize(!0,!1,!1)},2e3),setTimeout(function(){_self._resize(!0,!1,!1)},3e3),setTimeout(function(){_self._resize(!0,!1,!1)},4e3),setTimeout(function(){_self._resize(!0,!1,!1)},5e3))}},_scroll:function(t,e,i=!1,s=!0,r=!1){if(t||this._resize(!0,!1,!1),!1!==i&&($(SmoothScroll._attributes.document.main_scroll).stop().animate({scrollTop:i},0),0==s&&(this._attributes.animation.transition=!1)),!i&&!this._attributes.animation.transition&&!r)return s=!1,this._attributes.animation.transition=!0,!1;e||(this._attributes.document.main==window?this._attributes.document.scroll=Math.round(window.pageYOffset||document.documentElement.scrollTop):this._attributes.document.scroll=this._attributes.document.main.scrollTop),(i||this._attributes.document.scroll!=this._attributes.transition.current||r)&&(this._attributes.animation.stop&&(this._attributes.animation.stop=!1,cancelAnimationFrame(this._attributes.animation.frame),s?this._attributes.animation.frame=requestAnimationFrame(()=>this.render(e,!1,s)):this.render(e,!1,s)),s&&(clearTimeout(this._attributes.animation.timeout),this._attributes.animation.timeout=setTimeout(function(){_self._attributes.animation.stop=!0},1100)))},render:function(t,e,i){if(this._attributes.animation.stop||this._attributes.transition.lock&&i)cancelAnimationFrame(this._attributes.animation.frame);else{if(i||(_self._attributes.animation.stop=!0),this._attributes.transition.current=this._attributes.document.scroll,this._attributes.transition.direction=this._attributes.transition.current-this._attributes.transition.previous>0||!(this._attributes.transition.current-this._attributes.transition.previous<0)&&this._attributes.transition.direction,i)var s=parseFloat(SmoothScroll._MathUtils.lerp(this._attributes.transition.previous,this._attributes.transition.current,SmoothScroll._attributes.transition.ease).toFixed(2));else s=this._attributes.transition.current;if(this._attributes.transition.previous!==s||t){this._attributes.transition.previous=s,this._attributes.transition.baseline=this._attributes.transition.previous+this._attributes.window.height,this._attributes.transition.center=this._attributes.transition.previous+this._attributes.window.height/2;for(const t of this._items)t.render(!e);i&&(this._attributes.animation.frame=requestAnimationFrame(()=>this.render(t,!0,i)))}else this._attributes.animation.stop=!0}},lock:function(t=!1){this._attributes.transition.lock=!0,window.removeEventListener("resize",_self._binding.resize),_self._attributes.document.main.removeEventListener("scroll",_self._binding.scroll),t||$("#main").addClass("lock")},unlock:function(){this._attributes.transition.lock=!1,window.addEventListener("resize",_self._binding.resize),$("#main").removeClass("lock"),_self._attributes.document.main.addEventListener("scroll",_self._binding.scroll)},reset:function(){SmoothScroll.unlock(),$(SmoothScroll._attributes.document.main_scroll).stop().animate({scrollTop:0},0),this._attributes.transition.lock=!1,this._attributes.animation.stop=!0,cancelAnimationFrame(this._attributes.animation.frame);for(const t of this._items)t.deconstruct();this._init(!1)},unload:function(){SmoothScroll.lock(),$(SmoothScroll._attributes.document.main_scroll).stop().animate({scrollTop:0},0);for(const t of this._items)t.deconstruct();this._items=[]}};