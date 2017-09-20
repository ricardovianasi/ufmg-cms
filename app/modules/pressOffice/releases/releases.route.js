(function () {
    'use strict';

    angular
        .module('releasesModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/release', {
                    templateUrl: 'modules/pressOffice/releases/releases.template.html',
                    controller: 'ReleasesController'
                })
                .when('/release/new', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesNewController'
                })
                .when('/release/edit/:id', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesEditController'
                })
                .when('/release/view/:id', {
                    templateUrl: 'modules/pressOffice/releases/releases.form.template.html',
                    controller: 'ReleasesEditController'
                });
        });
})();
