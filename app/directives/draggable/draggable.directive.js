(function() {
    'use strict';

    angular
        .module('directivesModule')
        .directive('draggable', draggable);

    function draggable() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;
        
        function link(scope, element, attrs) {
            element.draggable(
                { revert: true, revertDuration: 2, zIndex: 999 }
            );
        }
    }
})();