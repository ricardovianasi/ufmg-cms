;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('CourseService', [
      '$q',
      '$http',
      'apiUrl',
      function ($q, $http, apiUrl) {
        console.log('... CourseService');

        return {
          getCourseRoutes: function () {
            var deferred = $q.defer();

            $http.get(apiUrl + '/route').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getCourse: function (id) {
            var deferred = $q.defer();

            $http.get(apiUrl + '/route/' + id).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          updateCourse: function (id, course) {
            var deferred = $q.defer();

            var obj = {};
            obj.tags = course.tags;
            obj.cover = course.cover;
            obj.status = course.status;
            obj.description = course.description;

            if (obj.status == 'scheduled') {
              obj.scheduled_at = course.scheduled_date + ' ' + course.scheduled_time;
            }

            $http.put(apiUrl + '/route/' + id, obj).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getCourses: function () {
            var deferred = $q.defer();

            $http.get(apiUrl + '/course').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
        };
      }
    ]);
})();
