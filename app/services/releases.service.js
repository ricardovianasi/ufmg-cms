(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('ReleasesService', ReleasesService);

    /** ngInject */
    function ReleasesService($http, $filter, DateTimeHelper, StatusService, apiUrl, $log) {
        $log.info('ReleasesService');

        var RELEASE_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'release');

        var _parseData = function (data) {

            var slug = typeof data.slug !== 'undefined' ? data.slug.slug : '';

            var obj = {
                id: data.id || null,
                title: data.title,
                subtitle: data.subtitle,
                thumb: data.thumb ? data.thumb.id : null,
                content: data.content,
                source: data.source,
                service: data.service,
                files: [],
                status: data.status,
                authorName: data.authorName,
                slug: slug
            };

            angular.forEach(data.files, function (value) {
                // TODO DELETE COMMENT
                var file = value;

                if (value.file !== '') {
                    file.file = value.id;
                }

                obj.files.push(file);
            });

            obj.post_date = convertPostDateToSend(data);

            return obj;
        };

        function convertPostDateToSend(data) {
            var datePost = new Date(data.scheduled_date);
            var dd = datePost.getDate();
            var mm = datePost.getMonth() + 1;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var yyyy = datePost.getFullYear();
            return dd + '/' + mm + '/' + yyyy + ' ' + data.scheduled_time;
        }

        return {
            getReleases: function (params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var url = $filter('format')('{0}?page={1}', RELEASE_ENDPOINT, params);

                return $http.get(url);
            },
            store: function (data) {
                data = _parseData(data);

                return $http.post(RELEASE_ENDPOINT, data, { ignoreLoadingBar: true });
            },
            update: function (data, id) {
                var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

                data = _parseData(data);

                return $http.put(url, data, { ignoreLoadingBar: true });
            },
            destroy: function (id) {
                var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

                return $http.delete(url);
            },
            getRelease: function (id) {
                var url = $filter('format')('{0}/{1}', RELEASE_ENDPOINT, id);

                return $http.get(url);
            }
        };
    }
})();
