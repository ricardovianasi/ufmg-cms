(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('componentsModule')
        .component('selectWidgetComponent', {
            templateUrl: 'components/select-widget-component/select-widget-component.html',
            controller: SelectWidgetController,
            controllerAs: 'ctrl',
            bindings: {
                isDisabled: '=',
                widgetModel: '=',
                label: '@',
                onSelected: '&'
            },
        });

    /** ngInject */
    function SelectWidgetController(WidgetsService) {
        let ctrl = this;

        ctrl.onWidgetSelected = onWidgetSelected;

        ////////////////

        function onWidgetSelected(item) {
            ctrl.onSelected({ widget: item });
        }

        function _loadListWidgets() {
            ctrl.loadingWidgets = true;
            WidgetsService.getWidgets()
                .then(function(data) { ctrl.widgets = data.data })
                .catch(function(error) { console.error(error); })
                .then(function() { ctrl.loadingWidgets = false; });
        }

        ctrl.$onInit = function() {
            _loadListWidgets();
        };
        ctrl.$onChanges = function(changesObj) { };
        ctrl.$onDestroy = function() { };
    }
})();