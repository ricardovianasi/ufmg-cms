(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('PermissionPageService', PermissionPageService);

    /** ngInject */
    function PermissionPageService(PermissionService, authService) {
        let service = {
            canPost: canPost,
            canTotal: canTotal,
            canPutTag: canPutTag,
            getPutSpecial: getPutSpecial,
            getPostModules: getPostModules,
            getPutSpecialByIdPage: getPutSpecialByIdPage
        };

        let CONTEXT = 'page';
        
        return service;

        ////////////////
        function canTotal(role) {
            return _getUser().then(function() {
                let privilege = PermissionService.getPrivilege(CONTEXT, role);
                return privilege && !privilege[role];
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

        function getPostModules(options) {
            options = options || {};
            return _getUser().then(function() {
                let privilege = PermissionService.getPrivilege(CONTEXT, PermissionService.TYPES_PERMISSIONS.POST);
                let modules = _getPermissionDecode(privilege, 'modules');
                console.log('getPostModules', modules);
                if(modules && modules.noPrivilege) { return modules; }
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
                if(page && page.noPrivilege) { return page; }
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
                result[item[keyAttr]] = item[keyAttr];
                return result;
            }, {});
        }

        function _getUser() {
            return authService.account();
        }
    }
})();