(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('EventsService', EventsService);

    /** ngInject */
    function EventsService($http, $filter, DateTimeHelper, $log, apiUrl) {
        $log.info('EventsService');

        var EVENT_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'event');

        var _parseData = function (data) {
            var slug = typeof data.slug != 'undefined' ? data.slug.slug : '';

            var event = {
                address: data.address,
                audio: data.audio,
                courses: data.courses,
                datasheet: data.datasheet,
                description: data.description,
                duration: data.duration,
                email: data.email,
                free: data.free,
                highlight: data.highlight,
                investment: data.investment,
                local: data.local,
                name: data.name,
                phone: data.phone,
                registration: data.registration,
                site: data.site,
                status: data.status,
                type: data.type,
                video: data.video,
                slug: slug
            };

            if (data.photo) {
                event.photo = data.photo.id;
            }

            if (data.poster) {
                event.poster = data.poster.id;
            }

            var initTime = new Date(data.initTime);
            var endTime = new Date(data.endTime);

            event.initDate = new Date(data.initDate);
            event.initDate = DateTimeHelper.toBrStandard(event.initDate, true);

            event.endDate = new Date(data.endDate);
            event.endDate = DateTimeHelper.toBrStandard(event.endDate, true);
            event.init_hour = data.init_hour;
            event.end_hour = data.end_hour;

            event.tags = _.map(data.tags, 'text');

            // If we are updating the Event
            if (data.id) {
                event.id = data.id;
                // delete data.author;
                // delete data.slug;
                // delete data.created_at;
                // delete data.updated_at;
            }

            if (data.status == 'scheduled') {
                event.post_date = data.scheduled_date + ' ' + data.scheduled_time;
                // delete data.scheduled_date;
                // delete data.scheduled_time;
            }

            return event;
        };

        return {
            getEvents: function (params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                var url = $filter('format')('{0}{1}', EVENT_ENDPOINT, params);

                return $http.get(url);
            },
            getEventsCategories: function () {
                var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, 'category');

                return $http.get(url);
            },
            store: function (data) {
                data = _parseData(data);

                return $http.post(EVENT_ENDPOINT, data);
            },
            update: function (data, id) {
                var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                data = _parseData(data);

                return $http.put(url, data);
            },
            destroy: function (id) {
                var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                return $http.delete(url);
            },
            getEvent: function (id) {
                var url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                return $http.get(url);
            }
        };
    }
})();
