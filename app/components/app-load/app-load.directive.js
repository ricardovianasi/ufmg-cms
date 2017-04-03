(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('appLoad', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.css({
                        'opacity': '0'
                    });
                    $timeout(function () {
                        element.remove();
                    }, 1000);
                }
            };
        });

})();
