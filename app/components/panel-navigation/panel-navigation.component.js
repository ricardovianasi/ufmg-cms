(function() {
    'use strict';

    angular
        .module('componentsModule')
        .component('panelNavigation', {
            templateUrl: 'components/panel-navigation/panel-navigation.html',
            controller: PanelNavigationController,
            controllerAs: '$ctrl',
            bindings: {
                showNew: '='
            },
        });

    /** ngInject */
    function PanelNavigationController($location) {
        var $ctrl = this;

        $ctrl.goBack = goBack;
        $ctrl.goNew = goNew;

        ////////////////

        function goBack() {
            return _getUrl();
        }

        function goNew() {
            return _getUrl() + '/new';
        }

        function _getUrl() {
            let forceBreak = false;
            let url = '#' + $location.url().split('/').reduce(function (accumulator, currentValue) {
                if (currentValue === 'new' || currentValue === 'edit') {
                    forceBreak = true;
                }
                if (forceBreak) {
                    return accumulator;
                }
                return accumulator += '/' + currentValue;
            });
            return url;
        }
    }
})();
