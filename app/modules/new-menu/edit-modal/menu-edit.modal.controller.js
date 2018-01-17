(function() {
    'use strict';

    angular
        .module('newMenuModule')
        .controller('MenuEditController', MenuEditController);

    /** ngInject */
    function MenuEditController($uibModalInstance, listSelect, item, parent, isQuick) {
        var vm = this;

        vm.dismiss = _dismiss;
        vm.changeCheckBox = _changeCheckBox;
        vm.saveItem = _saveItem;
        vm.canNested = _canNested;

        activate();

        ////////////////

        function _dismiss() {
            $uibModalInstance.dismiss('Canceled');
        }

        function _canNested(optionItem) {
            return optionItem.level !== 3 && optionItem.id !== item.id;
        }

        function _saveItem() {
            _updateList();
            _clearListParamsNotUsed();
            $uibModalInstance.close({list: listSelect, item: item});
        }

        function _changeCheckBox() {
            if(!vm.isNested) {
                vm.idSelectedParent = null;
            } else if(vm.isNested && parent) {
                _setSelectParent();
            }
        }

        function _updateList() {
            let hasModfied = (parent && vm.idSelectedParent !==  parent.id) || (!parent && vm.idSelectedParent);
            if(!hasModfied || isQuick) {
                return;
            }
            var parentSelected = _getItemFromListOptions(vm.idSelectedParent);
            var itemFromOptions = _getItemFromListOptions(item.id);

            if(parentSelected) {
                _checkParentBecameChild(parentSelected);
                parentSelected.children.push(item);
            } else {
                listSelect.push(itemFromOptions);
            }
            _removeItem(itemFromOptions);
        }

        function _checkParentBecameChild(parentSelected) {
            var child = item.children.find(function(child) {
                return child.id === parentSelected.id;
            });
            var indexChild = item.children.indexOf(child);
            var isParentBecameChild = indexChild !== -1;
            if(isParentBecameChild) {
                item.children.splice(indexChild, 1);
                listSelect.push(parentSelected);
            }
        }

        function _clearListParamsNotUsed() {
            vm.listOptions.forEach(function(item) {
                delete item.level;
                delete item.parent;
            });
        }

        function _getItemFromListOptions(idItem) {
            return vm.listOptions.find(function (value) {
                return value.id === idItem;
            });
        }

        function _removeItem(item) {
            if(item.parent) {
                var idxItem = item.parent.children.indexOf(item);
                item.parent.children.splice(idxItem, 1);
            } else {
                var idx = listSelect.indexOf(item);
                listSelect.splice(idx, 1);
            }
        }

        function _setSelectParent() {
            if (angular.isUndefined(parent)) {
                vm.idSelectedParent = null;
                return;
            }
            vm.idSelectedParent = parent.id || null;
        }

        function _setIsNested() {
            vm.isNested = !angular.isUndefined(parent);
        }

        function _initSelect() {
            vm.listOptions = [];
            listSelect.forEach(function (optPrimary) {
                _addItem(optPrimary, 1);
                optPrimary.children.forEach(function (optSecondary) {
                    _addItem(optSecondary, 2, optPrimary);
                    optSecondary.children.forEach(function (optTertiary) {
                        _addItem(optTertiary, 3, optSecondary);
                    });
                });
            });
        }

        function _addItem(opt, level, optParent) {
            opt.level = level;
            opt.parent = optParent;
            vm.listOptions.push(opt);
        }

        function activate() {
            vm.item = item;
            vm.isQuick = isQuick;
            if(!isQuick) {
                _initSelect();
                _setIsNested();
                _setSelectParent();
            }
        }
    }
})();