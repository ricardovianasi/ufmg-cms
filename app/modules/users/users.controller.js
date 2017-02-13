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
            var status = user.status ? 'desativar' : 'ativar';
            ModalService
                .confirm('Você deseja ' + status + ' o usuário <b>' + user.name + '</b>?', ModalService.MODAL_SMALL)
                .result
                .then(function () {
                    user.status = !user.status;
                    UsersService.updateUser(_normalizeUser(user));
                });
        }

        function _normalizeUser(user) {
            // moderator
            var moderator = user.moderator;
            if (moderator) {
                user.moderator = moderator.id;
            }

            return user;
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

        onInit();
    }
})();
