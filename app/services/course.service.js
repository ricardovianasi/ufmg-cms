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
       * @param id
       *
       * @returns {HttpPromise}
       */
      getCourseRoutes: function (type, id) {
        var url = $filter('format')('{0}/course/{1}/{2}/routes', apiUrl, type, id);

        return $http.get(url);
      },
      /**
       *
       * @param type
       * @param courseId
       * @param id
       */
      getCourse: function(type, courseId) {
        var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, courseId);

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
       * @param {bolean} slug true or false
       * @returns {HttpPromise}
       */
      getCourses: function (type, slug) {
        type = type || '';
        var url = '';

        if(slug)
          url = $filter('format')('{0}/course?search=slug%3D{1}', apiUrl, type);
        else
          url = $filter('format')('{0}/course/{1}', apiUrl, type);

        return $http.get(url);
      },
      /**
       *
       * @param type
       * @param course_id
       * @param cover_id
       * @returns {HttpPromise}
       */
      uploadCourseCover: function(type, course_id, cover_id) {
        var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);
        var data = {
          cover: cover_id
        };

        return $http.put(url, data);
      },
      updateCourses: function(type, obj) {
        var url = $filter('format')('{0}/course/{1}', apiUrl, type);
        var data = {
          sidebar: obj
        };

        return $http.put(url, data);
      }
    };
  }
})();
