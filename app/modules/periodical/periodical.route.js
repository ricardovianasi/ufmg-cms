(function () {
    'use strict';

    angular.module('periodicalModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/periodical', {
                    templateUrl: 'modules/periodical/periodical.template.html',
                    controller: 'PeriodicalController'
                })
                .when('/periodical/new', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalNewController'
                })
                .when('/periodical/edit/:id', {
                    templateUrl: 'modules/periodical/periodical.form.template.html',
                    controller: 'PeriodicalEditController'
                })
                .when('/periodical/:id/editions', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.template.html',
                    controller: 'PeriodicalEditionsController'
                })
                .when('/periodical/:id/editions/edit/:id', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionEditController'
                })
                .when('/periodical/:id/editions/new', {
                    templateUrl: 'modules/periodical/editions/periodical-editions.edition.form.template.html',
                    controller: 'PeriodicalEditionNewController'
                });
        }]);
})();
