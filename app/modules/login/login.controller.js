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
                authService
                    .autenticate(vm.credentials)
                    .then(function (res) {
                        sessionService.saveData(res.data, vm.rememberMe);
                        authService
                            .get()
                            .then(function (res1) {
                                var dataUser = res1;
                                var user = dataUser.data;
                                if (user.status) {
                                    $rootScope.dataUser = dataUser;
                                    PermissionService
                                        .initService(user)
                                        .then(function () {
                                            $rootScope.modalLoginIsDisabled = true;
                                            sessionService.setIsLogged();
                                            changePassword(user);
                                            $location.path('/');
                                        });
                                } else {
                                    NotificationService.error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                                }
                            });
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
