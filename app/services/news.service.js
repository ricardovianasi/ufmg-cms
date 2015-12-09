;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NewsService', NewsService);

  NewsService.$inject = [
    '$http',
    '$filter',
    '$q',
    'apiUrl'
  ];

  function NewsService($http, $filter, $q, apiUrl) {
    console.log('... NewsService');

    var NEWS_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'news');

    return {
      getNews: function (id, page) {
        page = page || 1;

        var deferred = $q.defer();
        var url = $filter('format')('{0}?page={1}', NEWS_ENDPOINT, page);

        if (id) {
          url = $filter('format')('{0}/{1}', NEWS_ENDPOINT, id);

          $http.get(url).then(function (data) {
            deferred.resolve(data);
          });

          return deferred.promise;
        }

        $http.get(url).then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      getNewsCategories: function () {
        var deferred = $q.defer();

        $http.get(apiUrl + '/news/category').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      getNewsTypes: function () {
        var deferred = $q.defer();

        $http.get(apiUrl + '/news/type').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      postNews: function (data) {
        var deferred = $q.defer();

        $http.post(apiUrl + '/news', data).then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      updateNews: function (id, data) {
        var deferred = $q.defer();

        $http.put(apiUrl + '/news/' + id, data).then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      removeNews: function (id) {
        var deferred = $q.defer();

        $http.delete(apiUrl + '/news/' + id).then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      }
      // success: function (title, msg) {
      //   toastr.success(title, msg)
      // },
      // error: function (title, msg) {
      //   toastr.error(title, msg)
      // },
      // warning: function (title, msg) {
      //   toastr.warning(title, msg)
      // }
    };
  }
})();
