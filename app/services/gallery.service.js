;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('GalleryService', [
      '$q',
      '$http',
      '$filter',
      function ($q, $http, $filter) {
        console.log('... GalleryService');

        var GALLERY_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'gallery');

        return {
          /**
           * @param page
           *
           * @returns {*}
           */
          getGalleries: function (page) {
            page = page || 1;

            var deferred = $q.defer();
            var url = $filter('format')('{0}?page={1}', GALLERY_ENDPOINT, page);

            $http.get(url).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          getGallery: function (id) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/gallery/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param gallery
           *
           * @returns {*}
           */
          newGallery: function (gallery) {
            var deferred = $q.defer();

            $http.post(APIUrl + '/gallery', gallery).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           * @param gallery
           *
           * @returns {*}
           */
          updateGallery: function (id, gallery) {
            var deferred = $q.defer();

            $http.put(APIUrl + '/gallery/' + id, gallery).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @param id
           *
           * @returns {*}
           */
          removeGallery: function (id) {
            var deferred = $q.defer();

            $http.delete(APIUrl + '/gallery/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          /**
           * @returns {*}
           */
          getCategories: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/gallery/category').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
