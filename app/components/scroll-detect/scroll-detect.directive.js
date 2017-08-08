'use strict';
angular.module('componentsModule')
    .directive('scrollDetect', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                element.bind('scroll', function () {
                    var scrollHeightCallEvent = raw.scrollTop + raw.offsetHeight;
                    var limitScroll = raw.scrollHeight - 50;
                    if (scrollHeightCallEvent >= limitScroll) {
                        scope.$apply(attrs.scrollDetect);
                    }
                });
            }
        };
    });
