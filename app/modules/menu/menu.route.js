(function () {
    'use strict';

    angular.module('menuModule')
        .config(MenuModule);
    /** ngInject */
    function MenuModule($routeProvider) {
        $routeProvider
            .when('/menu', {
                templateUrl: 'modules/menu/menu.template.html',
                controller: 'MenuController',
                controllerAs: 'vm'
            });
    }
})();
