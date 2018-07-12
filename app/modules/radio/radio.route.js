(function () {
    'use strict';

    angular.module('radioModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/radio/programs', {
                    templateUrl: 'modules/radio/program/programs.template.html',
                    controller: 'ProgramsController'
                })
                .when('/radio/new-program', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'ProgramFormController',
                    controllerAs: 'vm'
                })
                .when('/radio/edit/:id', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'RadioFormController'
                })
                .when('/radio/view/:id', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'RadioFormController'
                })
                .when('/radio/radio-programming', {
                    templateUrl: 'modules/radio/radio-programming/radio-programming.template.html',
                    controller: 'RadioProgrammingController'
                });
        });
})();