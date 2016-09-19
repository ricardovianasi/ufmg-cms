;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('PagesService', PagesService);

  PagesService.$inject = [
    '$http',
    '$filter',
    '$uibModal',
    'apiUrl',
    'EventsService',
    'GalleryService',
    'MediaService',
    'NewsService',
    'ReleasesService',
    'TagsService',
    'faqService',
    'PostTypeService',
    '$q'
  ];

  /**
   * @param $http
   * @param $filter
   * @param $uibModal
   * @param apiUrl
   * @param EventsService
   * @param GalleryService
   * @param MediaService
   * @param NewsService
   * @param ReleasesService
   * @param TagsService
   *
   * @returns {{COLUMNS: *[], getPages: _getPages, addPage: addPage, getPage: getPage, updatePage: updatePage, removePage: removePage, module: module}}
   *
   * @constructor
   */
  function PagesService($http,
                        $filter,
                        $uibModal,
                        apiUrl,
                        EventsService,
                        GalleryService,
                        MediaService,
                        NewsService,
                        ReleasesService,
                        TagsService,
                        faqService,
                        PostTypeService,
                        $q) {
    console.log('... PagesService');

    var PAGES_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'page');

    /**
     * @param {*} page
     *
     * @returns {*}
     *
     * @private
     */
    var _parseData = function (page) {
      var cleanPage = {};

      cleanPage.image = page.image ? page.image.id : null;
      cleanPage.status = page.status;

      if (page.status == 'scheduled') {
        cleanPage.post_date = page.scheduled_date + ' ' + page.scheduled_time;
      }

      cleanPage.tags = _.map(page.tags, 'text');
      cleanPage.title = page.title;
      //@todo: change this to editable slug
      // cleanPage.slug = page.title;
      cleanPage.widgets = {
        main: [],
        side: []
      };

      // Insert each widget into main and side columns
      angular.forEach(page.widgets.main, function (widget) {
        cleanPage.widgets.main.push(_module.makeWidget(widget));
      });

      angular.forEach(page.widgets.side, function (widget) {
        cleanPage.widgets.side.push(_module.makeWidget(widget));
      });

      // If we are updating the Page
      if (page.id) {
        cleanPage.id = page.id;

        delete cleanPage.created_at;
        delete cleanPage.udpated_at;
        delete cleanPage.scheduled_at;
      }

      if (page.columns == 1) {
        cleanPage.widgets.side = [];
      }

      cleanPage.parent = page.parent ? page.parent.id : undefined;
      cleanPage.page_type = page.page_type;
      cleanPage.slug = typeof page.slug != 'undefined' ? page.slug.slug : '';

      return cleanPage;
    };

    /**
     * @param page
     *
     * @returns {*}
     *
     * @private
     */
    var _getPages = function (page) {
      page = page || 1;

      var url = $filter('format')('{0}?page={1}', PAGES_ENDPOINT, page);

      return $http.get(url);
    };

    /**
     * @param $scope
     *
     * @private
     */
    var _getTags = function ($scope) {
      $scope.tags = [];

      TagsService.getTags().then(function (data) {
        $scope.tags = data.data.items[0];
      });

      $scope.findTags = function($query) {
        var allTags = _tagsForTagsInput($scope.tags);
        return $filter('filter')(allTags, $query);
      };

      function  _tagsForTagsInput(tags) {
        var tagsForTagsInput = [];

        angular.forEach(tags, function(v, k) {
          tagsForTagsInput.push({
            text: tags[k].name
          });
        });

        return tagsForTagsInput;
      }
    };


    /**
     * @type {{parseWidgetToSave, parseWidgetToLoad, preparePartial, handle, makeWidget}}
     *
     * @private
     */
    var _module = (function (_getPages, $uibModal) {
      // Parse widget object to send its data to webservice
      var _parseToSave = {
        /**
         * Text
         *
         * @param widget
         *
         * @returns {{text: (*|null)}}
         */
        text: function (widget) {
          return {
            text: widget.text || (widget.content ? widget.content.text : null),
          };
        },
        /**
         * Highlighted Event
         *
         * @param widget
         *
         * @returns {{event: (*|null)}}
         */
        highlightedevent: function (widget) {
          return {
            event: widget.event_id || (widget.content ? widget.content.event.id : null),
          };
        },
        /**
         * Highlighted Events
         *
         * @param widget
         *
         * @returns {*}
         */
        highlightedevents: function (widget) {
          if (widget.events) {
            return {
              events: widget.events,
            };
          } else {
            if (widget.content.events) {
              var eventsToSelect = [];

              angular.forEach(widget.content.events, function (event) {
                eventsToSelect.push(event.id);
              });

              return {
                events: eventsToSelect,
              };
            }
          }
        },
        /**
         * Gallery
         *
         * @param widget
         *
         * @returns {{gallery: (*|null)}}
         */
        gallery: function (widget) {
          return {
            gallery: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
          };
        },
        /**
         * Highlighted Gallery
         *
         * @param widget
         *
         * @returns {{gallery: (*|null)}}
         */
        highlightedgallery: function (widget) {
          return {
            gallery: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
          };
        },
        /**
         * Highlighted Galleries
         *
         * @param widget
         *
         * @returns {{galleries: (*|Array)}}
         */
        highlightedgalleries: function (widget) {
          // var galleriesToSelect = [];
          //     angular.forEach(widget.content.galleries, function (gallery) {
          //       galleriesToSelect.push(gallery.id);
          //     });
          //     _obj.galleries = galleriesToSelect;

          return {
            galleries: widget.galleries ? widget.galleries : widget.content.galleries,
          };
        },
        /**
         * Last Image Sidebar
         *
         * @param widget
         *
         * @returns {{category: (*|Document.category|string|string|null)}}
         */
        lastimagessidebar: function (widget) {
          return {
            category: widget.category || (widget.content ? widget.content.category.id : null),
          };
        },
        /**
         * List News
         *
         * @param widget
         *
         * @returns {{limit: (*|null), typeNews: (*|null), tag: (*|null)}}
         */
        listnews: function (widget) {
          var tags = [];

          if(widget.content) {
            if('tags' in widget.content && widget.content.tags.length > 0) {
              if (typeof widget.content.tags[0].text !== 'undefined')
                widget.content.tags = _.map(widget.content.tags, 'text');
                tags = widget.content.tags;
            } else {
              tags = widget.tags || (widget.content ? widget.content.tags.id : null);
            }
          } else {
            if('tags' in widget && widget.tags.length > 0) {
              if (typeof widget.tags[0].text !== 'undefined')
                widget.tags = _.map(widget.tags, 'text');
                tags = widget.tags;
            } else {
              tags = widget.tags || (widget.content ? widget.content.tags.id : null);
            }
          }


          return {
            category: widget.category || (widget.content ? widget.content.category : null),
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            typeNews: widget.typeNews || (widget.content ? (widget.content.typeNews ? widget.content.typeNews.id : '' ) : null),
            tags: tags,
          };
        },
        /**
         * Event List
         *
         * @param widget
         *
         * @returns {{limit: (*|null), tag: (*|null)}}
         */
        eventlist: function (widget) {
          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            tag: widget.tag || (widget.content ? widget.content.tag : null),
          };
        },
        /**
         * Release List
         *
         * @param widget
         *
         * @returns {{limit: (*|null)}}
         */
        releaselist: function (widget) {
          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
          };
        },
        /**
         * Related News
         *
         * @param widget
         *
         * @returns {{limit: (*|null), typeNews: (*|null), tag: (*|null)}}
         */
        relatednews: function (widget) {
          var tags = [];

          if(widget.content) {
            if(widget.content.tags.length > 0) {
              if (typeof widget.content.tags[0].text !== 'undefined')
                widget.content.tags = _.map(widget.content.tags, 'text');
            }
          } else if (widget.tags) {
            if(widget.tags.length > 0) {
              if (typeof widget.tags[0].text !== 'undefined')
                widget.tags = _.map(widget.tags, 'text');
            }
          }

          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            typeNews: widget.typeNews || (widget.content ? widget.content.typeNews : null),
            tags: widget.tags || (widget.content ? widget.content.tags : null),
          };
        },
        /**
         * Highlighted News
         *
         * @param widget
         *
         * @returns {{news: (*|null)}}
         */
        highlightednews: function (widget) {

          var newsToSelect = [];

          if (widget.news) {
            angular.forEach(widget.news, function (news) {
              newsToSelect.push(news.id);
            });

            return {
              news: newsToSelect,
            };
          } else if (widget.content.news) {
            newsToSelect = [];

            angular.forEach(widget.content.news, function (news) {
              newsToSelect.push(news.id);
            });

            return {
              news: newsToSelect,
            };
          }
        },

        /**
         * Highlighted Radio News
         *
         * @param widget
         *
         * @returns {{news: (*|null)}
         */
        highlightedradionews: function (widget) {
          if (widget.news) {
            var newsToSelect = [];

            angular.forEach(widget.news, function (news) {
              newsToSelect.push(news.id);
            });

            return {
              news: newsToSelect,
            };
          }

          return {
            news: widget.news,
          };
        },
        /**
         * Highlighted News Video
         *
         * @param widget
         *
         * @returns {{news: (*|null)}}
         */
        highlightednewsvideo: function (widget) {
          if (widget.news) {
            var newsToSelect = [];

            angular.forEach(widget.news, function (news) {
              newsToSelect.push(news.id);
            });

            return {
              news: newsToSelect,
            };
          }

          return {
            news: widget.news,
          };
        },
        /**
         * Editorial News
         *
         * @param widget
         *
         * @returns {{tag: (*|null)}}
         */
        editorialnews: function (widget) {
          console.log('passa 1', widget);

          var newsToSelect = [];

        var tag = [];

          if(widget.content) {
            if('tag' in widget.content && widget.content.tag.length > 0) {
              if (typeof widget.content.tag[0].text !== 'undefined')
                widget.content.tag = _.map(widget.content.tag, 'text');
                tag = widget.content.tag;
            } else {
              tag = widget.tag || (widget.content ? widget.content.tag.id : null);
            }
          } else {
            if('tag' in widget && widget.tag.length > 0) {
              if (typeof widget.tag[0].text !== 'undefined')
                widget.tag = _.map(widget.tag, 'text');
                tag = widget.tag;
            } else {
              tag = widget.tag || (widget.content ? widget.content.tag.id : null);
            }
          }

          if (widget.origin) {
            if (widget.origin == "1" && widget.news) {
              newsToSelect = [];

              angular.forEach(widget.news, function (news) {
                newsToSelect.push(news.id);
              });

              return {
                news: newsToSelect,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: widget.tag || (widget.content ? widget.content.tag : null)
              };
            } else if (widget.origin == "0") {
              return {
                news: null,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: widget.tag || (widget.content ? widget.content.tag : null)
              };
            }
          } else if (widget.content.origin !== null) {
            if (widget.content.origin == "1" && widget.content.news) {
              newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push(news.id);
              });

              return {
                news: newsToSelect,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: widget.tag || (widget.content ? widget.content.tag : null)
              };
            } else if (widget.content.origin == "0") {
              return {
                news: null,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: widget.tag || (widget.content ? widget.content.tag : null)
              };
            }
          }
        },

        /**
         * Internal Menu
         *
         * @param widget
         *
         * @returns {{links: Array}}
         */
        internalmenu: function (widget) {
          console.log('parse to save internal >>>', widget);

          var widgetLinks = [];
          var page;
          var external_url;
          var linksOnEach = widget.links ? widget.links : widget.content.links;

          console.log('links on each >>>>', linksOnEach);

          angular.forEach(linksOnEach, function (links) {
            if (links.external_url)
              links.isExternal = true;

            if (!links.isExternal) {
              external_url = null;
              page = links.page ? links.page.id : null;
            } else {
              external_url = links.external_url ? links.external_url : null;
              page = null;
            }

            widgetLinks.push({
              page: page,
              label: links.label,
              external_url: external_url,
            });
          });

          return {
            links: widgetLinks,
          };
        },
        /**
         * Hub Links
         *
         * @param widget
         *
         * @returns {{links: null}}
         */
        hublinks: function (widget) {
          if(widget.content) {
            angular.forEach(widget.content.links, function(v, k){
              if(typeof widget.content.links[k].page ===  "object" &&
                typeof widget.content.links[k].page !==  "number" &&
                 widget.content.links[k].page !==  null) {
                widget.content.links[k].page = widget.content.links[k].page.id ? widget.content.links[k].page.id : widget.content.links[k].page;
              }
            });
          } else {
            angular.forEach(widget.links, function(v, k){
              if(typeof widget.links[k].page ===  "object" &&
                typeof widget.links[k].page !==  "number" &&
                widget.links[k].page !==  "null" &&
                widget.links[k].external_url === null) {
                widget.links[k].page = widget.links[k].page.id ? widget.links[k].page.id : widget.links[k].page;
              }
            });
          }

          return {
            links: widget.content ? widget.content.links : widget.links,
          };
        },
        /**
         * Sidebar Button
         *
         * @param widget
         *
         * @returns {{label: (*|null), url: (*|null), icon: (*|null)}}
         */
        sidebarbutton: function (widget) {
          return {
            label: widget.label || (widget.content ? widget.content.label : null),
            url: widget.url || (widget.content ? widget.content.external_url : null),
            icon: widget.icon || (widget.content ? widget.content.icon.id : null),
          };
        },
        /**
         * Highlighted Release
         *
         * @param widget
         *
         * @returns {{title: *, description: *, release: (*|release|Cropper.release|Date|null), specialists: Array, image: *}}
         */
        highlightedrelease: function (widget) {
          var obj = {
            title: widget.title,
            description: widget.content.description,
            release: widget.content.release,
            specialists: [],
            image: widget.content.image.id,
          };

          angular.forEach(widget.content.specialists, function (specialist) {
            delete specialist.opened;

            obj.specialists.push(specialist);
          });

          return obj;
        },
        /**
         * Last Tv Programs
         *
         * @param widget
         *
         * @returns {{type: *, title: *}}
         */
        lasttvprograms: function (widget) {
          return {
            type: widget.type,
            title: widget.title,
          };
        },
        /**
         * Communication Events
         *
         * @param widget
         *
         * @returns {{type: *, event: *}}
         */
        comevents: function (widget) {
          return {
            type: widget.type,
            event: widget.content.event.id,
          };
        },
        /**
         * Communication Highlight News
         *
         * @param widget
         *
         * @returns {{type: *, news: *[]}}
         */
        comhighlightnews: function (widget) {
          return {
            type: widget.type,
            news: [
              widget.content.news[0].id,
              widget.content.news[1].id,
            ]
          };
        },
        faq: function(widget) {
          var id;

          if(typeof widget.content.faq === 'object')
            id = widget.content.faq.id;
          else
            id = widget.content.faq;

          return {
            type: widget.type,
            faq: parseInt(id)
          };
        },

        tagcloud: function(widget) {
          return {
            type: widget.type,
            limit: widget.limit || (widget.content ? widget.content.limit : null),
          };
        },

        search: function(widget) {
          return {
            id: widget.id,
            post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
            post_filter_id: widget.post_filter_id || (widget.content ? widget.content.post_filter_id : null),
          };
        }
      };

      // Parse widget object from webservice data
      var _parseToLoad = {
        /**
         * Text
         *
         * @param widget
         *
         * @returns {{text: (*|null)}}
         */
        text: function (widget) {
          return {
            text: widget.text || (widget.content ? widget.content.text : null),
          };
        },
        /**
         * Highlighted Event
         *
         * @param widget
         *
         * @returns {{event: (*|null)}}
         */
        highlightedevent: function (widget) {
          return {
            event: widget.event_id || (widget.content ? widget.content.event.id : null),
          };
        },
        /**
         * Highlighted Events
         *
         * @param widget
         *
         * @returns {{events: (*|null)}}
         */
        highlightedevents: function (widget) {
          if (widget.events) {
            return {
              events: widget.events,
            };
          } else {
            if (widget.content.events) {
              var eventsToSelect = [];

              angular.forEach(widget.content.events, function (event) {
                eventsToSelect.push(event.id);
              });

              return {
                events: eventsToSelect,
              };
            }
          }
        },
        /**
         * Highlight News Video
         *
         * @param widget
         *
         * @returns {{text: *}}
         */
        highlightednewsvideo: function (widget) {
          var obj = {
            text: widget.text,
          };

          if ('content' in widget) {
            obj.news = widget.content.news;
          } else {
            obj.news = widget.news;
          }

          return obj;
        },
        /**
         * Gallery
         *
         * @param widget
         *
         * @returns {{gallery: (*|null)}}
         */
        gallery: function (widget) {
          return {
            gallery_id: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
          };
        },
        /**
         * Highlighted Gallery
         *
         * @param widget
         *
         * @returns {{gallery: (*|null)}}
         */
        highlightedgallery: function (widget) {
          return {
            gallery_id: widget.gallery_id || (widget.content ? widget.content.gallery.id : null),
          };
        },
        /**
         * Highlighted Galleries
         *
         * @param widget
         *
         * @returns {{galleries: (*|Array)}}
         */
        highlightedgalleries: function (widget) {
          // var galleriesToSelect = [];
          //     angular.forEach(widget.content.galleries, function (gallery) {
          //       galleriesToSelect.push(gallery.id);
          //     });
          //     _obj.galleries = galleriesToSelect;

          return {
            galleries: widget.galleries ? widget.galleries : widget.content.galleries,
          };
        },
        /**
         * Last Image Sidebar
         *
         * @param widget
         *
         * @returns {{category: (*|Document.category|string|string|null)}}
         */
        lastimagessidebar: function (widget) {
          return {
            category: widget.category || (widget.content ? widget.content.category.id : null),
          };
        },
        /**
         * List News
         *
         * @param widget
         *
         * @returns {{limit: (*|null), typeNews: (*|null), tag: (*|null)}}
         */
        listnews: function (widget) {

          var typeNews = '';
          var tagsForTagsInput = [];

          if (widget.typeNews) {
            typeNews = widget.typeNews;
            if (widget.tags) {
              parseTags(widget.tags);
            }

          } else if (widget.content.typeNews !== null) {
            typeNews = widget.content.typeNews.id;
            if (widget.content.tags) {
              parseTags(widget.content.tags);
            }
          }

          function parseTags(tags) {
            if (widget.tags) {
              angular.forEach(tags, function (v, k) {
                tagsForTagsInput.push({
                  text: tags[k].text
                });
              });
            } else if (widget.content.tags) {
              angular.forEach(tags, function (v, k) {
                tagsForTagsInput.push({
                  text: tags[k].name
                });
              });
            }
          }

          return {
            category: widget.category || (widget.content ? widget.content.category : null),
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            typeNews: typeNews,
            tags: tagsForTagsInput
          };
        },
        /**
         * Event List
         *
         * @param widget
         *
         * @returns {{limit: (*|null), tag: (*|null)}}
         */
        eventlist: function (widget) {
          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            tag: widget.content ? widget.content.tag.id : null,
          };
        },
        /**
         * Release List
         *
         * @param widget
         *
         * @returns {{limit: (*|null)}}
         */
        releaselist: function (widget) {
          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
          };
        },
        /**
         * Related News
         *
         * @param widget
         *
         * @returns {{limit: (*|null), typeNews: (*|null), tag: (*|null)}}
         */
        relatednews: function (widget) {

          var typeNews = '';
          var tagsForTagsInput = [];

          if(widget.content) {
            if(widget.content.typeNews !== null)
              typeNews = widget.content.typeNews.id;

            parseTags(widget.content.tags);
          } else {
            if(widget.typeNews !== null)
              typeNews = widget.typeNews.id;

            parseTags(widget.tags);
          }


          function parseTags(tags) {
            angular.forEach(tags, function (v, k) {
              tagsForTagsInput.push({
                text: tags[k].name
              });
            });
          }

          return {
            limit: widget.limit || (widget.content ? widget.content.limit : null),
            typeNews: typeNews,
            tags: tagsForTagsInput,
          };
        },
        /**
         * Highlighted News
         *
         * @param widget
         *
         * @returns {{news: (*|null)}}
         */
        highlightednews: function (widget) {
          if (widget.news) {
            return {
              news: widget.news,
            };
          } else {
            if (widget.content.news) {
              var newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push({
                  id: news.id,
                  title: news.title
                });
              });

              return {
                news: newsToSelect,
              };
            }
          }
        },
        /**
         * Editorial News
         *
         * @param widget
         *
         * @returns {{tag: (*|null), news: (*|null)}}
         */
        editorialnews: function (widget) {
          console.log('passa 2', widget);

          var newsToSelect = [];
          var tagsForTagsInput = [];

          function parseTags(tags) {
            if (widget.tags) {
              angular.forEach(tags, function (v, k) {
                tagsForTagsInput.push({
                  text: tags[k].text
                });
              });
            } else if (widget.content.tags) {
              angular.forEach(tags, function (v, k) {
                tagsForTagsInput.push({
                  text: tags[k].name
                });
              });
            }
          }

          parseTags(widget.tags);

          if (widget.origin) {
            if (widget.origin == "1" && widget.news) {
              return {
                news: widget.news,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: tagsForTagsInput
              };
            } else if (widget.origin == "0"){

              return {
                news: null,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: tagsForTagsInput
              };
            }
          } else if (widget.content.origin !== null) {
            if (widget.content.origin == "1" && widget.content.news) {

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push({
                  id: news.id,
                  title: news.title
                });
              });

              return {
                news: newsToSelect,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: tagsForTagsInput
              };
            } else if (widget.content.origin == "0") {

              return {
                news: null,
                origin: widget.origin || (widget.content ? widget.content.origin : null),
                tag: tagsForTagsInput
              };
            }
          }
        },

        /**
         * Internal Menu
         *
         * @param widget
         *
         * @returns {{links: Array}}
         */
        internalmenu: function (widget) {
          console.log(widget);
          var widgetLinks = [];

          if(!widget.content) {
            widget.content = {
              links: widget.links
            };
          }

          angular.forEach(widget.content.links, function (links) {
            if (links.external_url) {
              links.isExternal = true;
              widgetLinks.push(links);
            } else {
              widgetLinks.push(links);
            }
          });

          return {
            links: widgetLinks,
          };
        },
        /**
         * Hub Links
         *
         * @param widget
         *
         * @returns {{links: null}}
         */
        hublinks: function (widget) {
          angular.forEach(widget.content.links, function(v, k){
            if(widget.content.links[k].external_url)
              widget.content.links[k].link_type = 'link';
            else {
              widget.content.links[k].link_type = 'page';
              widget.content.links[k].page = widget.content.links[k].page.id;
            }
          });

          return {
            links: widget.content ? widget.content.links : null,
          };
        },
        /**
         * Sidebar Button
         *
         * @param widget
         *
         * @returns {{label: (*|null), url: (*|null), icon: (*|null)}}
         */
        sidebarbutton: function (widget) {
          return {
            label: widget.label || (widget.content ? widget.content.label : null),
            url: widget.url || (widget.content ? widget.content.external_url : null),
            icon: widget.icon || (widget.content ? widget.content.icon.id : null),
          };
        },
        /**
         * Highlighted Release
         *
         * @param widget
         *
         * @returns {{title: *, content: *}}
         */
        highlightedrelease: function (widget) {
          return {
            title: widget.title,
            content: widget.content,
          };
        },
        /**
         * Last Tv Programs
         *
         * @param widget
         *
         * @returns {{type: *}}
         */
        lasttvprograms: function (widget) {
          return {
            type: widget.type,
          };
        },
        /**
         * Communication Events
         *
         * @param widget
         *
         * @returns {{content: *, event: {selected: *}}}
         */
        comevents: function (widget) {
          return {
            content: widget.content,
            event: {
              selected: widget.content.event
            },
          };
        },
        /**
         * Communication Highlighted News
         *
         * @param widget
         *
         * @returns {{content: *, news: *[]}}
         */
        comhighlightnews: function (widget) {
          return {
            content: widget.content,
            news: [
              {
                selected: widget.content.news[0]
              },
              {
                selected: widget.content.news[1]
              },
            ],
          };
        },
        faq: function(widget) {
          console.log('faq >>>>>>', widget);

          widget.content.faq = widget.content.faq.id;

          console.log(widget.content);
          return {
            title: widget.title,
            content: widget.content,
          };
        },

        tagcloud: function(widget) {
          return {
            title: widget.title,
            type: widget.type,
            limit: widget.limit || (widget.content ? widget.content.limit : null),
          };
        },

        search: function(widget) {
          var postFilter;

          if (widget.post_filter_id && widget.post_filter_id.length <= 2) {

            postFilter = parseInt(widget.post_filter_id);
            console.log(postFilter);

            return {
              id: widget.id,
              post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
              post_filter_id: postFilter
            };

          } else if (widget.content) {

            if (widget.content.postFilterId && widget.content.postFilterId.length <= 2) {

              postFilter = parseInt(widget.content.postFilterId);
              console.log(postFilter);

              return {
                id: widget.id,
                post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
                post_filter_id: postFilter
              };

            } else {
              return {
                id: widget.id,
                post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
                post_filter_id: widget.post_filter_id || (widget.content ? widget.content.postFilterId : null),
              };
            }

          } else {
            return {
              id: widget.id,
              post_type: widget.post_type || (widget.content ? widget.content.post_type : null),
              post_filter_id: widget.post_filter_id || (widget.content ? widget.content.postFilterId : null),
            };
          }
        }

      };

      /**
       * @param $scope
       *
       * @private
       */
      var _prepareItems = function ($scope) {
        $scope.addItem = function (item, type) {
          if ($scope.widget[type]) {
            $scope.widget[type].push(item);
          } else {
            $scope.widget[type] = [];
            $scope.widget[type].push(item);
          }
        };

        $scope.removeItem = function (idx, type) {
          if ($scope.widget[type][idx]) {
            $scope.widget[type].splice(idx, 1);
          }
        };
      };

      /**
       * @param $scope
       *
       * @private
       */
      var _preparingNewsTypes = function ($scope) {
        $scope.news_types = [];

        NewsService.getNewsTypes().then(function (data) {
          $scope.news_types = data.data;
          $scope.news_types.items.push({
            id: '',
            name: "Todas"
          });

        });

        _getTags($scope);
      };

      /**
       * @param $scope
       *
       * @private
       */
      var _preparingNews = function ($scope) {
        $scope.news = [];

        NewsService.getNews().then(function (data) {
          $scope.news = data.data;
        });

        _getTags($scope);
      };

      /**
       * @param $scope
       *
       * @private
       */
      var _preparingGalleries = function ($scope) {
        $scope.galleries = [];

        GalleryService.getGalleries().then(function (data) {
          $scope.galleries = data.data;
        });

      };

      /**
       * @param $scope
       *
       * @private
       */
      var _preparingEvents = function ($scope) {
        $scope.events = [];

        EventsService.getEvents().then(function (data) {
          $scope.events = data.data;
        });
      };

      /**
       * @param $scope
       *
       * @private
       */

      var _preparingPostTypes = function ($scope) {
        $scope.post_types = [];

        PostTypeService.getPostTypes().then(function (data) {
          $scope.post_types = data.data;

          $scope.typeChanged = function() {

            $scope.options = [];

            for (var i = 0; i < $scope.post_types.items.length; ++i) {
              if ($scope.post_types.items[i].post_type == $scope.widget.post_type) {
                $scope.options = $scope.post_types.items[i].options || [];
              }
            }
          };

          $scope.typeChanged();
        });
      };


      // Partial preparing
      var _preparing = {
        /**
         * Highlighted Release
         *
         * @param $scope
         */
        highlightedrelease: function ($scope) {
          $scope.widget.content = $scope.widget.content || {};

          // Cover Image - Upload
          $scope.$watch('widget.content.image', function () {
            if ($scope.widget.content && $scope.widget.content.image instanceof File) {
              $scope.upload($scope.widget.content.image);
            }
          });

          $scope.upload = function (file) {
            MediaService.newFile(file).then(function (data) {
              $scope.widget.content.image = {
                url: data.url,
                id: data.id
              };
            });
          };

          $scope.removeImage = function () {
            $timeout(function () {
              $scope.widget.content.image = '';
              $scope.$apply();
            });
          };

          // Releases
          $scope.releases = {};

          ReleasesService.getReleases().then(function (data) {
            $scope.releases = data.data;
          });

          // Specialists
          $scope.addSpecialist = function () {
            if ($scope.widget.content.specialists) {
              $scope.widget.content.specialists.push({
                name: '',
                phone: '',
                title_job: '',
                email: '',
                opened: true
              });
            } else {
              $scope.widget.content.specialists = [];
              $scope.widget.content.specialists.push({
                name: '',
                phone: '',
                title_job: '',
                email: '',
                opened: true
              });
            }
          };

          $scope.removeSpecialist = function (idx) {
            $scope.widget.content.specialists.splice(idx, 1);
          };
        },
        /**
         * Sidebar Button
         *
         * @param $scope
         */
        sidebarbutton: function ($scope) {
          $scope.icons = [];

          MediaService.getIcons().then(function (data) {
            $scope.icons = data.data;
          });
        },
        relatednews: function($scope) {
          _preparingNewsTypes($scope);
        },
        listnews: function($scope) {
          _preparingNewsTypes($scope);
        },
        /**
         * Last Images Sidebar
         *
         * @param $scope
         */
        lastimagessidebar: function ($scope) {
          $scope.categories = [];

          GalleryService.getCategories().then(function (data) {
            $scope.categories = data.data;
          });
        },
        /**
         * @param $scope
         */
        internalmenu: function ($scope) {
          $scope.pages = [];
          $scope.widget.links = $scope.widget.links || [];

          $scope.addItem = function () {
            $scope.widget.links.push({
              title: '',
              url: '',
            });
          };

          $scope.removeItem = function (idx) {
            if ($scope.widget.links[idx]) {
              $scope.widget.links.splice(idx, 1);
            }
          };

          _getPages().then(function (data) {
            $scope.pages = data.data;
          });
        },
        /**
         * @param $scope
         */
        highlightedradionews: function ($scope) {
          _preparingNews($scope);
          _prepareItems($scope);
        },
        /**
         * @param $scope
         */
        highlightednewsvideo: function ($scope) {
          _preparingNews($scope);
          _prepareItems($scope);
        },
        /**
         * @param $scope
         */
        lasttvprograms: function ($scope) {
          _preparingNews($scope);
          _prepareItems($scope);
        },
        highlightednews: function ($scope) {
          _preparingNews($scope);
          _prepareItems($scope);
        },
        highlightedgalleries: _preparingGalleries,
        highlightedgallery: _preparingGalleries,
        highlightedevents: _preparingEvents,
        highlightedevent: _preparingEvents,
        gallery: _preparingGalleries,
        eventlist: _getTags,
        editorialnews: function ($scope) {
          _preparingNews($scope);
          _prepareItems($scope);
        },
        /**
         * @param $scope
         */
        comevents: function ($scope) {
          $scope.event = {};
          $scope.widget.content = $scope.widget.content || {};

          _preparingEvents($scope);
        },
        /**
         * @param $scope
         */
        comhighlightnews: function ($scope) {
          $scope.news = [];
          $scope.widget.content = $scope.widget.content || {};
          $scope.widget.content.news = $scope.widget.content.news || [];

          _preparingNews($scope);
        },
        /**
         * @param $scope
         */
        hublinks: function ($scope) {
          $scope.pages = [];
          $scope.widget.links = $scope.widget.links || [];

          $scope.addItem = function () {
            $scope.widget.links.push({
              title: '',
              url: '',
            });
          };

          $scope.removeItem = function (idx) {
            if ($scope.widget.links[idx]) {
              $scope.widget.links.splice(idx, 1);
            }
          };

          _getPages().then(function (data) {
            $scope.pages = data.data;
          });

          $scope.changeType = function(idx){
             if($scope.widget.links[idx].link_type == 'page')
               $scope.widget.links[idx].external_url = null;
             else
               $scope.widget.links[idx].page = null;
          };

          $scope.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
              return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
          };
        },
        faq: function($scope) {
          faqService.get().then(function(data){
            $scope.faqs = data.data.items;
          });
        },

        search: function ($scope) {
          _preparingPostTypes($scope);
        }
      };

      return {
        /**
         * @param {object} widget
         *
         * @returns {object}
         */
        parseWidgetToSave: function (widget) {
          clog('parseWidgetToSave >>>', widget);

          if (typeof _parseToSave[widget.type] !== 'undefined') {
            return _parseToSave[widget.type](widget);
          }
        },
        /**
         * @param {object} widget
         *
         * @returns {object}
         */
        parseWidgetToLoad: function (widget) {
          clog('parseWidgetToLoad >>>', widget);

          if (typeof _parseToLoad[widget.type] !== 'undefined') {
            return _parseToLoad[widget.type](widget);
          }
        },
        /**
         * @param $scope
         */
        preparePartial: function ($scope) {
          if (_preparing[$scope.widget.type]) {
            _preparing[$scope.widget.type]($scope);
          }
        },
        /**
         * @param $scope
         * @param column
         * @param idx
         */
        handle: function ($scope, column, idx) {
          var moduleModal = $uibModal.open({
            templateUrl: 'components/modal/module.modal.template.html',
            controller: 'ModuleModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              module: function () {
                if (typeof idx !== 'undefined') {
                  if ($scope.page)
                    return $scope.page.widgets[column][idx];
                  else
                    return $scope.course.widgets[column][idx];
                }

                return false;
              },
              widgets: function () {
                return $scope.widgets;
              },
            }
          });

          moduleModal.result.then(function (data) {
            if (typeof idx !== 'undefined') {
              if ($scope.page) {
                $scope.page.widgets[column][idx] = data;
              } else {
                $scope.course.widgets[column][idx] = data;
              }
            } else {
              if ($scope.page) {
                $scope.page.widgets[column].push(data);
              } else {
                $scope.course.widgets[column].push(data);
              }
            }
          });
        },
        /**
         * @param widget
         *
         * @returns {{}}
         */
        makeWidget: function (widget) {
          var obj = {};

          if (widget) {
            if (widget.id) {
              obj.id = widget.id;
            }

            obj.type = widget.type;
            obj.title = widget.title;

            angular.extend(obj, this.parseWidgetToSave(widget));
          }

          return obj;
        }
      };
    })(_getPages, $uibModal);

    return {
      // Columns defaults
      COLUMNS: [
        {
          value: 1,
          label: '1 coluna'
        },
        {
          value: 2,
          label: '2 colunas'
        }
      ],
      /**
       * @returns {*}
       */
      getPages: _getPages,
      /**
       * @param {object} page
       *
       * @returns {*}
       */
      addPage: function (page) {
        page = _parseData(page);

        return $http.post(apiUrl + '/page', page);
      },
      /**
       * @param {Number} id
       *
       * @returns {*}
       */
      getPage: function (id) {
        return $http.get(apiUrl + '/page/' + id);
      },
      /**
       * @param {Number} id
       * @param {object} page
       *
       * @returns {*}
       */
      updatePage: function (id, page) {
        page = _parseData(page);

        return $http.put(apiUrl + '/page/' + id, page);
      },
      /**
       * @param {Number} id
       *
       * @returns {*}
       */
      removePage: function (id) {
        return $http.delete(apiUrl + '/page/' + id);
      },
      /**
       * @returns {*}
       */
      module: function () {
        return _module;
      }
    };
  }
})();
