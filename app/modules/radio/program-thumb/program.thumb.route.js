(function () {
    'use strict';

    angular.module('radioModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/radio_thumb/program-list', {
                    templateUrl: 'modules/radio/program-thumb/program-thumb.list.template.html',
                    controller: 'ProgramThumbListController',
                    controllerAs: 'vm'
                })
                .when('/radio_thumb/edit/:id', {
                    templateUrl: 'modules/radio/program-thumb/program-thumb.template.html',
                    controller: 'ProgramThumbController',
                    controllerAs: 'vm'
                })
                .when('/radio_thumb/view/:id', {
                    templateUrl: 'modules/radio/program-thumb/program-thumb.template.html',
                    controller: 'ProgramThumbController',
                    controllerAs: 'vm'
                });
        });
})();