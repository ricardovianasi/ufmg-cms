(function () {
    'use strict';

    angular.module('useTermModule')
        .config(TagsConfigRoute);

    /** ngInject */
    function TagsConfigRoute($routeProvider) {
        $routeProvider
            .when('/use-term', {
                templateUrl: 'modules/use-term/use-term.template.html',
                controller: 'UseTermController',
                controllerAs: 'vm'
            });
    }
})();