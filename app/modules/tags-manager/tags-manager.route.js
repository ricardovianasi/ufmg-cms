(function () {
    'use strict';

    angular.module('tagsManagerModule')
        .config(TagsConfigRoute);

    /** ngInject */
    function TagsConfigRoute($routeProvider) {
        $routeProvider
            .when('/tags-manager', {
                templateUrl: 'modules/tags-manager/tags-manager.template.html',
                controller: 'TagsController',
                controllerAs: 'tagsCtrl'
            });
    }
})();