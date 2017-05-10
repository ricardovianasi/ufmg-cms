(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersFormController', UsersFormController);

    /** ngInject */
    function UsersFormController($routeParams,
        $log,
        $q,
        UsersService,
        ResourcesService,
        PagesService,
        $uibModal,
        Util,
        $timeout,
        $location,
        NotificationService) {
        var vm = this;
        var userId = null;
        var hasRequest = false;
        var countPage = 1;

        vm.tab = 1;
        vm.user = {};
        vm.user = {
            status: '1',
            is_administrator: '0'
        };
        vm.currentElement = 0;
        vm.moderators = [];
        vm.resources = [];
        vm.pages = [];
        vm.save = _save;
        vm.setTab = _setTab;
        vm.isActive = _isActive;
        vm.modalGetContext = _modalGetContext;

        function onInit() {
            $log.info('UsersFormController');
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

        vm.loadMoreUser = function (search) {
            reset(vm.moderators);
            loadMore(vm.moderators, search)
                .then(function (data) {
                    vm.moderators = Object.assign(vm.moderators, data);
                });
        };

        function reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function loadMore(dataTemp, search) {
            var defer = $q.defer();
            var searchQuery = 'name';
            if (search || !hasRequest) {
                if (search) {
                    countPage = 1;
                    dataTemp = [];
                } else {
                    if (countPage === 1) {
                        dataTemp = [];
                    }
                    hasRequest = true;
                }
                var params = {
                    page: countPage,
                    page_size: 10,
                    order_by: {
                        field: 'name',
                        direction: 'ASC'
                    },
                    search: search
                };
                if (!params.search && countPage === 1) {
                    vm.currentElement = 0;
                }
                UsersService
                    .getUsers(Util.getParams(params, searchQuery))
                    .then(function (res) {
                        countPage++;
                        vm.currentElement += res.data.items.length;
                        if (res.data.total > vm.currentElement && 10 >= res.data.items.length) {
                            $timeout(function () {
                                hasRequest = false;
                            }, 100);
                        }
                        for (var index = 0; index < res.data.items.length; index++) {
                            dataTemp.push(res.data.items[index]);
                        }
                        defer.resolve(dataTemp);
                    });
            }
            return defer.promise;
        }

        function _initPermissions() {
            _getResources();
        }

        function _normalizeUser() {
            // moderator
            var moderator = vm.user.moderator;
            if (moderator) {
                vm.user.moderator = moderator.id;
            }

            // status
            vm.user.status = vm.user.status ? '1' : '0';

            // Administrator
            vm.user.is_administrator = vm.user.is_administrator ? '1' : '0';

        }

        function _convertPrivilegesToLoad() {
            if (angular.isUndefined(vm.user.resources_perms)) {
                return;
            }
            var convertedPerms = {};
            var permsToConvert = vm.user.resources_perms;
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
            vm.user.resources_perms = convertedPerms;
        }


        function _convertPrivilegesToSave() {
            if (angular.isUndefined(vm.user.resources_perms)) {
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
            var clonedPerms = (cloneObject(vm.user.resources_perms));
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
                        vm.user.resources_perms[context] = vm.user.resources_perms[context] ?
                            vm.user.resources_perms[context] : {};
                        vm.user.resources_perms[context][permission] = vm.user.resources_perms[context][permission] ?
                            vm.user.resources_perms[context][permission] : [];
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
