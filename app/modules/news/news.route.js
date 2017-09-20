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
                    controller: 'NewsNewController'
                })
                .when('/news/:typeNews/edit/:id', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsEditController'
                })
                .when('/news/:typeNews/view/:id', {
                    templateUrl: 'modules/news/news.form.template.html',
                    controller: 'NewsEditController'
                });
        });
})();
