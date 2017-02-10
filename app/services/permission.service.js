(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('PermissionService', PermissionService);

    /** ngInject */
    function PermissionService(authService, $log, NotificationService, $timeout) {
        var currentUser = {};
        var showMessage = null;
        var service = {
            check: check,
            initService: initService,
            canDelete: canDelete,
            canPost: canPost,
            canPut: canPut
        };

        function hasContext(permission, context) {
            if (permission.resource === context) {
                return permission;
            }
        }

        function getPermissions(context) {
            for (var i = 0; i < currentUser.permissions.length; i++) {
                var permission = currentUser.permissions[i];
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
                var id = array[i];
                if (postId === id) {
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
            try {
                // permission admin
                if (currentUser.is_administrator) {
                    return true;
                }
                // no permission
                if (!currentUser.permissions || angular.equals([], currentUser.permissions)) {
                    messageWarn()
                    return false;
                }
                var hasPrivilege = getPrivilege(context, role);
                return verifyRole(hasPrivilege, id);
            } catch (err) {
                $log.error(err);
                messageAlert();
            }
            return false;
        }

        function canPost(context, id) {
            return check(context, id, 'POST');
        }

        function messageAlert() {
            if (!showMessage) {
                NotificationService.error('ATENÇÃO', 'Não conseguimos verificar suas permissões, entre com contato com CEDECOM/WEB');
                showMessage = true;
            }
            $timeout(function() {
                showMessage = false;
            }, 5000);
        }

        function messageWarn() {
            if (!showMessage) {
                NotificationService.warning('ATENÇÃO', 'Você não possui permissões, entre com contato com CEDECOM/WEB');
                showMessage = true;
            }
            $timeout(function() {
                showMessage = false;
            }, 5000);
        }

        function canDelete(context, id) {
            return check(context, id, 'DELETE');
        }

        function canPut(context, id) {
            return check(context, id, 'PUT');
        }

        function initService() {
            authService
                .account()
                .then(function (res) {
                    currentUser = res.data;
                    TESTE();
                })
                .catch(function (err) {
                    $log.error(err);
                    messageAlert();
                });
        }

        function TESTE() {
            currentUser.is_administrator = false; // remove admin
            currentUser.permissions[0].privileges[1].posts = '184,180, 145'; // set permission only
            currentUser.permissions[0].privileges.splice(0, 1); // remove permission POST
            // currentUser.permissions = undefined;
            // currentUser.permissions = [];
        }
        initService();
        return service;
    }
})();
