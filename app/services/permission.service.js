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
        var showMessage = null;
        let service = {
            check: check,
            initService: initService,
            canDelete: canDelete,
            canPost: canPost,
            canPut: canPut,
            canGet: canGet,
            run: initService,
            hasPermission: hasPermission,
            hasPermissionId: hasPermissionId
        };

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
            return check(context, id, 'POST');
        }

        function canGet(context, id) {
            return check(context, id, 'GET');
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

        function canDelete(context, id) {
            return check(context, id, 'DELETE');
        }

        function canPut(context, id) {
            return check(context, id, 'PUT');
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
