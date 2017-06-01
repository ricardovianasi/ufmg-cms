(function () {
    'use strict';

    angular.module('newsModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/news', {
                    templateUrl: 'modules/news/news.template.html',
                    controller: 'NewsController',
                    controllerAs: 'ctrl'
                })
                .when('/news/new', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsNewController',
                    controllerAs: 'ctrl',
                    resolve: {
                        permission: ['PermissionService', '$window',
                            function (PermissionService, $window) {
                                if (!PermissionService.canPut('news')) {
                                    $window.location.href = '#/news';
                                }
                            }
                        ]
                    }
                })
                .when('/news/edit/:id', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsEditController',
                    controllerAs: 'ctrl',
                    resolve: {
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                if (!PermissionService.canPut('news', $routeParams.id)) {
                                    $window.location.href = '#/news';
                                }
                            }
                        ]
                    }
                });
        });
})();
