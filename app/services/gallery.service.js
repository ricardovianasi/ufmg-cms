(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('GalleryService', GalleryService);

    /** ngInject */
    function GalleryService($q, $http, $filter, apiUrl, $log) {
        $log.info('GalleryService');

        var GALLERY_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'gallery');

        return {
            getGalleries: function (page) {
                page = page || 1;
                var url = $filter('format')('{0}?page={1}', GALLERY_ENDPOINT, page);

                return $http.get(url);
            },
            getGallery: function (id) {
                return $http.get(apiUrl + '/gallery/' + id);
            },
            newGallery: function (gallery) {
                return $http.post(apiUrl + '/gallery', gallery);
            },
            updateGallery: function (id, gallery) {
                return $http.put(apiUrl + '/gallery/' + id, gallery);
            },
            removeGallery: function (id) {
                return $http.delete(apiUrl + '/gallery/' + id);
            },
            getCategories: function () {
                return $http.get(apiUrl + '/gallery/category');
            }
        };
    }
})();
