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
                        permission: ['PermissionService', '$window', '$routeParams',
                            function (PermissionService, $window, $routeParams) {
                                var hasAllow = PermissionService.canPost($routeParams.typeNews);
                                if (!hasAllow) {
                                    $window.location.href = '#/news/' + $routeParams.typeNews;
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
                                if (!PermissionService.canPut($routeParams.typeNews, $routeParams.id)) {
                                    $window.location.href = '#/news/' + $routeParams.typeNews;
                                }
                            }
                        ]
                    }
                });
        });
})();
