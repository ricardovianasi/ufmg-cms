;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('GalleryService', GalleryService);

  GalleryService.$inject = [
    '$q',
    '$http',
    '$filter',
    'apiUrl'
  ];

  function GalleryService($q, $http, $filter, apiUrl) {
    clog('... GalleryService');

    var GALLERY_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'gallery');

    return {
      /**
       * @param page
       *
       * @returns {*}
       */
      getGalleries: function (page) {
        page = page || 1;
        var url = $filter('format')('{0}?page={1}', GALLERY_ENDPOINT, page);

        return $http.get(url);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      getGallery: function (id) {
        return $http.get(apiUrl + '/gallery/' + id);
      },
      /**
       * @param gallery
       *
       * @returns {*}
       */
      newGallery: function (gallery) {
        return $http.post(apiUrl + '/gallery', gallery);
      },
      /**
       * @param id
       * @param gallery
       *
       * @returns {*}
       */
      updateGallery: function (id, gallery) {
        return $http.put(apiUrl + '/gallery/' + id, gallery);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      removeGallery: function (id) {
        return $http.delete(apiUrl + '/gallery/' + id);
      },
      /**
       * @returns {*}
       */
      getCategories: function () {
        return $http.get(apiUrl + '/gallery/category');
      }
    };
  }
})();
