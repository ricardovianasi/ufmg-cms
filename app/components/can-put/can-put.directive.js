(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canPut', CanPutCtrl);

    /** ngInject */
    function CanPutCtrl(PermissionService) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '='
            },
            link: function ($scope, elem, attr) {
                var canPut = PermissionService.canPut($scope.context, $scope.contextId);
                if (!canPut) {
                    elem.remove();
                }
            }
        };
    }
})();
