(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canGet', CanGetCtrl);

    /** ngInject */
    function CanGetCtrl(PermissionService) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '='
            },
            link: function ($scope, elem) {
                var canGet = PermissionService.canGet($scope.context, $scope.contextId);
                if (!canGet) {
                    elem.remove();
                }
            }
        };
    }
})();
