(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ServerService', ServerService);

    /** ngInject */
    function ServerService($http, $q) {
        let dataLoaded = { };

        var service = {
            getLoaded: getLoaded
        };
        
        return service;

        ////////////////
        function getLoaded(keyData, url, config) {
            console.log('getLoaded', dataLoaded);
            if(dataLoaded[keyData] && config.useLoaded) {
                let defer = $q.defer();
                defer.resolve(dataLoaded[keyData]);
                return defer.promise;
            }
            return _get(keyData, url, config);
        }
        
        function _get(keyData, url, config) {
            return $http.get(url)
                .then(function(data) {
                    if(config.useLoaded) {
                        dataLoaded[keyData] = data;
                    }
                    return data;
                });
        }
    }
})();