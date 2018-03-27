(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('ModulesCreatePageController', ModulesCreatePageController);

    /** ngInject */
    function ModulesCreatePageController(dataModules, WidgetsService, NotificationService, $uibModalInstance) {
        let vm = this;

        vm.deleteModule = deleteModule;
        vm.addModule = addModule;
        vm.save = save;
        vm.close = close;

        activate();
        
        ////////////////

        function close() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            let listToSave = vm.listWidgetsSelecteds.map(function (widget) { return {type: widget.type}; });
            let jsonResult = JSON.stringify(listToSave);
            let code64 = btoa(jsonResult);
            let result = { raw: vm.listWidgetsSelecteds, code64: code64 };
            $uibModalInstance.close(result);
        }

        function addModule(widget) {
            if(!_canAddedWidget(vm.listWidgetsSelecteds, widget)) {
                return;
            }
            vm.listWidgetsSelecteds.push({ type: widget.type, label: widget.label });
        }

        function deleteModule(idxModule) {
            vm.listWidgetsSelecteds.splice(idxModule, 1);
        }

        function _canAddedWidget(modules, widget) {
            let result = false;
            let isAdded = _checkAdded(widget, modules, 'type', 'type');
            if(widget && !isAdded) {
                result = true;
            } else if(!widget) {
                NotificationService.warn('Atenção, deve ser selecionado um módulo antes de inserir.');
            } else if(isAdded) {
                NotificationService.warn('Atenção, este módulo já foi inserido.');
            }
            return result;
        }

        function _checkAdded(obj, list, refObj, refList) {
            if(!obj) {return false; }
            let idx = list.findIndex(function(objAdded) {
                return objAdded[refList] === obj[refObj];
            });
            return idx >= 0;
        }

        function _loadAllWidgets() {
            WidgetsService.getWidgets()
                .then(function(dataWidgets) {
                    vm.listWidgetsSelecteds = _mapsWidgets(dataWidgets.data.items);
                });
        }

        function _mapsWidgets(allWidgets) {
            console.log(dataModules);
            dataModules = dataModules ? JSON.parse(atob(dataModules)) : [];
            return dataModules.map(function(widgetAdded) {
                let widget = allWidgets.find(function(wgt) {
                    return wgt.type === widgetAdded.type;
                });
                widgetAdded.label = widget.label;
                return widgetAdded;
            });
        }

        function activate() {
            _loadAllWidgets();
        }
    }
})();