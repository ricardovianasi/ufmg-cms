(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('UseTermService', UseTermService);

    /** ngInject */
    function UseTermService($http, apiUrl) {
        var urlTerm = apiUrl + '/term-of-use';
        var urlSigned = apiUrl + '/sign-term';

        var service = {
            getTerms: getTerms,
            updateTerm: updateTerm,
            signTerm: signTerm,
        };
        
        return service;

        ////////////////
        function getTerms() {
            return $http.get(urlTerm);
        }

        function updateTerm(data, id) {
            var base = urlTerm + '/' + id; 
            return $http.put(base, data);
        }

        function signTerm(idUser) {
            console.log({id: idUser});
            return $http.put(urlSigned, {id: idUser});
        }
    }
})();