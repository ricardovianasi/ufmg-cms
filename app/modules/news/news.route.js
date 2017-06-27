(function () {
    'use strict';

    angular.module('newsModule')
        /**ngInject */
        .config(function ($routeProvider) {
            $routeProvider
                .when('/news/:typeNews', {
                    templateUrl: 'modules/news/news.template.html',
                    controller: 'NewsController'
                })
                .when('/news/:typeNews/new', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsNewController',
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
                .when('/news/:typeNews/edit/:id', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsEditController',
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
