(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('featuredService', featuredService);

    /** ngInject */
    function featuredService($http, $filter, apiUrl) {
        var FEATURED_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'highlighted-press');

        return {
            save: save,
            getFeatureds: getFeatureds,
            destroy: destroy,
            update: update,
            getFeatured: getFeatured
        };

        function save(data) {
            return $http.post(apiUrl + '/highlighted-press', data);
        }

        function getFeatureds(params) {
            if (angular.isUndefined(params)) {
                params = '';
            }
            return $http.get(apiUrl + '/highlighted-press' + params);
        }

        function destroy(id) {
            var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
            return $http.delete(url);
        }

        function update(id, data) {
            var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
            return $http.put(url, data);
        }

        function getFeatured(id) {
            var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
            return $http.get(url);
        }

    }
})();
