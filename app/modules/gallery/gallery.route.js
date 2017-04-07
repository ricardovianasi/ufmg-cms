(function () {
    'use strict';

    angular.module('galleryModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/galleries', {
                    templateUrl: 'modules/gallery/gallery.template.html',
                    controller: 'GalleryController'
                })
                .when('/gallery/new', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryNewController',
                    resolve: {
                        VIEWER: ['Util', function (Util) {
                            Util.restoreOverflow();
                            return true;
                        }]
                    }
                })
                .when('/gallery/edit/:id', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryEditController',
                    resolve: {
                        VIEWER: ['Util', function (Util) {
                            Util.restoreOverflow();
                            return true;
                        }]
                    }
                })
                .when('/gallery/view/:id', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryEditController',
                    resolve: {
                        VIEWER: ['Util', function (Util) {
                            Util.restoreOverflow();
                            return false;
                        }]
                    }
                });
        }]);
})();
