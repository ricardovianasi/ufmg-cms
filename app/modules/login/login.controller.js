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
        // vm.credentials.username = 'portal@portal';
        // vm.credentials.password = 'teste';
        vm.login = _login;

        $rootScope.shownavbar = false;
        $log.info('LoginController');

        function _login(isValid) {
            $log.info(isValid);
            if (isValid) {
                authService
                    .autenticate(vm.credentials)
                    .then(function (data) {
                        sessionService.saveData(data.data);
                        sessionService.setIsLogged();
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
