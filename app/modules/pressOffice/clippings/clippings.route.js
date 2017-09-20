(function () {
    'use strict';

    angular
        .module('clippingsModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/clipping', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.template.html',
                    controller: 'ClippingsController'
                })
                .when('/clipping/new', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsNewController'
                })
                .when('/clipping/edit/:id', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsEditController'
                })
                .when('/clipping/view/:id', {
                    templateUrl: 'modules/pressOffice/clippings/clippings.form.template.html',
                    controller: 'ClippingsEditController'
                });
        });
})();
