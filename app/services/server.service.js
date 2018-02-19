(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('ServerService', ServerService);

    /** ngInject */
    function ServerService($http, $q) {
        let dataLoaded = { };

        var service = {
            getLoaded: getLoaded,
            clearData: clearData,
            getData: getData,
            setData: setData
        };
        
        return service;

        ////////////////

        function getData(keyData) {
            return dataLoaded[keyData];
        }

        function setData(keyData, data) {
            dataLoaded[keyData] = data;
        }

        function clearData(key) {
            delete dataLoaded[key];
        }

        function getLoaded(keyData, url, config) {
            if(dataLoaded[keyData] && config.useLoaded) {
                let defer = $q.defer();
                defer.resolve(getData(keyData));
                return defer.promise;
            }
            return _get(keyData, url, config);
        }
        
        function _get(keyData, url, config) {
            return $http.get(url)
                .then(function(data) {
                    if(config.useLoaded) {
                        setData(keyData, data);
                    }
                    return data;
                });
        }
    }
})();