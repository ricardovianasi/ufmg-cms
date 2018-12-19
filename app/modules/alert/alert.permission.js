(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .factory('AlertPermissionService', AlertPermissionService);

    /** ngInject */
    function AlertPermissionService(PermissionService) {
        var service = {
            permissions:permissions
        };

        return service;

        ////////////////
        function permissions() {
            let permissions = {
                canPost: PermissionService.canPost('alert'),
                canDelete: PermissionService.canDelete('alert'),
                canPut: PermissionService.canPut('alert')
            };
            return permissions;
        }
    }
})();
