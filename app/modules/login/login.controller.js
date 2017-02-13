(function () {
    'use strict';

    angular
        .module('loginModule')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope,
        authService,
        NotificationService,
        sessionService,
        PermissionService,
        $location,
        $log) {

        var vm = this;

        vm.credentials = {};
        vm.credentials.username = 'portal@portal';
        vm.credentials.password = 'teste';
        vm.login = _login;

        $rootScope.shownavbar = false;
        $log.info('LoginController');

        function _login(isValid) {
            $log.info(isValid);
            if (isValid) {
                authService
                    .autenticate(vm.credentials)
                    .then(function (res) {
                        sessionService.saveData(res.data);
                        authService
                            .account()
                            .then(function (res1) {
                                if (res1.data.status) {
                                    $rootScope.User = res1.data;
                                    PermissionService.initService(res1.data);
                                    sessionService.setIsLogged();
                                    $location.path('/');
                                } else {
                                    NotificationService.error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                                }
                            });
                    }, function (err) {
                        NotificationService.error('Usuário ou senha inválidos, tente novamente.');
                        vm.credentials.password = '';
                        $log.error(err);
                    });
            }

        }
    }
})();
