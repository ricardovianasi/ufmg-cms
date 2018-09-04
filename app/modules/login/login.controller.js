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
        ENV,
        ModalService,
        $location,
        $log) {

        var vm = this;
        vm.ENV = ENV;
        vm.rememberMe = false;
        vm.desenvMode = (ENV === 'development' || ENV === 'test');

        vm.credentials = {};
        if (vm.desenvMode) {
            vm.credentials.username = 'portal@portal';
            vm.credentials.password = '123456';
        }
        vm.login = _login;

        if ($rootScope.$uibModalInstance) {
            $rootScope.$uibModalInstance.close();
        }

        $rootScope.shownavbar = false;
        $log.info('LoginController');

        function _login(isValid) {
            $log.info(isValid);
            if (isValid) {
                authService.autenticate(vm.credentials, vm.rememberMe)
                    .then(function (userAccount) {
                        if (userAccount.status) {
                            $rootScope.shownavbar = true;
                            PermissionService.initService(userAccount)
                                .then(function () {
                                    $rootScope.modalLoginIsDisabled = true;
                                    sessionService.setIsLogged();
                                    changePassword(userAccount);
                                    $location.path('/');
                                });
                        } else {
                            NotificationService.error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                        }
                    }, function (err) {
                        NotificationService.error('Usuário ou senha inválidos, tente novamente.');
                        $log.error(err);
                    });
            }

            function changePassword(user) {
                if (user.required_password_change) {
                    ModalService.loginChangePassword();
                }
            }
        }
    }
})();
