(function () {
    'use strict';

    angular.module('radioModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/radio_programming/programs', {
                    templateUrl: 'modules/radio/program/programs.template.html',
                    controller: 'ProgramsController',
                    controllerAs: 'vm'
                })
                .when('/radio_programming/new', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'ProgramFormController',
                    controllerAs: 'vm'
                })
                .when('/radio_programming/edit/:id', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'ProgramFormController',
                    controllerAs: 'vm'
                })
                .when('/radio_programming/view/:id', {
                    templateUrl: 'modules/radio/program/program.form.template.html',
                    controller: 'ProgramFormController',
                    controllerAs: 'vm'
                })
                .when('/radio_programming_grid', {
                    templateUrl: 'modules/radio/radio-programming/radio-programming.template.html',
                    controller: 'RadioProgrammingController',
                    controllerAs: 'vm'
                })
                .when('/radio_category/category-list', {
                    templateUrl: 'modules/radio/category/category.list.template.html',
                    controller: 'CategoryListController',
                    controllerAs: 'vm'
                })
                .when('/radio_genre/genre-list', {
                    templateUrl: 'modules/radio/genre/genre.list.template.html',
                    controller: 'GenreListController',
                    controllerAs: 'vm'
                });
        });
})();