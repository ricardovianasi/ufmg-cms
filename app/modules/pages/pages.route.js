(function () {
    'use strict';

    angular.module('pagesModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/page', {
                    templateUrl: 'modules/pages/pages.template.html',
                    controller: 'PagesController'
                })
                .when('/page/new', {
                    templateUrl: 'modules/pages/pages.form.template.html',
                    controller: 'PagesNewController'
                })
                .when('/page/edit/:id', {
                    templateUrl: 'modules/pages/pages.form.template.html',
                    controller: 'PagesEditController'
                })
                .when('/page/view/:id', {
                    templateUrl: 'modules/pages/pages.form.template.html',
                    controller: 'PagesEditController'
                });
        });
})();
