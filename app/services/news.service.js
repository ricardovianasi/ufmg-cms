;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NewsService', NewsService);

  NewsService.$inject = [
    '$http',
    '$filter',
    'apiUrl'
  ];

  function NewsService($http, $filter, apiUrl) {
    console.log('... NewsService');

    var NEWS_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'news');

    return {
      /**
       * @param id
       * @param page
       *
       * @returns {*}
       */
      getNews: function (id, page) {
        page = page || 1;

        var url = $filter('format')('{0}?page={1}', NEWS_ENDPOINT, page);

        if (id) {
          url = $filter('format')('{0}/{1}', NEWS_ENDPOINT, id);

          return $http.get(url);
        }

        return $http.get(url);
      },
      /**
       * @returns {*}
       */
      getNewsCategories: function () {
        return $http.get(apiUrl+'/news/category');
      },
      /**
       * @returns {*}
       */
      getNewsTypes: function () {
        return $http.get(apiUrl+'/news/type');
      },
      /**
       * @param data
       *
       * @returns {*}
       */
      postNews: function (data) {
        return $http.post(apiUrl+'/news', data);
      },
      /**
       * @param id
       * @param data
       *
       * @returns {*}
       */
      updateNews: function (id, data) {
        return $http.put(apiUrl+'/news/'+id, data);
      },
      /**
       * @param id
       *
       * @returns {*|{method}|boolean}
       */
      removeNews: function (id) {
        return $http.delete(apiUrl+'/news/'+id);
      }
    };
  }
})();
