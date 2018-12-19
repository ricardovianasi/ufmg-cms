(function () {
    'use strict';

    angular.module('alertPortalModule')
        .config(AlertRoutes);

    /** ngInject */
    function AlertRoutes($routeProvider) {
        $routeProvider
            .when('/alert', {
                templateUrl: 'modules/alert/alert.html',
                controller: 'alertController',
                controllerAs: 'alertCtrl'
            }).when('/alert/edit/:id', {
                templateUrl: 'modules/alert/alert.form.html',
                controller: 'alertFormController',
                controllerAs: 'vm'
            }).when('/alert/new', {
                templateUrl: 'modules/alert/alert.form.html',
                controller: 'alertFormController',
                controllerAs: 'vm'
            });
    }
})();
