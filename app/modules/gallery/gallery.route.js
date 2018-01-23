(function () {
    'use strict';

    angular.module('galleryModule')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/gallery', {
                    templateUrl: 'modules/gallery/gallery.template.html',
                    controller: 'GalleryController'
                })
                .when('/gallery/new', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryNewController',
                    controllerAs: 'galleryCtrl',
                    resolve: {
                        VIEWER: function () {
                            return true;
                        }
                    }
                })
                .when('/gallery/edit/:id', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryEditController',
                    controllerAs: 'galleryCtrl',
                    resolve: {
                        VIEWER: function () {
                            return true;
                        }
                    }
                })
                .when('/gallery/view/:id', {
                    templateUrl: 'modules/gallery/gallery.form.template.html',
                    controller: 'GalleryEditController',
                    resolve: {
                        VIEWER: function () {
                            return false;
                        }
                    }
                });
        }]);
})();
