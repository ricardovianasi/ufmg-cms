;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('ModuleService', [
      'MediaService',
      'NewsService',
      'ReleasesService',
      'TagsService',
      function (MediaService, NewsService, ReleasesService, TagsService) {
        console.log('... ModuleService');

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
            _obj.news = widget.content.news;
            // if (widget.news) {
            //   _obj.news = widget.news;
            // } else {
            //   if (widget.content.news) {
            //     var newsToSelect = [];

            //     angular.forEach(widget.content.news, function (news) {
            //       newsToSelect.push(news.id);
            //     });

            //     _obj.news = newsToSelect;
            //   }
            // }
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
            _obj.links = widget.content ? widget.content.links : null;
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
          }
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
            _obj.news = widget.content.news;
            // if (widget.news) {
            //   _obj.news = widget.news;
            // } else {
            //   if (widget.content.news) {
            //     var newsToSelect = [];

            //     angular.forEach(widget.content.news, function (news) {
            //       newsToSelect.push(news.id);
            //     });

            //     _obj.news = newsToSelect;
            //   }
            // }
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
            _obj.links = widget.content ? widget.content.links : null;
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
          }
        };

        /**
         * @param $scope
         *
         * @private
         */
        var _preparingNews = function ($scope) {
          $scope.news_types = [];
          $scope.tags = [];

          NewsService.getNewsTypes().then(function (data) {
            $scope.news_types = data.data;
          });

          TagsService.getTags().then(function (data) {
            $scope.tags = data.data[0];
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
              console.log(data);
              $scope.icons = data.data;
            });
          },
          relatednews: _preparingNews,
          listnews: _preparingNews
        };

        return {
          /**
           * @param {object} widget
           *
           * @returns {object}
           */
          parseWidgetToSave: function (widget) {
            console.log('>>> parseWidgetToSave', widget);

            _parseToSave[widget.type](widget);

            return _obj;
          },
          /**
           * @param {object} widget
           *
           * @returns {object}
           */
          parseWidgetToLoad: function (widget) {
            console.log('>>> parseWidgetToLoad', widget);

            _parseToLoad[widget.type](widget);

            return _obj;
          },
          /**
           * @param $scope
           */
          preparePartial: function ($scope) {
            if (_preparing[$scope.widget.type]) {
              _preparing[$scope.widget.type]($scope);
            }
          }
        };
      }
    ]);
})();
