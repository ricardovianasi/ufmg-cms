(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('PermissionService', PermissionService);

    /** ngInject */
    function PermissionService(authService, $log, NotificationService, $timeout, $q, $location, $rootScope
    ) {
        $log.info('PermissionService');
        initService();
        $rootScope.User = null;
        let showMessage = null;
        let TYPES_PERMISSIONS = Object.freeze({ POST: 'POST', GET: 'GET', PUT: 'PUT', DELETE: 'DELETE', PUTTAG: 'PUTTAG',
            PUTSPECIAL: 'PUTSPECIAL' });
        let service = {
            check: check,
            initService: initService,
            canDelete: canDelete,
            canPost: canPost,
            canPut: canPut,
            canGet: canGet,
            canPutTag: canPutTag,
            canPutSpecial: canPutSpecial,
            canPutModules: canPutModules,
            run: initService,
            hasPermission: hasPermission,
            hasPermissionId: hasPermissionId,
            getPrivilege: getPrivilege,
            isAdministrator: isAdministrator,
            getPermissionsPutSpecial: getPermissionsPutSpecial,
            getPutSpecialById: getPutSpecialById,
            updatePrivilege: updatePrivilege,
            getPrivileges: getPrivileges,
            TYPES_PERMISSIONS: TYPES_PERMISSIONS
        };

        function isAdministrator() {
            return $rootScope.User.is_administrator;
        }

        function hasContext(permission, context) {
            if (permission.resource === context) {
                return permission;
            }
        }

        function getPermissions(context) {
            for (var i = 0; i < $rootScope.User.permissions.length; i++) {
                var permission = $rootScope.User.permissions[i];
                if (hasContext(permission, context)) {
                    return permission.privileges;
                }
            }
            return false;
        }

        function hasRole(privilege, role) {
            if (privilege.privilege === role) {
                return privilege;
            }
        }

        function getPutSpecialById(id, keyId, context) {
            let objPermissions = getPermissionsPutSpecial(context, keyId);
            return objPermissions[id];
        }

        function getPermissionsPutSpecial(context, keyId) {
            let privilege = getPrivilege(context, TYPES_PERMISSIONS.PUTSPECIAL);
            if(privilege && privilege.modules) {
                let permissions = JSON.parse(atob(privilege.modules));
                return _transformPutSpecialToObj(permissions, keyId);
            }
            return {};
        }

        function _transformPutSpecialToObj(pages, keyId) {
            return pages.reduce(function(result, item) {
                item.modules = item.modules.reduce(function(resModules, itemModules) {
                    resModules[itemModules.type] = itemModules;
                    return resModules;
                }, {});
                result[item[keyId]] = item;
                return result;
            }, {});
        }

        function getPrivilege(context, role) {
            var permissions = getPermissions(context);
            if (!permissions) {
                return false;
            }
            for (var i = 0; i < permissions.length; i++) {
                var privilege = permissions[i];
                if (hasRole(privilege, role)) {
                    return privilege;
                }
            }
        }

        function validatePostsId(posts) {
            return posts.replace(/\s/g, '').split(',');
        }

        function hasId(id, posts) {
            var array = validatePostsId(posts);
            var postId = id.toString();
            for (var i = 0; i < array.length; i++) {
                var elId = array[i];
                if (postId === elId) {
                    return true;
                }
            }
            return false;
        }

        function verifyRole(hasPrivilege, id) {
            var noHavePermission = angular.isUndefined(hasPrivilege) || !hasPrivilege;
            var withPermission = angular.isUndefined(id) || id === null;
            if (noHavePermission) {
                return false;
            }
            if (withPermission) {
                return true;
            }
            var posts = hasPrivilege.posts;
            if (!posts) {
                return true;
            }
            return hasId(id, posts);
        }

        function noHavePermission() {
            if ($rootScope.User.is_administrator) {
                return false;
            }
            var isEmptyPermission = angular.equals([], $rootScope.User.permissions);
            if (!$rootScope.User.permissions || isEmptyPermission) {
                return true;
            }
            var noKey = true;
            for (var key in $rootScope.User.permissions) {
                if ($rootScope.User.permissions.hasOwnProperty(key)) {
                    var resource = $rootScope.User.permissions[key].resource;
                    var permissions = getPermissions(resource);
                    for (var i = 0; i < permissions.length; i++) {
                        var privilege = permissions[i];
                        if (privilege.privilege !== '') {
                            noKey = false;
                        }
                    }
                }
            }
            return noKey;
        }

        function check(context, id, role) {
            if (!$rootScope.User) {
                return false;
            }
            var isAdmin = $rootScope.User.is_administrator;
            try {
                if (isAdmin) {
                    return true;
                }
                var hasPrivilege = getPrivilege(context, role);
                return verifyRole(hasPrivilege, id);
            } catch (err) {
                $log.error(err);
            }
            return false;
        }

        function canPost(context, id) {
            return check(context, id, TYPES_PERMISSIONS.POST);
        }

        function canGet(context, id) {
            return check(context, id, TYPES_PERMISSIONS.GET);
        }

        function canPutTag(context, id) {
            return check(context, id, TYPES_PERMISSIONS.PUTTAG);
        }

        function canPutSpecial(context, id) {
            return check(context, id, TYPES_PERMISSIONS.PUTSPECIAL) && !$rootScope.User.is_administrator;
        }

        function canPutModules(context, id) {
            return check(context, id, TYPES_PERMISSIONS.PUTSPECIAL);
        }

        function canDelete(context, id) {
            return check(context, id, TYPES_PERMISSIONS.DELETE);
        }

        function canPut(context, id) {
            return check(context, id, TYPES_PERMISSIONS.PUT);
        }

        function messageWarn() {
            if (!showMessage) {
                NotificationService.warning('Você não possui permissões, entre com contato com CEDECOM/WEB', 'ATENÇÃO');
                showMessage = true;
                $location.path('/login');
            }
            $timeout(function () {
                showMessage = false;
            }, 5000);
        }

        function hasPermissionId(context, id) {
            return canPut(context, id) || canPost(context, id) || canDelete(context, id) || canGet(context, id);
        }

        function hasPermission(context) {
            return canPut(context) || canPost(context) || canDelete(context) || canGet(context);
        }

        function messagesUserStatus() {
            if (noHavePermission()) {
                messageWarn();
                return false;
            }
            if (!$rootScope.User.status) {
                NotificationService
                    .error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                $rootScope.logout();
                return false;
            }
            return true;
        }

        function getPrivileges(user, resource, privilege) {
            let idxPermission = _findIdxPermissions(user.permissions, resource);
            if(idxPermission < 0) { return {}; }
            let permission = user.permissions[idxPermission];
            let idxPrivilege = _findIdxPrivileges(permission.privileges, privilege);
            return  idxPrivilege < 0 ? {} : permission.privileges[idxPrivilege];
        }

        function updatePrivilege(user, resource, privilege, key, data) {
            let idxPerm = _findIdxPermissions(user.permissions, resource);
            let permUpdate = idxPerm < 0 ? {} : user.permissions[idxPerm];
            let idxPrivilege = _findIdxPrivileges(permUpdate.privileges, privilege);
            if(idxPrivilege >= 0) {
                permUpdate.privileges[idxPrivilege][key] = data;
            } else {
                let newPrivilege = { privilege: privilege };
                newPrivilege[key] = data;
                permUpdate.privileges = permUpdate.privileges ? permUpdate.privileges : []; 
                permUpdate.privileges.push(newPrivilege);
            }
            if(idxPerm < 0) {
                permUpdate.resource = resource;
                user.permissions ? user.permissions.push(permUpdate) : user.permissions = [permUpdate];
            }
        }

        function _findIdxPermissions(permissions, key) {
            return _findList(permissions, 'resource', key);
        }

        function _findIdxPrivileges(privileges, key) {
            return _findList(privileges, 'privilege', key);
        }

        function _findList(list, param, key) {
            if(!list) { list = []; }
            return list.findIndex(function (item) { return item[param] === key; });
        }

        function initService(user) {
            var defer = $q.defer();
            if (angular.isDefined(user)) {
                $rootScope.User = user;
                if (messagesUserStatus()) {
                    defer.resolve();
                    $rootScope.$broadcast('PERMISSION_ROUTER');
                }
            } else {
                authService
                    .account()
                    .then(function (res) {
                        $rootScope.User = res.data;
                        if (noHavePermission()) {
                            messageWarn();
                            defer.reject();
                        }
                        if (!$rootScope.User.status) {
                            NotificationService
                                .error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                            defer.reject();
                            $rootScope.logout();
                        }
                        $rootScope.$broadcast('PERMISSION_ROUTER');
                        defer.resolve();
                    })
                    .catch(function (err) {
                        defer.reject(err);
                        $log.error(err);
                    });
            }
            return defer.promise;
        }
        return service;
    }
})();
