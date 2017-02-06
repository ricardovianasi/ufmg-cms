(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersController', UsersController);

    /** ngInject */
    function UsersController($rootScope,
        UsersService,
        ModalService,
        NotificationService,
        authService,
        $log) {

        var vm = this;
        vm.remove = _remove;
        vm.normalize = _normalize;
        vm.activate = _activate;
        vm.reset = _reset;

        function onInit() {
            $rootScope.shownavbar = true;
            $log.info('UsersController');
            authService
                .account()
                .then(function (res) {
                    vm.User = res.data;
                    vm.isAdmin = res.data.is_administrator;
                });
            _loadUsers();
        }

        function _reset(idUser) {
            $log.warn('TODO: Reset password', idUser);
        }

        function _activate(user) {
            user.status = !user.status;
            $log.info('TODO: Status: ' + user.status);
        }

        function _normalize(value, value2) {
            if (value && !value2) {
                return value;
            } else if (!value && !value2) {
                return '';
            }
            return value + ' / ' + value2;
        }

        function _loadUsers() {
            UsersService
                .getUsers()
                .then(function (res) {
                    vm.users = res.data.items;
                });
        }

        function _remove(idUser) {
            $log.warn('TODO: Implementar', idUser);
        }

        onInit();
    }
})();
