(function () {
    'use strict';

    angular.module('app')
        .run(Run);

    /** ngInject */
    function Run($rootScope, dataTableConfigService, sessionService, $route, DTDefaultOptions, PermissionService) {
        var startPermission = false;
        $rootScope.dtOptions = dataTableConfigService.init();

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            console.log(startPermission);
            if (!startPermission) {
                PermissionService.initService();
                startPermission = true;
            }
        });

        $rootScope.logout = function () {
            sessionService.removeToken();
            sessionService.removeIsLogged();
            $route.reload();
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');

    }
})();
