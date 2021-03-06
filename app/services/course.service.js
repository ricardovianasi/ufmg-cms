(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('CourseService', CourseService);

    /**ngInject */
    function CourseService($http, $filter, apiUrl, WidgetsService, ServerService) {

        let KEY_COURSES_BASE = 'courses';

        function _parseCoursesData(widgets) {
            let cleanData = {
                sidebar: WidgetsService.parseListWidgetsToSave(widgets)
            };
            return cleanData;
        }

        function _parseCourseData(course) {
            var obj = {
                tags: _.map(course.tags, 'text'), // jshint ignore: line
                cover: course.cover,
                status: course.status,
                description: course.description,
                name: course.name,
            };

            if (obj.status === 'scheduled') {
                obj.scheduled_at = course.scheduled_date + ' ' + course.scheduled_time;
            }
            return obj;
        }

        function _prepareUrlToGetCourses(type, slug, params) {
            type =  type ? '/' + type : '';
            params = angular.isUndefined(params) ? '' : params;
            let url = $filter('format')('{0}/course{1}{2}', apiUrl, type, params);
            return url;
        }
        
        return {
            getCourseRoutes: function (type, id) {
                var url = $filter('format')('{0}/course/{1}/{2}/routes', apiUrl, type, id);
                return $http.get(url);
            },
            getCourseRoute: function (type, id) {
                var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, id);
                return $http.get(url);
            },
            getCourse: function (type, courseId, id) {
                var url = $filter('format')('{0}/course/{1}/{2}/routes/{3}', apiUrl, type, courseId, id);
                return $http.get(url);
            },
            updateCourse: function (id, course) {
                var obj = _parseCourseData(course);
                return $http.put(apiUrl + '/route/' + id, obj);
            },
            getCourses: function (type, slug, params) {
                let url = _prepareUrlToGetCourses(type, slug, params);
                let configGet = { useLoaded: angular.isUndefined(params) };
                let keyData = KEY_COURSES_BASE + (type || '');
                return ServerService.getLoaded(keyData, url, configGet);
            },
            uploadCourseCover: function (type, course_id, cover_id) {
                var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);
                var data = {
                    cover: cover_id
                };
                return $http.put(url, data);
            },
            updateCourses: function (type, obj) {
                var url = $filter('format')('{0}/course/{1}', apiUrl, type);
                var data = _parseCoursesData(obj);
                return $http.put(url, data);
            },
            updateRoutesSidebar: function (type, course_id, obj) {
                var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);
                var data = _parseCoursesData(obj);
                return $http.put(url, data);
            },
            updateTypeCourse: function (type, course_id, data) {
                var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);
                return $http.put(url, data);
            },
            updateCoursesLocal: function (type, data) {
                if(!ServerService.hasData(KEY_COURSES_BASE)) { return; }
                let dataLocalCourses = ServerService.getData(KEY_COURSES_BASE);
                dataLocalCourses.data.items.forEach(function(course, i) {
                    if (course.slug === type) {
                        dataLocalCourses.data.items[i] = data;
                    }
                });
                ServerService.setData(KEY_COURSES_BASE, dataLocalCourses);
            }
        };
    }
})();
