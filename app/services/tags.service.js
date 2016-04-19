;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('TagsService', TagsService);

  TagsService.$inject = [
    '$http',
    '$q',
    'apiUrl',
    '$filter'
  ];

  function TagsService($http, $q, apiUrl, $filter) {
    console.log('... TagsService');


    /**
     *
      * @param tags
     * @returns {Array}
     * @private
       */
    function  _tagsForTagsInput(tags) {
      var tagsForTagsInput = [];

      angular.forEach(tags, function(v, k) {
        tagsForTagsInput.push({
          text: tags[k].name
        });
      });

      return tagsForTagsInput;
    }

    return {
      getTags: function () {
        var deferred = $q.defer();

        $http.get(apiUrl+'/tag').then(function (data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },
      findTags: function($query, tags) {
        var allTags = _tagsForTagsInput(tags);
        return $filter('filter')(allTags, $query);
      }
    };
  }
})();
