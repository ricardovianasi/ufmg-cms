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
    'TagsService'
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
                        TagsService) {
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
        cleanPage.scheduled_at = page.scheduled_date + ' ' + page.scheduled_time;
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
    };

    /**
     * @type {{parseWidgetToSave, parseWidgetToLoad, preparePartial, handle}}
     *
     * @private
     */
    var _module = (function (_getPages, $uibModal) {
      var _obj = {};

      // Parse widget object to send its data to webservice
      var _parseToSave = {
        /**
         * Text
         *
         * @param widget
         */
        text: function (widget) {
          _obj.text = widget.text || (widget.content ? widget.content.text : null);
        },
        /**
         * Highlighted Event
         *
         * @param widget
         */
        highlightedevent: function (widget) {
          _obj.event = widget.event_id || (widget.content ? widget.content.event.id : null);
        },
        /**
         * Highlighted Events
         *
         * @param widget
         */
        highlightedevents: function (widget) {
          if (widget.events) {
            _obj.events = widget.events;
          } else {
            if (widget.content.events) {
              var eventsToSelect = [];

              angular.forEach(widget.content.events, function (event) {
                eventsToSelect.push(event.id);
              });

              _obj.events = eventsToSelect;
            }
          }
        },
        /**
         * Gallery
         *
         * @param widget
         */
        gallery: function (widget) {
          _obj.gallery = widget.gallery_id || (widget.content ? widget.content.gallery.id : null);
        },
        /**
         * Highlighted Gallery
         *
         * @param widget
         */
        highlightedgallery: function (widget) {
          _obj.gallery = widget.gallery_id || (widget.content ? widget.content.gallery.id : null);
        },
        /**
         * Highlighted Galleries
         *
         * @param widget
         */
        highlightedgalleries: function (widget) {
          // var galleriesToSelect = [];
          //     angular.forEach(widget.content.galleries, function (gallery) {
          //       galleriesToSelect.push(gallery.id);
          //     });
          //     _obj.galleries = galleriesToSelect;

          _obj.galleries = widget.galleries ? widget.galleries : widget.content.galleries;
        },
        /**
         * Last Image Sidebar
         *
         * @param widget
         */
        lastimagessidebar: function (widget) {
          _obj.category = widget.category || (widget.content ? widget.content.category.id : null);
        },
        /**
         * List News
         *
         * @param widget
         */
        listnews: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.typeNews = widget.typeNews || (widget.content ? widget.content.typeNews : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Event List
         *
         * @param widget
         */
        eventlist: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Release List
         *
         * @param widget
         */
        releaselist: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
        },
        /**
         * Related News
         *
         * @param widget
         */
        relatednews: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.typeNews = widget.typeNews || (widget.content ? widget.content.typeNews : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Highlighted News
         *
         * @param widget
         */
        highlightednews: function (widget) {
          if (widget.news) {
            _obj.news = widget.news;
          } else {
            if (widget.content.news) {
              var newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push(news.id);
              });

              _obj.news = newsToSelect;
            }
          }
        },
        /**
         * Highlighted Radio News
         *
         * @param widget
         */
        highlightedradionews: function (widget) {
          _obj.news = widget.news;

          if (widget.news) {
            var newsToSelect = [];

            angular.forEach(widget.news, function (news) {
              newsToSelect.push(news.id);
            });

            _obj.news = newsToSelect;
          }
        },
        /**
         * Highlighted News Video
         *
         * @param widget
         */
        highlightednewsvideo: function (widget) {
          _obj.news = widget.news;

          if (widget.news) {
            var newsToSelect = [];

            angular.forEach(widget.news, function (news) {
              newsToSelect.push(news.id);
            });

            _obj.news = newsToSelect;
          }
        },
        /**
         * Editorial News
         *
         * @param widget
         */
        editorialnews: function (widget) {
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);

          if (widget.news) {
            _obj.news = widget.news;
          } else {
            if (widget.content.news) {
              var newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push(news.id);
              });
              _obj.news = newsToSelect;
            }
          }
        },
        /**
         * Internal Menu
         *
         * @param widget
         */
        internalmenu: function (widget) {
          var widgetLinks = [];
          var page;
          var external_url;

          angular.forEach(widget.links, function (links) {
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

          _obj.links = widgetLinks;
        },
        /**
         * Hub Links
         *
         * @param widget
         */
        hublinks: function (widget) {
          _obj.links = widget.content ? widget.content.links : null;
        },
        /**
         * Sidebar Button
         *
         * @param widget
         */
        sidebarbutton: function (widget) {
          _obj.label = widget.label || (widget.content ? widget.content.label : null);
          _obj.url = widget.url || (widget.content ? widget.content.external_url : null);
          _obj.icon = widget.icon || (widget.content ? widget.content.icon.id : null);
        },
        /**
         * Highlighted Release
         *
         * @param widget
         */
        highlightedrelease: function (widget) {
          _obj.title = widget.title;
          _obj.description = widget.content.description;
          _obj.release = widget.content.release;
          _obj.specialists = [];
          _obj.image = widget.content.image.id;

          angular.forEach(widget.content.specialists, function (specialist) {
            delete specialist.opened;

            _obj.specialists.push(specialist);
          });
        },
        /**
         * Last Tv Programs
         *
         * @param widget
         */
        lasttvprograms: function (widget) {
          _obj.type = widget.type;
          _obj.title = widget.title;
        },
        /**
         * Communication Events
         *
         * @param widget
         */
        comevents: function (widget) {
          _obj.type = widget.type;
          _obj.event = widget.content.event.id;
        },
        /**
         * @param widget
         */
        comhighlightnews: function (widget) {
          _obj.type = widget.type;
          _obj.news = [
            widget.content.news[0].id,
            widget.content.news[1].id,
          ];
        },
      };

      // Parse widget object from webservice data
      var _parseToLoad = {
        /**
         * Text
         *
         * @param widget
         */
        text: function (widget) {
          _obj.text = widget.text || (widget.content ? widget.content.text : null);
        },
        /**
         * Highlighted Event
         *
         * @param widget
         */
        highlightedevent: function (widget) {
          _obj.event = widget.event_id || (widget.content ? widget.content.event.id : null);
        },
        /**
         * Highlighted Events
         *
         * @param widget
         */
        highlightedevents: function (widget) {
          if (widget.events) {
            _obj.events = widget.events;
          } else {
            if (widget.content.events) {
              var eventsToSelect = [];

              angular.forEach(widget.content.events, function (event) {
                eventsToSelect.push(event.id);
              });

              _obj.events = eventsToSelect;
            }
          }
        },
        /**
         * @param widget
         */
        highlightednewsvideo: function (widget) {
          _obj.text = widget.text;

          if ('content' in widget) {
            _obj.news = widget.content.news;
          }
          else {
            _obj.news = widget.news;
          }

        },
        /**
         * Gallery
         *
         * @param widget
         */
        gallery: function (widget) {
          _obj.gallery = widget.gallery_id || (widget.content ? widget.content.gallery.id : null);
        },
        /**
         * Highlighted Gallery
         *
         * @param widget
         */
        highlightedgallery: function (widget) {
          _obj.gallery = widget.gallery_id || (widget.content ? widget.content.gallery.id : null);
        },
        /**
         * Highlighted Galleries
         *
         * @param widget
         */
        highlightedgalleries: function (widget) {
          // var galleriesToSelect = [];
          //     angular.forEach(widget.content.galleries, function (gallery) {
          //       galleriesToSelect.push(gallery.id);
          //     });
          //     _obj.galleries = galleriesToSelect;

          _obj.galleries = widget.galleries ? widget.galleries : widget.content.galleries;
        },
        /**
         * Last Image Sidebar
         *
         * @param widget
         */
        lastimagessidebar: function (widget) {
          _obj.category = widget.category || (widget.content ? widget.content.category.id : null);
        },
        /**
         * List News
         *
         * @param widget
         */
        listnews: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.typeNews = widget.typeNews || (widget.content ? widget.content.typeNews : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Event List
         *
         * @param widget
         */
        eventlist: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Release List
         *
         * @param widget
         */
        releaselist: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
        },
        /**
         * Related News
         *
         * @param widget
         */
        relatednews: function (widget) {
          _obj.limit = widget.limit || (widget.content ? widget.content.limit : null);
          _obj.typeNews = widget.typeNews || (widget.content ? widget.content.typeNews : null);
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);
        },
        /**
         * Highlighted News
         *
         * @param widget
         */
        highlightednews: function (widget) {
          if (widget.news) {
            _obj.news = widget.news;
          } else {
            if (widget.content.news) {
              var newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push(news.id);
              });

              _obj.news = newsToSelect;
            }
          }
        },
        /**
         * Editorial News
         *
         * @param widget
         */
        editorialnews: function (widget) {
          _obj.tag = widget.tag || (widget.content ? widget.content.tag : null);

          if (widget.news) {
            _obj.news = widget.news;
          } else {
            if (widget.content.news) {
              var newsToSelect = [];

              angular.forEach(widget.content.news, function (news) {
                newsToSelect.push(news.id);
              });
              _obj.news = newsToSelect;
            }
          }
        },
        /**
         * Internal Menu
         *
         * @param widget
         */
        internalmenu: function (widget) {

          var widgetlinks = [];

          angular.forEach(widget.content.links, function (links) {
            if (links.external_url) {
              links.isExternal = true;
              widgetlinks.push(links);
            } else {
              widgetlinks.push(links);
            }
          });

          _obj.links = widgetlinks;
        },
        /**
         * Hub Links
         *
         * @param widget
         */
        hublinks: function (widget) {
          _obj.links = widget.content ? widget.content.links : null;
        },
        /**
         * Sidebar Button
         *
         * @param widget
         */
        sidebarbutton: function (widget) {
          _obj.label = widget.label || (widget.content ? widget.content.label : null);
          _obj.url = widget.url || (widget.content ? widget.content.external_url : null);
          _obj.icon = widget.icon || (widget.content ? widget.content.icon.id : null);
        },
        /**
         * Highlighted Release
         *
         * @param widget
         */
        highlightedrelease: function (widget) {
          _obj.title = widget.title;
          _obj.content = widget.content;
        },
        /**
         * Last Tv Programs
         *
         * @param widget
         */
        lasttvprograms: function (widget) {
          _obj.type = widget.type;
        },
        /**
         * Communication Events
         *
         * @param widget
         */
        comevents: function (widget) {
          _obj.content = widget.content;
          _obj.event = {
            selected: widget.content.event
          };
        },
        /**
         * Communication Highlighted News
         *
         * @param widget
         */
        comhighlightnews: function (widget) {
          _obj.content = widget.content;
          _obj.news = [
            {
              selected: widget.content.news[0]
            },
            {
              selected: widget.content.news[1]
            },
          ];
        },
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
        relatednews: _preparingNewsTypes,
        listnews: _preparingNewsTypes,
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

          _prepareItems($scope);

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
        highlightednews: _preparingNews,
        highlightedgalleries: _preparingGalleries,
        highlightedgallery: _preparingGalleries,
        highlightedevents: _preparingEvents,
        highlightedevent: _preparingEvents,
        gallery: _preparingGalleries,
        eventlist: _getTags,
        editorialnews: _preparingNews,
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

        _prepareItems($scope);
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

      return {
        /**
         * @param {object} widget
         *
         * @returns {object}
         */
        parseWidgetToSave: function (widget) {
          clog('parseWidgetToSave >>>', widget);

          if (typeof _parseToSave[widget.type] !== 'undefined') {
            _parseToSave[widget.type](widget);
          }

          return _obj;
        },
        /**
         * @param {object} widget
         *
         * @returns {object}
         */
        parseWidgetToLoad: function (widget) {
          clog('parseWidgetToLoad >>>', widget);

          if (typeof _parseToLoad[widget.type] !== 'undefined') {
            _parseToLoad[widget.type](widget);
          }

          return _obj;
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
              if ($scope.page)
                $scope.page.widgets[column][idx] = data;
              else
                $scope.course.widgets[column][idx] = data;
            } else {
              if ($scope.page)
                $scope.page.widgets[column].push(data);
              else {
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
