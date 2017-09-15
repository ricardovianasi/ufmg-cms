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
        PeriodicalService,
        CourseService,
        Util,
        $timeout,
        $location,
        $scope,
        NotificationService) {
        var vm = this;
        var userId = null;
        var hasRequest = false;
        var countPage = 1;
        var isLoadAccordion = {};
        vm.listPermissions = {};

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
            _getResources();
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
                        $location.path('/user');
                        NotificationService.success('Usuário alterado com sucesso!');
                    });
            } else {
                UsersService
                    .saveUser(vm.user)
                    .then(function () {
                        $location.path('/user');
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

        function _contextPermissions(contextName) {
            var resp = [];
            vm.user.resources_perms = vm.user.resources_perms ? vm.user.resources_perms : {};
            vm.user.resources_perms[contextName] = vm.user.resources_perms[contextName] ?
                vm.user.resources_perms[contextName] : {};
            vm.user.resources_perms[contextName] = vm.user.resources_perms[contextName] ?
                vm.user.resources_perms[contextName] : [];

            for (var key in vm.user.resources_perms[contextName]) {
                if (vm.user.resources_perms[contextName].hasOwnProperty(key)) {
                    if (angular.isString(vm.user.resources_perms[contextName][key])) {
                        resp.push({
                            context: contextName,
                            valuePermission: vm.user.resources_perms[contextName][key],
                            permission: key
                        });
                    }
                }
            }
            return resp;
        }

        function contextData(op, permission) {
            var defer = $q.defer();
            switch (op) {
                case 'page':
                    PagesService
                        .getPages()
                        .then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                case 'editions':
                    PeriodicalService
                        .getPeriodicals()
                        .then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                case 'course_graduation':
                    CourseService
                        .getCourses('graduation').then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                case 'course_specialization':
                    CourseService
                        .getCourses('specialization').then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                case 'course_master':
                    CourseService
                        .getCourses('master').then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                case 'course_doctorate':
                    CourseService
                        .getCourses('doctorate').then(function (res) {
                            defer.resolve({
                                data: res.data.items,
                                permission: permission
                            });
                        })
                        .catch(function () {
                            defer.resolve(false);
                        });
                    break;
                default:
                    defer.resolve(false);
                    break;
            }
            return defer.promise;
        }

        function _mountItem(contextName, item) {
            if (contextName === 'page') {
                return {
                    id: item.id,
                    title: item.title
                };
            } else if (contextName === 'editions') {
                return {
                    id: item.id,
                    title: item.name
                };
            } else if (contextName.substr(0, 6) === 'course') {
                return {
                    id: item.id,
                    title: item.name
                };
            }
            return false;
        }

        vm.loadContextData = function (contextName) {
            if (angular.isDefined(isLoadAccordion[contextName])) {
                return;
            }
            isLoadAccordion[contextName] = true;
            var contextPermissions = _contextPermissions(contextName);
            for (var index = 0; index < contextPermissions.length; index++) {
                var element = contextPermissions[index];
                if (element.valuePermission) {
                    contextData(contextName, element.permission)
                        .then(function (res) {
                            var listContext = res.data;
                            vm.listPermissions[contextName] = {};
                            vm.listPermissions[contextName][res.permission] = _mountListPermissionContextId(listContext, element);
                            angular.element('#' + contextName + '_' + res.permission).prop('indeterminate', true);
                        });
                }
            }
        };

        function _mountListPermissionContextId(listContext, contextPermissions) {
            var selecteds = [];
            var isString = angular.isString(contextPermissions.valuePermission);
            var countIsVerify = 0;
            if (isString) {
                var arraycontextPermissions = contextPermissions.valuePermission.split(',');
                for (var i = 0; i < listContext.length; i++) {
                    var item = listContext[i];
                    for (var j = 0; j < arraycontextPermissions.length; j++) {
                        var contextId = arraycontextPermissions[j];
                        if (item.id.toString() === contextId.toString()) {
                            selecteds.push(_mountItem(contextPermissions.context, item));
                            listContext[i] = null;
                            countIsVerify++;
                            break;
                        }
                    }
                    item = null;
                }
            }
            return selecteds;
        }

        vm.checkListContext = function (context, permission) {
            if (vm.resources[context].select[0] === permission) {
                if (angular.isUndefined(vm.user.resources_perms)) {
                    vm.user.resources_perms[context] = {};
                }
                if (!vm.user.resources_perms[context][permission]) {
                    vm.user.resources_perms[context][permission] = [];
                }
                if (vm.user.resources_perms[context][permission][0] !== permission) {
                    vm.user.resources_perms[context][permission] = false;
                    vm.listPermissions[context] = {};
                    vm.listPermissions[context][permission] = [];
                }
            }
        };

        function _modalGetContext(context, permission, contextTitle) {
            _openModal(context, permission, contextTitle)
                .result
                .then(function (contextPermissions) {
                    if (angular.isUndefined(vm.listPermissions[context])) {
                        vm.listPermissions[context] = {};
                    }
                    if (angular.isString(contextPermissions.ids)) {
                        vm.listPermissions[context][permission] = contextPermissions.data;
                        vm.user.resources_perms[context][permission] = contextPermissions.ids;
                        angular.element('#' + context + '_' + permission).prop('indeterminate', true);
                    } else {
                        if (contextPermissions.ids) {
                            vm.user.resources_perms[context][permission] = [];
                            vm.user.resources_perms[context][permission][0] = permission;
                            angular.element('#' + context + '_' + permission).prop('checked', true);
                        } else {
                            vm.listPermissions[context][permission] = undefined;
                            vm.user.resources_perms[context][permission] = [];
                            angular.element('#' + context + '_' + permission).prop('indeterminate', false);
                            angular.element('#' + context + '_' + permission).attr('value', false);
                        }
                    }
                });
        }

        function _openModal(context, permission, contextTitle) {
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
                            title: contextTitle,
                            context: context,
                            valuePermission: vm.user.resources_perms[context][permission]
                        };
                    }
                },
                size: 'xl'
            });
        }

        function _getResources() {
            ResourcesService
                .get()
                .then(function (res) {
                    vm.resources = res.data.items;
                    vm.listContextName = [];
                    var listKeys = Object.keys(vm.resources);
                    for (var i = 0; i < listKeys.length; i++) {
                        vm.listContextName.push({
                            context: listKeys[i],
                            alias: vm.resources[listKeys[i]].alias
                        });
                    }
                });
        }

        onInit();
    }
})();
