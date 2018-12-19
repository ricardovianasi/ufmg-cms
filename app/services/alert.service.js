(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('AlertService', AlertService);

    /** ngInject */
    function AlertService() {
        var service = {
            alerts:alerts
        };

        return service;

        ////////////////
        function alerts() {

        }
    }
})();
