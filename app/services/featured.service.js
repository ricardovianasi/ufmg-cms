;(function(){
  'use strict';

  angular
    .module('serviceModule')
    .factory('featuredService', featuredService);

    featuredService.$inject = ['$http',
                              '$filter',
                              'apiUrl'];

    function featuredService($http, $filter, apiUrl){
      var FEATURED_ENDPOINT = $filter('format')('{0}/{1}', apiUrl, 'highlighted-press');

      return {
        save: save,
        get: get,
        destroy: destroy,
        update: update,
        getFeatured: getFeatured
      };

      /**
       * save function
       * @param  {object} data featured objetct
       * @return {promise}      promise $http
       */
      function save(data){
        return $http.post(apiUrl+'/highlighted-press', data);
      }

      /**
       * get function
       * @return {promise} promise $http
       */
      function get(){
        return $http.get(apiUrl+'/highlighted-press');
      }

      /**
       * destroy function
       * @param  {int} id featured id
       * @return {promise}    promise $http
       */
      function destroy(id){
        var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
        return $http.delete(url);
      }

      /**
       * update function
       * @param  {object} data featured object
       * @param  {int} id   id featured
       * @return {promise}      $http promise
       */
      function update(id, data) {
        var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
        return $http.put(url, data);
      }

      /**
       * getFeatured function
       * @return {promise} $http promise
       */
      function getFeatured(id){
        var url = $filter('format')('{0}/{1}', FEATURED_ENDPOINT, id);
        return $http.get(url);
      }


    }
})();
