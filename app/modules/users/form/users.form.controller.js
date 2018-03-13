(function () {
    'use strict';

    angular
        .module('usersModule')
        .controller('UsersFormController', UsersFormController);

    /** ngInject */
    function UsersFormController($routeParams, $log, $q, UsersService, ResourcesService, PagesService, ModalService,
        PeriodicalService, CourseService, Util, $timeout, $location, $scope, NotificationService, HandleChangeService,
        PermissionService) {

        var vm = this;
        var userId;
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

        vm.loadContextData = loadContextData;

        vm.hasCustomPermission = hasCustomPermission;
        vm.hasCustomPermissionSetted = hasCustomPermissionSetted;
        vm.openModulesPermission = openModulesPermission;
        vm.loadMoreUser = loadMoreUser;
        vm.checkListContext = checkListContext;

        function onInit() {
            $log.info('UsersFormController');
            _initListCustomPermission();
            _getResources();
            userId = $routeParams.userId ? $routeParams.userId : undefined;
            if (userId) {
                UsersService
                    .getUser(userId)
                    .then(function (data) {
                        vm.user = data.data;
                        _normalizeUser();
                        _convertPrivilegesToLoad();
                    });
            }
            HandleChangeService
                .registerHandleChange('/user', ['POST', 'PUT'], $scope, ['vm.user'], undefined, _hasLoaded);
        }

        function loadMoreUser (search) {
            reset(vm.moderators);
            loadMore(vm.moderators, search)
                .then(function (data) {
                    vm.moderators = Object.assign(vm.moderators, data);
                });
        }

        function openModulesPermission() {
            let modal = _openModulesPermissionModal();
            modal.result.then(function (res) { _prepareCustomModules(res); });
        }

        function _prepareCustomModules(customModules) {
            let keyPutModules = PermissionService.TYPES_PERMISSIONS.PUTMODULES;
            let customModulesStr = JSON.stringify(customModules);
            let privilege = _getPrivileges('page', keyPutModules);
            if(customModules.length > 0) {
                vm.user.resources_perms.page.PUTSPECIAL = customModulesStr;
                privilege.modules = customModulesStr;
                _setCheckboxPermission('page', keyPutModules, { method: 'prop', key: 'indeterminate', value: true});
                _setCheckboxPermission('page', keyPutModules, { method: 'attr', key: 'value', value: true});
            } else {
                privilege.modules = [];
                _setCheckboxPermission('page', keyPutModules, { method: 'attr', key: 'value', value: false});
                _setCheckboxPermission('page', keyPutModules, { method: 'prop', key: 'indeterminate', value: false});
                checkListContext('page', keyPutModules);
            }
        }

        function _hasLoaded(oldValue) {
            return (oldValue && angular.isDefined(oldValue.id)) || angular.isUndefined(userId);
        }

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
            let convertedPerms = {};
            let permsToConvert = vm.user.resources_perms;
            Object.keys(permsToConvert).forEach(function (key) {
                permsToConvert[key].split(';').forEach(function (value) {
                    let method = value.substring(0, value.indexOf(':'));
                    let val = value.substring(value.indexOf(':') + 1);
                    var permsToConvert = convertedPerms[key] || {};
                    if (method) {
                        val = val.replace(/\\/g, '');
                        permsToConvert[method] = val;
                        convertedPerms[key] = permsToConvert;
                    } else {
                        permsToConvert[val] = [val];
                        convertedPerms[key] = permsToConvert;
                    }
                });
            });
            vm.user.resources_perms = convertedPerms;
        }

        function _convertPrivilegesToSave(resourcesPerms) {
            if (angular.isUndefined(resourcesPerms)) {
                return;
            }
            Object.keys(resourcesPerms).forEach(function (k) {
                var innerKeys = Object.keys(resourcesPerms[k]),
                items = [];
                innerKeys.forEach(function (key) {
                    if (resourcesPerms[k][key][0]) {
                        let permission = (Array.isArray(resourcesPerms[k][key])) ? key : key + ':' + resourcesPerms[k][key];
                        items.push(permission);
                    }
                });
                resourcesPerms[k] = items.join(';');
            });
            return resourcesPerms;
        }

        function _save(isValid) {
            if (!isValid) {
                NotificationService.error('Existem campos obrigatórios vazios ou inválidos.');
                return;
            }
            let userToSave = angular.copy(vm.user);
            userToSave.permissions = _convertPrivilegesToSave(userToSave.resources_perms);
            vm.isLoading = true;
            if (userId) {
                UsersService
                    .updateUser(userToSave)
                    .then(function () {
                        $location.path('/user');
                        NotificationService.success('Usuário alterado com sucesso!');
                    })
                    .catch(console.error)
                    .then(function () {
                        vm.isLoading = false;
                    });
            } else {
                UsersService
                    .saveUser(userToSave)
                    .then(function () {
                        $location.path('/user');
                        NotificationService.success('Usuário salvo com sucesso!');
                    })
                    .catch(console.error)
                    .then(function () {
                        vm.isLoading = false;
                    });
            }
        }

        function _setTab(tabId) {
            vm.tab = tabId;
        }

        function _isActive(tabId) {
            return vm.tab === tabId;
        }

        function hasCustomPermission(context, key) {
            let labelPermission = context + '_' + key;
            return vm.modulesCustomPermission[labelPermission] || false;
        }
        
        function hasCustomPermissionSetted(context, key) {
            if(!vm.listPermissions[context]) {
                return false;
            }
            let hasCustomPerm = hasCustomPermission(context, key);
            let hasResourcePerm = hasCustomPerm && vm.user.resources_perms[context] && !!vm.user.resources_perms[context][key];
            let hasCustomSet = hasResourcePerm && vm.listPermissions[context][key] &&
                vm.listPermissions[context][key][0] !== undefined;
            return hasCustomSet;
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

        function contextData(op, element) {
            switch (op) {
                case 'page':
                    return _handleContextData(PagesService.getPages(), element);
                case 'editions':
                    return _handleContextData(PeriodicalService.getPeriodicals(), element);
                case 'course_graduation':
                    return _handleContextData(CourseService.getCourses('graduation'), element);
                case 'course_specialization':
                    return _handleContextData(CourseService.getCourses('specialization'), element);
                case 'course_master':
                    return _handleContextData(CourseService.getCourses('master'), element);
                case 'course_doctorate':
                    return _handleContextData(CourseService.getCourses('doctorate'), element);
                default:
                    return $q.resolve(false);
            }
        }

        function _handleContextData(promise, element) {
            return promise.then(function(result) {
                return { data: result.data, element: element };
            });
        }

        function _mountItem(contextName, item) {
            let contextApplyItem = contextName === 'page' || contextName === 'editions' || contextName.substr(0, 6) === 'course';
            if(contextApplyItem) {
                return { id: item.id, title: item.title || item.name };
            }
            return false;
        }

        function loadContextData (contextName) {
            if (angular.isDefined(isLoadAccordion[contextName])) {
                return;
            }
            isLoadAccordion[contextName] = true;
            let contextPermissions = _contextPermissions(contextName);
            _loadContextDataPut(contextPermissions, contextName);
        }

        function _loadContextDataPut(contextPermissions, contextName) {
            contextPermissions.forEach(function(element) {
                if (element.valuePermission) {
                    contextData(contextName, element)
                        .then(function (res) {
                            if(!vm.listPermissions[contextName]) {
                                vm.listPermissions[contextName] = {};
                            }
                            vm.listPermissions[contextName][res.element.permission] = 
                                _mountListPermissionContextId(res.data.items, res.element);
                            _setCheckboxPermission(contextName, res.element.permission, 
                                { method: 'prop', key: 'indeterminate', value: true });
                        });
                }
            });
        }

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

        function checkListContext (context, permission) {
            if ((vm.resources[context] && vm.resources[context].select 
                && vm.resources[context].select[0] === permission) || 
                PermissionService.TYPES_PERMISSIONS.PUTMODULES === permission
            ) {
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
            _openCustomPermissionModal(context, permission, contextTitle)
                .result
                .then(function (contextPermissions) {
                    if (angular.isUndefined(vm.listPermissions[context])) {
                        vm.listPermissions[context] = {};
                    }
                    if (angular.isString(contextPermissions.ids)) {
                        vm.listPermissions[context][permission] = contextPermissions.data;
                        vm.user.resources_perms[context][permission] = contextPermissions.ids;
                        _setCheckboxPermission(context, permission, { method: 'prop', key: 'indeterminate', value: true});
                    } else {
                        if (contextPermissions.ids) {
                            vm.user.resources_perms[context][permission] = [];
                            vm.user.resources_perms[context][permission][0] = permission;
                            _setCheckboxPermission(context, permission, 
                                { method: 'prop', key: 'checked', value: true});
                        } else {
                            vm.listPermissions[context][permission] = undefined;
                            vm.user.resources_perms[context][permission] = [];
                            _setCheckboxPermission(context, permission, { method: 'prop', key: 'indeterminate', value: false});
                            _setCheckboxPermission(context, permission, { method: 'attr', key: 'value', value: false});
                        }
                    }
                });
        }

        function _setCheckboxPermission(context, permission, config) {
            let idElement = '#' + context + '_' + permission;
            angular.element(idElement)[config.method](config.key, config.value);
        }

        function _openCustomPermissionModal(context, permission, contextTitle) {
            let resolveModal = {
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
            };
            return ModalService.openModal('modules/users/form/permission/custom-permission-modal/custom-permission.template.html',
                'CustomPermissionController as vm', resolveModal, 'xl');
        }

        function _getPrivileges(resource, privilege) {
            let privilegeToReturn = {};
            let permission = vm.user.permissions.find(function(perm) {
                return perm.resource === resource;
            });
            if(permission && permission.privileges) {
                let privilegeFound = permission.privileges.find(function(p) {
                    return p.privilege === privilege;
                });
                privilegeToReturn = privilegeFound || {};
            }
            return privilegeToReturn;
        }

        function _openModulesPermissionModal() {
            let resolve = {
                dataPermissionModule: function() {
                    let privilege = _getPrivileges('page', 'PUTSPECIAL');
                    if(!privilege || !angular.isString(privilege.modules)) {
                        return [];
                    }
                    try { return JSON.parse(privilege.modules); } 
                    catch (e) { return []; }
                },
                currentUser: function () { return vm.user.name; }
            };
            return ModalService.openModal(
                'modules/users/form/permission/modules-permission-modal/modules-permission.template.html',
                'ModulesPermissionController as vm', resolve, 'xl');
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

        function _initListCustomPermission() {
            vm.modulesCustomPermission = {
                'page_PUT': true, 'editions_POST': true, 'editions_PUT': true,
                'editions_DELETE': true, 'course_graduation_PUT': true, 'course_master_PUT': true,
                'course_doctorate_PUT': true, 'course_specialization_PUT': true
            };
        }

        onInit();
    }
})();
