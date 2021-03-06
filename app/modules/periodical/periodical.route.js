(function () {
    'use strict';

    angular.module('periodicalModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/periodical', {
                    templateUrl: 'modules/periodical/periodical.template.html',
                    controller: 'PeriodicalController',
                    controllerAs: 'periodicalCtrl'
                })
                .when('/periodical/new', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalNewController'
                })
                .when('/periodical/edit/:id', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalEditController'
                })
                .when('/periodical/view/:id', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalEditController'
                })
                .when('/periodical/:id/editions', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.template.html',
                    controller: 'PeriodicalEditionsController'
                })
                .when('/periodical/:id/editions/edit/:edition', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionEditController'
                })
                .when('/periodical/:id/editions/view/:edition', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionEditController'
                })
                .when('/periodical/:id/editions/new', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionNewController'
                });
        }]);
})();
