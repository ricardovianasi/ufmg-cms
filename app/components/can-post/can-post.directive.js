(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canPost', CanPostCtrl);

    /** ngInject */
    function CanPostCtrl(PermissionService) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '='
            },
            link: function ($scope, elem, attr) {
                var canPost = PermissionService.canPost($scope.context, $scope.contextId);
                if (!canPost) {
                    elem.remove();
                }
            }
        };
    }
})();
