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
        PermissionService,
        authService,
        $log) {

        var vm = this;
        vm.normalize = _normalize;
        vm.activate = _activate;
        vm.reset = _reset;

        function onInit() {
            $rootScope.shownavbar = true;
            $log.info('UsersController');
            _loadUsers();
        }

        function _reset(user) {
            ModalService
                .confirm('Deseja resetar a senha do usuário <b>' + user.name + '</b> para 12345?', ModalService.MODAL_SMALL)
                .result
                .then(function () {
                    user.password = '12345';
                    UsersService.updateUser(_normalizeUser(user));
                });
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
                    _permissions();
                });
        }

        function _permissions() {
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('user');
        }

        onInit();
    }
})();
