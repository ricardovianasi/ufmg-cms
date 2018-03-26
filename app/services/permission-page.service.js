(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('PermissionPageService', PermissionPageService);

    /** ngInject */
    function PermissionPageService($rootScope, PermissionService, authService) {
        let service = {
            isAuthor: isAuthor,
            canPost: canPost,
            canTotal: canTotal,
            canPutTag: canPutTag,
            getPutSpecial: getPutSpecial,
            getPostModules: getPostModules,
            setConfigPermission: setConfigPermission,
            getPutSpecialByIdPage: getPutSpecialByIdPage
        };

        let CONTEXT = 'page';
        
        return service;

        ////////////////

        function isAuthor(page) {
            return $rootScope.User.id === page.author.id;
        }

        function canTotal(role, key) {
            return _getUser().then(function() {
                let privilege = PermissionService.getPrivilege(CONTEXT, role);
                return privilege && !privilege[key];
            });
        }

        function canPutTag() {
            return _getUser().then(function() {
                return PermissionService.canGet(CONTEXT, PermissionService.TYPES_PERMISSIONS.PUTTAG);
            });
        }

        function canPost() {
            return _getUser().then(function() {
                return PermissionService.canPost(CONTEXT, PermissionService.TYPES_PERMISSIONS.POST);
            });
        }

        function setConfigPermission(opts) {
            return {
                isPost: opts.isPost,
                isAdmin: PermissionService.isAdministrator() || opts.isAdmin,
                permissions: opts.permissions,
                modules: opts.modules || []
            };
        }

        function getPostModules(options) {
            options = options || {};
            return _getUser().then(function() {
                let privilege = PermissionService.getPrivilege(CONTEXT, PermissionService.TYPES_PERMISSIONS.POST);
                let modules = _getPermissionDecode(privilege, 'modules');
                console.log('getPostModules', modules);
                if(modules && (modules.noPrivilege || modules.isTotal)) { return modules; }
                if(options.getAsList) {
                    return modules;
                } else {
                    return _transformListToObj(modules, 'type');
                }
            });

        }

        function getPutSpecialByIdPage(idPage) {
            return getPutSpecial().then(function(pagesObj) {
                if(pagesObj && pagesObj[idPage]) {
                    return pagesObj[idPage];
                }
                return pagesObj;
            });
        }
        
        function getPutSpecial() {
            return _getUser().then(function() {
                let privilege = PermissionService.getPrivilege(CONTEXT, PermissionService.TYPES_PERMISSIONS.PUTSPECIAL)
                let pages = _getPermissionDecode(privilege, 'modules');
                if(pages && pages.noPrivilege) { return pages; }
                return _transformListToObj(pages, 'idPage');
            });
        }

        function _getPermissionDecode(privilege, role) {
            if(privilege && angular.isString(privilege[role])) {
                return JSON.parse(atob(privilege[role]));
            }
            return { isTotal: !!privilege, noPrivilege: !privilege };
        }

        function _transformListToObj(list, keyAttr) {
            return list.reduce(function(result, item) {
                result[item[keyAttr]] = item;
                return result;
            }, {});
        }

        function _getUser() {
            return authService.account();
        }
    }
})();