(function () {
    'use strict';

    angular.module('newMenuModule')
        .config(NewMenuModule);

    /** ngInject */
    function NewMenuModule($routeProvider) {
        $routeProvider
            .when('/new-menu', {
                templateUrl: 'modules/new-menu/new-menu.template.html',
                controller: 'NewMenuController',
                controllerAs: 'newMenu'
            });
    }
})();
