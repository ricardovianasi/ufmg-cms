'use strict';
angular.module('componentsModule')
    .directive('scrollDetectCloseUiSelect', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('scroll', function () {
                    element.trigger('click');
                });
            }
        };
    });
