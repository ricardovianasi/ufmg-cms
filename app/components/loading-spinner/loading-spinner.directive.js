(function() {
    'use strict';

    angular
        .module('componentsModule')
        .directive('loadingSpinner', loadingSpinnerCtrl);

    loadingSpinnerCtrl.$inject = [];

    function loadingSpinnerCtrl() {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/loading-spinner/loading-spinner.html'
        };
        return directive;
    }
})();