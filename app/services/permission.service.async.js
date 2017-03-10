(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('Permission', Permission);

    /** ngInject */
    function Permission(authService, $log, NotificationService, $q, $timeout, $rootScope) {
        var currentUser = null;
        var showMessage = null;
        var service = {
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

        function getUser() {
            var defer = $q.defer();
            authService
                .getUser()
                .then(function () {

                });
            return defer.promise;
        }

        function verifyPermission(user) {
            // permission admin
            if (user.is_administrator) {
                return true;
            }
            // no permission
            if (!user.permissions || angular.equals([], user.permissions)) {
                messageWarn();
                return false;
            }
            var hasPrivilege = getPrivilege(context, role);
            return verifyRole(hasPrivilege, id);
        }

        function check(context, id, role) {
            var defer = $q.defer();
            authService
                .getUser()
                .then(function (user) {
                    currentUser = user;
                    defer.resolve(verifyPermission(user));
                });
            return defer.promise;
        }


        function canDelete(context, id) {
            var defer = $q.defer();
            check(context, id, 'DELETE')
                .then(function (value) {
                    defer.resolve(value);
                });
            return defer.promise;
        }

        function canPut(context, id) {
            var defer = $q.defer();
            check(context, id, 'PUT')
                .then(function (value) {
                    defer.resolve(value);
                });
            return defer.promise;
        }

        function canPost(context, id) {
            var defer = $q.defer();
            check(context, id, 'POST')
                .then(function (value) {
                    defer.resolve(value);
                });
            return defer.promise;
        }

        function messageAlert() {
            if (!showMessage) {
                NotificationService.error('Não conseguimos verificar suas permissões, entre com contato com CEDECOM/WEB', 'ATENÇÃO');
                showMessage = true;
            }
            $timeout(function () {
                showMessage = false;
            }, 5000);
        }

        function messageWarn() {
            if (!showMessage) {
                NotificationService.warning('Você não possui permissões, entre com contato com CEDECOM/WEB', 'ATENÇÃO');
                showMessage = true;
            }
            $timeout(function () {
                showMessage = false;
            }, 5000);
        }
        return service;
    }
})();
