;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('WidgetsService', [
      '$http',
      '$q',
      function ($http, $q) {
        console.log('... WidgetsService');

        return {
          /**
           * @returns {*}
           */
          getWidgets: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/widget').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param widgets
           */
          convertFromRaw: function (widgets) {
            widgets = [{}];

            angular.forEach(widgets, function (widget) {
              var obj = {};

              obj.id = widget.id;
              obj.type = widget.type;
              obj.title = widget.title;

              if (widget.type == 'text') {
                obj.text = widget.content ? widget.content.text : '';
              } else if (widget.type == 'gallery') {
                obj.gallery = widget.content ? widget.content.gallery.id : '';
              } else if (widget.type == 'highlightedgallery') {
                obj.gallery = widget.content ? widget.content.gallery.id : '';
              } else if (widget.type == 'highlightedgalleries') {
                obj.galleries = [];

                angular.forEach(widget.content.galleries, function (gallery) {
                  obj.galleries.push(gallery.id);
                });
              } else if (widget.type == 'lastimagessidebar') {
                obj.category = widget.content ? widget.content.category.id : '';
              } else if (widget.type == 'listnews') {
                obj.limit = widget.content ? widget.limit : '';
                obj.typeNews = widget.content ? widget.content.typeNews : '';
                obj.tag = widget.content ? widget.content.tag : '';
              } else if (widget.type == 'highlightednews') {
                obj.news = [];

                angular.forEach(widget.content.news, function (news) {
                  obj.news.push(news.id);
                });
              }
            });
          }
        };
      }
    ]);
})();
