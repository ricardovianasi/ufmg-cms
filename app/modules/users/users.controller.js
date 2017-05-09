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
        dataTableConfigService,
        Util,
        authService,
        $log) {
        $log.info('UsersController');

        var vm = this;
        vm.normalize = _normalize;
        vm.activate = _activate;
        vm.reset = _reset;
        $rootScope.shownavbar = true;

        vm.dtInstance = {};

        onInit();

        function onInit() {
            _renderDataTable();
        }

        function _renderDataTable() {
            var numberOfColumns = 5;
            var columnsHasNotOrder = [1, 2, 4];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'name'
            }, {
                index: 3,
                name: 'email'
            }]);

            function getUsers(params, fnCallback) {
                UsersService
                    .getUsers(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.users = res.data.items;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);

                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getUsers);
        }

        function _reset(user) {
            ModalService
                .confirm('Deseja resetar a senha do usuário <b>' + user.name + '</b> para 12345?',
                    ModalService.MODAL_SMALL)
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

        function _permissions() {
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('user');
        }
    }
})();
