(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('EventsService', EventsService);

    /** ngInject */
    function EventsService($http, $filter, DateTimeHelper, apiUrl, ServerService) {

        var EVENT_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'event');

        var _parseData = function (data) {
            var slug = typeof data.slug !== 'undefined' ? data.slug.slug : '';
            var faq = data.faq && data.faq.id ? data.faq.id : data.faq;

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
                slug: slug,
                faq: faq
            };

            if (data.photo) {
                event.photo = data.photo.id;
            }

            if (data.poster) {
                event.poster = data.poster.id;
            }

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

            event.post_date = convertPostDateToSend(data);

            return event;
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
            getEvents: function (params) {
                if (angular.isUndefined(params)) {
                    params = '';
                }
                let url = $filter('format')('{0}{1}', EVENT_ENDPOINT, params);

                return $http.get(url);
            },
            getEventsCategories: function () {
                let url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, 'category');
                return ServerService.getLoaded('eventsCategories', url, {useLoaded: true});
            },
            store: function (data) {
                data = _parseData(data);

                return $http.post(EVENT_ENDPOINT, data, { ignoreLoadingBar: true });
            },
            update: function (data, id) {
                let url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                data = _parseData(data);

                return $http.put(url, data, { ignoreLoadingBar: true });
            },
            destroy: function (id) {
                let url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                return $http.delete(url);
            },
            getEvent: function (id) {
                let url = $filter('format')('{0}/{1}', EVENT_ENDPOINT, id);

                return $http.get(url);
            }
        };
    }
})();
