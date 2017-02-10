(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canDelete', CanDeleteCtrl);
    /** ngInject */
    function CanDeleteCtrl(PermissionService) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '='
            },
            link: function ($scope, elem, attr) {
                PermissionService.check();
            }
        };
    }
})();
