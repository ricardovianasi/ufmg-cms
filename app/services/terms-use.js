(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('Service', Service);

    /** ngInject */
    function Service($http) {
        var urlTerm = '/term-of-use';
        var urlSigned = '/sign-term';

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
            return $http.put(urlSigned, {id: idUser});
        }
    }
})();