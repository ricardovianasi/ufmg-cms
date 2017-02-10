(function () {
    'use strict';

    angular.module('app')
        .run(Run);

    /** ngInject */
    function Run($rootScope, dataTableConfigService, sessionService, $route, DTDefaultOptions) {
        $rootScope.dtOptions = dataTableConfigService.init();

        $rootScope.logout = function () {
            sessionService.removeToken();
            sessionService.removeIsLogged();
            $route.reload();
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');

    }
})();
