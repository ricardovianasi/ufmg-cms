;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('CourseService', CourseService);

  CourseService.$inject = [
    '$http',
    '$filter',
    'apiUrl',
  ];

  /**
   * @param $http
   * @param $filter
   * @param apiUrl
   *
   * @returns {{getCourseRoutes: getCourseRoutes, getCourse: getCourse, updateCourse: updateCourse, getCourses: getCourses}}
   *
   * @constructor
   */
  function CourseService($http, $filter, apiUrl) {
    console.log('... CourseService');

    return {
      /**
       * @returns {HttpPromise}
       */
      getCourseRoutes: function () {
        return $http.get(apiUrl + '/route');
      },
      /**
       * @param id
       *
       * @returns {HttpPromise}
       */
      getCourse: function (type, id) {
        var url = $filter('format')('{0}/course/{1}/{2}/routes', apiUrl, type, id);

        return $http.get(url);
      },
      /**
       * @param id
       * @param course
       *
       * @returns {HttpPromise}
       */
      updateCourse: function (id, course) {
        var obj = {
          tags: course.tags,
          cover: course.cover,
          status: course.status,
          description: course.description,
        };

        if (obj.status == 'scheduled') {
          obj.scheduled_at = course.scheduled_date + ' ' + course.scheduled_time;
        }

        return $http.put(apiUrl + '/route/' + id, obj);
      },
      /**
       * @param type graduation, specialization, ...
       *
       * @returns {HttpPromise}
       */
      getCourses: function (type) {
        type = type || '';

        var url = $filter('format')('{0}/course/{1}', apiUrl, type);
        return $http.get(url);
      }
    };
  }
})();
