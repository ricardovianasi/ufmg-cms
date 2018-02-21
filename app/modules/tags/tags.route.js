(function () {
    'use strict';

    angular.module('tagsModule')
        .config(TagsConfigRoute);

    /** ngInject */
    function TagsConfigRoute($routeProvider) {
        $routeProvider
            .when('/tags', {
                templateUrl: 'modules/tags/tags.template.html',
                controller: 'TagsController',
                controllerAs: 'tagsCtrl'
            });
    }
})();