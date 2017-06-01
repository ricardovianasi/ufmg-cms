'use strict';
angular.module('componentsModule')
    .directive('scrollDetect', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                element.bind('scroll', function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attrs.scrollDetect);
                    }
                });
            }
        };
    });