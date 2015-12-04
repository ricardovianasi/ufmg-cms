;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('PagesService', [
      '$http',
      '$q',
      '$filter',
      'ModuleService',
      function ($http, $q, $filter, ModuleService) {
        console.log('... PagesService');

        var PAGES_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'page');

        /**
         * @param {*} page
         *
         * @returns {*}
         *
         * @private
         */
        var _parseData = function (page) {
          var clean_page = {};

          clean_page.image = page.image ? page.image.id : null;
          clean_page.status = page.status;

          if (page.status == 'scheduled') {
            clean_page.scheduled_at = page.scheduled_date + ' ' + page.scheduled_time;
          }

          clean_page.tags = page.tags;
          clean_page.title = page.title;
          clean_page.slug = page.title;
          clean_page.widgets = {
            main: [],
            side: []
          };

          /**
           * @param {string} column
           * @param {*} widget
           */
          var makeWidget = function (column, widget) {
            var obj = {};

            if (widget) {
              if (widget.id) {
                obj.id = widget.id;
              }

              obj.type = widget.type;
              obj.title = widget.title;

              angular.extend(obj, ModuleService.parseWidgetToSave(widget));

              clean_page.widgets[column].push(obj);
            }
          };

          // Insert each widget into main and side columns
          angular.forEach(page.widgets.main, function (widget) {
            makeWidget('main', widget);
          });

          angular.forEach(page.widgets.side, function (widget) {
            makeWidget('side', widget);
          });

          // If we are updating the Page
          if (page.id) {
            clean_page.id = page.id;

            delete clean_page.created_at;
            delete clean_page.udpated_at;
            delete clean_page.scheduled_at;
          }

          return clean_page;
        };

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
          getPages: function (page) {
            page = page || 1;

            var deferred = $q.defer();
            var url = $filter('format')('{0}?page={1}', PAGES_ENDPOINT, page);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param {object} page
           *
           * @returns {*}
           */
          addPage: function (page) {
            var deferred = $q.defer();

            page = _parseData(page);

            $http.post(APIUrl + '/page', page).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param {Number} id
           *
           * @returns {*}
           */
          getPage: function (id) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/page/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param {Number} id
           * @param {object} page
           *
           * @returns {*}
           */
          updatePage: function (id, page) {
            var deferred = $q.defer();

            page = _parseData(page);

            $http.put(APIUrl + '/page/' + id, page).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param {Number} id
           *
           * @returns {*}
           */
          removePage: function (id) {
            var deferred = $q.defer();

            $http.delete(APIUrl + '/page/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
