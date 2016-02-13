;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('CourseService', CourseService);

  CourseService.$inject = [
    '$http',
    '$filter',
    'apiUrl',
    'PagesService',
  ];

  /**
   * @param $http
   * @param $filter
   * @param apiUrl
   * @param PagesService
   *
   * @returns {{getCourseRoutes: getCourseRoutes, getCourse: getCourse, updateCourse: updateCourse, getCourses: getCourses}}
   *
   * @constructor
   */
  function CourseService($http, $filter, apiUrl, PagesService) {
    console.log('... CourseService');

    /**
     * @param widgets
     *
     * @returns {{sidebar: Array}}
     *
     * @private
     */
    var _parseData = function (widgets) {
      var cleanData = {
        sidebar: [],
      };

      angular.forEach(widgets, function (widget) {
        cleanData.sidebar.push(PagesService.module().makeWidget(widget));
      });

      return cleanData;
    };

    return {
      /**
       * @param type
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
       * @param id
       */
      getCourseRoute: function(type, id){
        var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, id);

        return $http.get(url);
      },
      /**
       *
       * @param type
       * @param courseId
       */
      getCourse: function (type, courseId) {
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
       * @param {string} type graduation, specialization, ...
       * @param {boolean} slug true or false
       *
       * @returns {HttpPromise}
       */
      getCourses: function (type, slug) {
        type = type || '';
        var url = '';

        if (slug)
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
       *
       * @returns {HttpPromise}
       */
      uploadCourseCover: function (type, course_id, cover_id) {
        var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);
        var data = {
          cover: cover_id
        };

        return $http.put(url, data);
      },
      /**
       * @param type
       * @param obj
       *
       * @returns {*}
       */
      updateCourses: function (type, obj) {
        var url = $filter('format')('{0}/course/{1}', apiUrl, type);

        var data = _parseData(obj);

        return $http.put(url, data);
      },
      /**
       *
       * @param type
       * @param course_id
       * @param obj
       * @returns {*}
       */
      updateRoutesSidebar: function (type, course_id, obj) {
        var url = $filter('format')('{0}/course/{1}/{2}', apiUrl, type, course_id);


        var data = _parseData(obj);


        return $http.put(url, data);
      }
    };
  }
})();
