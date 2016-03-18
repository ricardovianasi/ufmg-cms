;(function () {
  'use strict';

  angular.module('faqModule')
    .factory('faqService', faqService);

  faqService.$inject = [
    '$http',
    'apiUrl'
  ];

  function faqService($http, apiUrl) {
    console.log('... CourseService');

    return {
      save: _save,
      get: _get,
      remove: _remove,
      update: _update
    };


      /**
       *
       * @param data
       * @returns {*}
       * @private
       */
    function _save(data) {
     return $http.post(apiUrl + '/faq', data);
    }

    /**
     *
     * @param id
     * @returns {*}
       * @private
       */
    function _get(id) {
      var url = apiUrl + '/faq';

      if(id)
        url =  apiUrl + '/faq/' + id;

      return $http.get(url);

    }

      /**
       *
       * @param id
       * @returns {*}
       * @private
       */
    function _remove(id) {
      return $http.delete(apiUrl + '/faq/' + id);
    }

      /**
       *
       * @param data
       * @returns {*}
       * @private
       */
    function _update(data){
      var id = data.id;
      return $http.put(apiUrl + '/faq/' + id, data);
    }
  }
})();
