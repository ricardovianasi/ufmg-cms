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
                        sessionService.setIsLogged();
                        $rootScope.User = res.data;
                        $location.path('/');
                    }, function (err) {
                        NotificationService.error('Usuário ou senha inválidos, tente novamente.');
                        vm.credentials.password = '';
                        $log.error(err);
                    });
            }

        }
    }
})();
