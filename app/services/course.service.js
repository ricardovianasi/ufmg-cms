;(function () {
  'use strict';

  angular.module('ServiceModule')
    .factory('CourseService', [
      '$q',
      '$http',
      function ($q, $http) {
        console.log('... CourseService');

        return {
          getCourseRoutes: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/route').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          // addCourse: function () {
          //   var deferred = $q.defer();
          //   $http.post(APIUrl+'', ).then(function(data){
          //     deferred.resolve(data);
          //   })
          //   return deferred.promise;
          // },
          getCourse: function (id) {
            var deferred = $q.defer();

            $http.get(APIUrl + '/route/' + id).then(function (data) {
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

            $http.put(APIUrl + '/route/' + id, obj).then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          },
          getCourses: function () {
            var deferred = $q.defer();

            $http.get(APIUrl + '/course').then(function (data) {
              deferred.resolve(data);
            });

            return deferred.promise;
          }
          // removeCourse: function () {
          //   var deferred = $q.defer();
          //   $http.delete(APIUrl+'', ).then(function(data){
          //     deferred.resolve(data);
          //   })
          //   return deferred.promise;
          // }
        };
      }
    ]);
})();
