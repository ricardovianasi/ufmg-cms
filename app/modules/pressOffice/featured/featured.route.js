(function () {
    'use strict';

    angular
        .module('featuredModule')
        /** ngInject */
        .config(function ($routeProvider) {

            $routeProvider
                .when('/highlighted_press', {
                    templateUrl: 'modules/pressOffice/featured/featured.template.html',
                    controller: 'FeaturedController'
                })
                .when('/highlighted_press/new', {
                    templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
                    controller: 'featuredNewController'
                })
                .when('/highlighted_press/edit/:id', {
                    templateUrl: 'modules/pressOffice/featured/featured.form.template.html',
                    controller: 'featuredEditController'
                });
        });
})();
