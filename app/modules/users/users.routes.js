(function () {
    'use strict';

    angular.module('usersModule')
        /** ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/user', {
                    templateUrl: 'modules/users/users.html',
                    controller: 'UsersController',
                    controllerAs: 'vm'
                })
                .when('/user/new', {
                    templateUrl: 'modules/users/form/users.form.html',
                    controller: 'UsersFormController',
                    controllerAs: 'vm'
                })
                .when('/user/edit/:userId', {
                    templateUrl: 'modules/users/form/users.form.html',
                    controller: 'UsersFormController',
                    controllerAs: 'vm'
                });
        });
})();
