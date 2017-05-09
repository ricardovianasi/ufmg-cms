(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('PermissionService', PermissionService);

    /** ngInject */
    function PermissionService(authService, $log, NotificationService, $timeout, $rootScope) {
        $rootScope.currentUser = null;
        var showMessage = null;
        var service = {
            check: check,
            initService: initService,
            canDelete: canDelete,
            canPost: canPost,
            canPut: canPut,
            hasPermission: hasPermission
        };

        function hasContext(permission, context) {
            if (permission.resource === context) {
                return permission;
            }
        }

        function getPermissions(context) {
            for (var i = 0; i < $rootScope.currentUser.permissions.length; i++) {
                var permission = $rootScope.currentUser.permissions[i];
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
            if (angular.isUndefined(hasPrivilege) || !hasPrivilege) { // Sem permissão
                return false;
            }
            if (angular.isUndefined(id) || id === null) { // Com permissão
                return true;
            }
            // Permissão específica
            var posts = hasPrivilege.posts;
            if (!posts) {
                return true;
            }
            return hasId(id, posts);
        }

        function check(context, id, role) {
            if (!$rootScope.currentUser) {
                return false;
            }
            try {
                // permission admin
                if ($rootScope.currentUser.is_administrator) {
                    return true;
                }
                // no permission
                if (!$rootScope.currentUser.permissions || angular.equals([], $rootScope.currentUser.permissions)) {
                    messageWarn();
                    return false;
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

        function messageWarn() {
            if (!showMessage) {
                NotificationService.warning('ATENÇÃO',
                    'Você não possui permissões, entre com contato com CEDECOM/WEB');
                showMessage = true;
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

        function hasPermission(context) {
            return canPut(context) || canPost(context) || canDelete(context);
        }

        function initService(user) {
            if (angular.isDefined(user)) {
                $rootScope.currentUser = user;
            } else {
                authService
                    .account()
                    .then(function (res) {
                        $rootScope.currentUser = res.data;
                        if (!$rootScope.currentUser.status) {
                            NotificationService
                                .error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                            $rootScope.logout();
                        }
                    })
                    .catch(function (err) {
                        $log.error(err);
                    });
            }
        }
        return service;
    }
})();
