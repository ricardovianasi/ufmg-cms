;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('PeriodicalService', PeriodicalService);

  PeriodicalService.$inject = [
    '$http',
    '$filter',
    '$uibModal',
    'apiUrl',
  ];

  /**
   * @param $http
   * @param $filter
   * @param $uibModal
   * @param apiUrl
   *
   * @returns {{getPeriodicalEditions: getPeriodicalEditions, getEdition: getEdition, newEdition: newEdition, updateEdition: updateEdition, removeEdition: removeEdition, getPeriodicals: getPeriodicals, newPeriodical: newPeriodical, updatePeriodical: updatePeriodical, removePeriodical: removePeriodical}}
   *
   * @constructor
   */
  function PeriodicalService($http, $filter, $uibModal, apiUrl) {
    console.log('... PeriodicalService');

    var APIUrl = apiUrl;
    var PERIODICAL_ENDPOINT = $filter('format')('{0}/{1}', APIUrl, 'periodical');

    return {
      /**
       * @param id
       *
       * @returns {*}
       */
      getPeriodicalEditions: function (id) {
        return $http.get(APIUrl + '/periodical/' + id + '/editions');
      },
      /**
       * @param id
       * @param edition
       *
       * @returns {*}
       */
      getEdition: function (id, edition) {
        return $http.get(APIUrl + '/periodical/' + id + '/edition/' + edition);
      },
      /**
       * @param id
       * @param data
       *
       * @returns {*}
       */
      newEdition: function (id, data) {
        return $http.post(APIUrl + '/periodical/' + id + '/edition', data);
      },
      /**
       * @param id
       * @param edition
       * @param data
       *
       * @returns {*}
       */
      updateEdition: function (id, edition, data) {
        return $http.put(APIUrl + '/periodical/' + id + '/edition/' + edition, data);
      },
      /**
       * @param id
       * @param edition
       *
       * @returns {*}
       */
      removeEdition: function (id, edition) {
        return $http.delete(APIUrl + '/periodical/' + id + '/edition/' + edition);
      },
      /**
       * @param id
       * @param page
       *
       * @returns {*}
       */
      getPeriodicals: function (id, page) {
        page = page || 1;

        var url = $filter('format')('{0}?page={1}', PERIODICAL_ENDPOINT, page);

        if (id) {
          url = $filter('format')('{0}/{1}', PERIODICAL_ENDPOINT, id);
        }

        clog('url >>>', url);

        return $http.get(url);
        //return $http.get(APIUrl + '/periodical?page=' + page);
      },
      /**
       * @param data
       *
       * @returns {*}
       */
      newPeriodical: function (data) {
        return $http.post(APIUrl + '/periodical', data);
      },
      /**
       * @param id
       * @param data
       *
       * @returns {*}
       */
      updatePeriodical: function (id, data) {
        return $http.put(APIUrl + '/periodical/' + id, data);
      },
      /**
       * @param id
       *
       * @returns {*}
       */
      removePeriodical: function (id) {
        return $http.delete(APIUrl + '/periodical/' + id);
      },
      /**
       * @param $scope
       * @param idx
       * @param article
       */
      handleArticle: function ($scope, idx, article) {
        var articleModal = $uibModal.open({
          templateUrl: 'components/modal/article.modal.template.html',
          controller: 'ArticleModalController',
          backdrop: 'static',
          size: 'lg',
          resolve: {
            article: function () {
              if (typeof article !== 'undefined') {
                return article;
              }

              return false;
            }
          }
        });

        articleModal.result.then(function (data) {
          if (typeof idx !== 'undefined') {
            $scope.edition.articles[idx] = data;
          } else {
            $scope.edition.articles.push(data);
          }
        });
      }
    };
  }
})();
