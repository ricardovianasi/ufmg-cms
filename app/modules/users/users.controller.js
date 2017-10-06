(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersController', UsersController);

    /** ngInject */
    function UsersController(
        $rootScope,
        UsersService,
        ModalService,
        NotificationService,
        PermissionService,
        dataTableConfigService,
        Util,
        authService,
        ENV,
        $log
    ) {
        $log.info('UsersController');

        var vm = this;
        vm.normalize = _normalize;
        vm.activate = _activate;
        vm.reset = _reset;

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

            var desenvMode = (ENV === 'development' || ENV === 'test');

            if (desenvMode) {
                if (user.email === 'portal@portal') {
                    ModalService
                        .confirm('Por favor, não reset esta senha!',
                            ModalService.MODAL_SMALL);
                    return;
                }
            }
            ModalService
                .confirm('Deseja resetar a senha do usuário <b>' + user.name + '</b> para 12345?',
                    ModalService.MODAL_SMALL)
                .result
                .then(function () {
                    UsersService
                        .getUser(user.id)
                        .then(function (res) {
                            res.data.password = '12345';
                            res.data.temp_password = '12345';
                            res.data.required_password_change = true;
                            _normalizeUser(res.data);
                            _convertPrivilegesToLoad(res.data);
                            _convertPrivilegesToSave(res.data);
                            UsersService.updateUser(res.data);
                        });
                });
        }

        function _normalizeUser(user) {
            // moderator
            var moderator = user.moderator;
            if (moderator) {
                user.moderator = moderator.id;
            }

            // status
            user.status = user.status ? '1' : '0';

            // Administrator
            user.is_administrator = user.is_administrator ? '1' : '0';

        }

        function _convertPrivilegesToLoad(user) {
            if (angular.isUndefined(user.resources_perms)) {
                return;
            }
            var convertedPerms = {};
            var permsToConvert = user.resources_perms;
            Object.keys(permsToConvert).forEach(function (key) {
                permsToConvert[key].split(';').forEach(function (value) {
                    var item = value.split(':');
                    var permsToConvert = convertedPerms[key] || {};

                    if (item.length > 1) {
                        permsToConvert[item[0]] = item[1];
                        convertedPerms[key] = permsToConvert;
                    } else {
                        permsToConvert[item[0]] = [item[0]];
                        convertedPerms[key] = permsToConvert;
                    }
                });
            });
            user.resources_perms = convertedPerms;
        }

        function _convertPrivilegesToSave(user) {
            if (angular.isUndefined(user.resources_perms)) {
                return;
            }

            function cloneObject(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                var temp = obj.constructor();
                for (var key in obj) {
                    temp[key] = cloneObject(obj[key]);
                }
                return temp;
            }
            var clonedPerms = (cloneObject(user.resources_perms));
            Object.keys(clonedPerms).forEach(function (k) {
                var innerKeys = Object.keys(clonedPerms[k]),
                    items = [];
                innerKeys.forEach(function (key) {
                    if (clonedPerms[k][key][0]) {
                        var permission = (Array.isArray(clonedPerms[k][key])) ? key : key + ':' + clonedPerms[k][key];
                        items.push(permission);
                    }
                });
                clonedPerms[k] = items.join(';');
            });
            user.permissions = clonedPerms;
        }

        function _activate(user) {
            var status = user.status ? 'desativar' : 'ativar';
            ModalService
                .confirm('Você deseja ' + status + ' o usuário <b>' + user.name + '</b>?', ModalService.MODAL_SMALL)
                .result
                .then(function () {
                    UsersService
                        .getUser(user.id)
                        .then(function (res) {
                            user.status = !user.status;
                            res.data.status = !res.data.status;
                            _normalizeUser(res.data);
                            _convertPrivilegesToLoad(res.data);
                            _convertPrivilegesToSave(res.data);
                            UsersService.updateUser(res.data);
                        });
                });
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
