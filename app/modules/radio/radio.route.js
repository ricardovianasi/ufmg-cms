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
                .when('/radio_programming_grid/view', {
                    templateUrl: 'modules/radio/programming-grid/grid-view/programming-grid-view.template.html',
                    controller: 'GridViewController',
                    controllerAs: 'vm'
                })
                .when('/radio_programming_grid/handle', {
                    templateUrl: 'modules/radio/programming-grid/grid-edit/programming-grid-edit.template.html',
                    controller: 'GridEditController',
                    controllerAs: 'vm'
                })
                .when('/radio_category/parent-list', {
                    templateUrl: 'modules/radio/program-parent/program-parent.list.template.html',
                    controller: 'ParentListController',
                    controllerAs: 'vm'
                })
                .when('/radio_genre/genre-list', {
                    templateUrl: 'modules/radio/genre/genre.list.template.html',
                    controller: 'GenreListController',
                    controllerAs: 'vm'
                });
        });
})();