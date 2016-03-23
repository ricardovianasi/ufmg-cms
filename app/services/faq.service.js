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

    var _parseData = function(faq) {
      var obj = faq;

      if(obj.categories.length > 0) {
        angular.forEach(obj.categories, function(v, k) {
          obj.items.push({
            question: obj.categories[k].name,
            children: obj.categories[k].items
          });
        });

        delete obj.categories;
      }

      return obj;
    };


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
        console.log('oiiiiii');
      var obj = _parseData(data);
     return $http.post(apiUrl + '/faq', obj);
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
      var obj = _parseData(data);
      return $http.put(apiUrl + '/faq/' + id, obj);
    }
  }
})();
