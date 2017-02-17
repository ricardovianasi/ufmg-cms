(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersActionsController', UsersActionsController);

    /** ngInject */
    function UsersActionsController($routeParams,
        $log,
        UsersService,
        ResourcesService,
        PagesService,
        $uibModal,
        $location,
        NotificationService) {
        var vm = this;
        var userId = null;

        vm.tab = 1;
        vm.user = {};
        vm.user = {
            status: '1',
            is_administrator: "0"
        };
        vm.moderators = [];
        vm.resources = [];
        vm.pages = [];
        vm.save = _save;
        vm.setTab = _setTab;
        vm.isActive = _isActive;
        vm.modalGetContext = _modalGetContext;

        function onInit() {
            $log.info('UsersActionsController');
            _initPermissions();
            userId = $routeParams.userId ? $routeParams.userId : null;
            if (userId) {
                UsersService
                    .getUser(userId)
                    .then(function (data) {
                        vm.user = data.data;
                        _normalizeUser();
                        _convertPrivilegesToLoad();
                    });
            }
        }

        function _initPermissions() {
            _getModerators();
            _getResources();
        }

        function _normalizeUser() {
            // moderator
            var moderator = vm.user.moderator;
            if (moderator) {
                vm.user.moderator = moderator.id;
            }

            // status
            vm.user.status = vm.user.status ? "1" : "0";

            // Administrator
            vm.user.is_administrator = vm.user.is_administrator ? "1" : "0";

        }

        function _convertPrivilegesToLoad() {
            var convertedPerms = {};
            var permsToConvert = vm.user.resources_perms;
            Object.keys(permsToConvert).forEach(function (key) {
                permsToConvert[key].split(";").forEach(function (value) {

                    var item = value.split(":");
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
            vm.user.resources_perms = convertedPerms;
        }


        ////////////Function to clone perms Object and parse to save
        function _convertPrivilegesToSave() {
            // recursive function to clone an object. If a non object parameter
            // is passed in, that parameter is returned and no recursion occurs.
            function cloneObject(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }
                var temp = obj.constructor(); // give temp the original obj's constructor
                for (var key in obj) {
                    temp[key] = cloneObject(obj[key]);
                }
                return temp;
            }
            var clonedPerms = (cloneObject(vm.user.resources_perms));
            Object.keys(clonedPerms).forEach(function (k) {
                var innerKeys = Object.keys(clonedPerms[k]),
                    items = [];
                innerKeys.forEach(function (key) {
                    if (clonedPerms[k][key][0]) {
                        var permission = (Array.isArray(clonedPerms[k][key])) ? key : key + ":" + clonedPerms[k][key];
                        items.push(permission);
                    }
                });
                clonedPerms[k] = items.join(";");
            });
            vm.user.permissions = clonedPerms;
        }

        function _save(isValid) {
            if (!isValid) {
                NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
                return;
            }

            _convertPrivilegesToSave();

            if (userId) {
                UsersService
                    .updateUser(vm.user)
                    .then(function () {
                        $location.path('/users');
                        NotificationService.success('Usuário alterado com sucesso!');
                    });
            } else {
                UsersService
                    .saveUser(vm.user)
                    .then(function () {
                        $location.path('/users');
                        NotificationService.success('Usuário salvo com sucesso!');
                    });
            }
        }

        function _setTab(tabId) {
            vm.tab = tabId;
        }

        function _isActive(tabId) {
            return vm.tab === tabId;
        }

        function _getModerators() {
            UsersService
                .getUsers()
                .then(function (res) {
                    vm.moderators = res.data.items;
                });
        }

        function _modalGetContext(context, permission, contextName) {
            _openModal(context, permission, contextName)
                .result
                .then(function (contextPermissions) {
                    vm.user.resources_perms[context][permission] = contextPermissions;
                });

        }

        function _openModal(context, permission, contextName) {
            return $uibModal.open({
                templateUrl: 'modules/users/form/permission/users.permissions.model.html',
                controller: 'UsersPermissionModelController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    contextPermissions: function () {
                        vm.user.resources_perms = vm.user.resources_perms ? vm.user.resources_perms : {};
                        vm.user.resources_perms[context] = vm.user.resources_perms[context] ? vm.user.resources_perms[context] : {};
                        vm.user.resources_perms[context][permission] = vm.user.resources_perms[context][permission] ? vm.user.resources_perms[context][permission] : [];
                        return {
                            title: contextName,
                            context: context,
                            valuePermission: vm.user.resources_perms[context][permission]
                        };
                    }
                },
                size: 'xl',
            });
        }

        function _getResources() {
            ResourcesService
                .get()
                .then(function (res) {
                    vm.resources = res.data.items;
                });
        }

        onInit();
    }
})();
