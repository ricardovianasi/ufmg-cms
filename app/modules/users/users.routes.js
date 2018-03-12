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
                }).when('/user/permission', {
                    templateUrl: 'modules/users/form/permission/modules-permission-modal/modules-permission.template.html',
                    controller: 'ModulesPermissionController',
                    controllerAs: 'vm',
                    resolve: {
                        dataPermissionModule: [function() { 
                            return [ {idPage: 20, module: 'comevents', permissions: [
                                {value: false, label: 'Excluir', type: 'delete'},
                                {value: false, label: 'Editar', type: 'put'},
                                {value: false, label: 'Criar', type: 'create'} 
                            ]} ];
                        }],
                        currentUser: [function() { return 'Lucas'; }]
                    }
                });
        });
})();
