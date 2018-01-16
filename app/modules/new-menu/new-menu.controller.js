(function() {
    'use strict';

    angular
        .module('newMenuModule')
        .controller('NewMenuController', MenuController);
    
        /** ngInject */
    function MenuController($scope
        , $log
        , $q
        , $rootScope
        , $filter
        , NotificationService
        , ModalService
        , PermissionService
        , PagesService
        , MenuService
        , $uibModal
        ) {
        var vm = this;

        vm.isEmpty = _isEmpty;
        vm.listCanShow = _listCanShow;
        vm.toggle = _toggle;
        vm.isOpen = _isOpen;
        vm.editItem = _editItem;
        vm.removeItem = _removeItemDialog;

        activate();

        ////////////////

        function _updateSortable(event, ui) {
            console.log('_update', event, ui);
            console.log('model', vm.items, vm.pages);
        }

        function _removeItemDialog(item, parent) {
            var title = 'Confirmar exclusão dos itens e seus subitens do menu?';
            ModalService.confirm(title)
            .result
            .then(function() {
                _removeItem(item, parent);
            }).catch(function(error) { });
        }

        function _removeItem(item, parent) {
            if(parent) {
                var idxItem = parent.children.indexOf(item);
                parent.children.splice(idxItem, 1);
            } else {
                var idxItem = vm.items.indexOf(item);
                vm.items.splice(idxItem, 1);
            }

        }

        function _editItem(item, parent, isQuickAccess) {
            var instanceModal = _openEditMenu(item, parent, isQuickAccess);
            instanceModal.result.then(function(res) {
                let idxItem;
                if(isQuickAccess) {
                    _changeItemFromList(vm.itemsQuickAccess, res.item);
                } else {
                    vm.items = res.list;
                    _changeItemFromList(vm.items, res.item);
                }
            }).catch(function() {});
        }
        

        function _openEditMenu(itemMenu, itemParent, isQuickAccess) {
            var instanceModal = $uibModal.open({
                templateUrl: 'modules/new-menu/edit-modal/menu-edit.modal.template.html',
                controller: 'MenuEditController as vm',
                keyboard: false,
                size: 'md',
                resolve: {
                    listSelect: function() { return isQuickAccess ? null : angular.copy(vm.items) },
                    item: function() { return angular.copy(itemMenu) },
                    parent: function() { return angular.copy(itemParent) },
                    isQuick: function() { return isQuickAccess },
                }
            });
            return instanceModal;
        }

        function _changeItemFromList(list, item) {
            let idxItem = list.findIndex(function(val) {
                return val.id === item.id;
            });
            list[idxItem] = item;
        }

        function _isEmpty(list) {
            return list ? !list.length : true;
        }

        function _listCanShow(parentId, list) {
            return vm.stateToggles[parentId] || _isEmpty(list);
        }

        function _toggle(id) {
            vm.stateToggles[id] = !vm.stateToggles[id];
        }

        function _isOpen(id) {
            return vm.stateToggles[id];
        }

        function _loadData(type) {
            return MenuService.get(type);
        }

        function _loadQuickAccess() {
            return _loadData('quickAccess')
                .then(function (res) {
                    vm.itemsQuickAccess = res.data.items;
                    console.log('_loadQuickAccess', res);
                });
        }

        function _loadMainMenu() {
            return _loadData('mainMenu')
                .then(function (res) {
                    vm.items = res.data.items;
                    console.log('_loadMainMenu', vm.items);
                });
        }

        function _loadPages() {
            PagesService.getPages()
                .then(function(res) {
                    let pagesMod = _preparePages(res.data.items);
                    vm.pages = _filterPagesNotIndexed(vm.items, pagesMod);
                    vm.pagesQuick = _filterPagesNotIndexed(vm.itemsQuickAccess, pagesMod);
                    console.log(vm.pages, vm.pagesQuick);
                });
        }

        function _preparePages(pagesItems) {
            return pagesItems.map(function(value) {
                return _cretateItemFromPage(value);
            });
        }
        
        function _filterPagesNotIndexed(listTo, pagesMod) {
            return pagesMod.filter(function (val) {
                return !_hasIndexed(listTo, val.page.id);
            });
        }

        function _hasIndexed(listTo, idPage) {
            let idx = listTo.findIndex(function (item) {
                return item.page.id === idPage;
            });
            return idx === -1 ? false : true;
        }

        function _cretateItemFromPage(value) {
            return {
                children: [],
                label: value.title,
                page: value,
                target_blank: null,
                external_url: null,
                id: Date.now().toString() + value.id
            };
        }

        function _setOptionsSortable(placeholder) {
            var options = _baseConfigSortable();
            if(placeholder) {
                options.placeholder = placeholder;
            }
            return options;
        }

        function _baseConfigSortable() {
            return {
                connectWith: '.list',
                dropOnEmpty: true,
                cursor: 'move',
                update: _updateSortable
            };
        }

        function activate() {
            vm.stateToggles = {};
            vm.optionsSortable = _setOptionsSortable();
            vm.optionsSortablePrimary = _setOptionsSortable('placeholder-primary');
            vm.optionsSortableSecondary = _setOptionsSortable('placeholder-secondary');
            vm.optionsSortableTertiary = _setOptionsSortable('placeholder-tertiary');
            $q.all([_loadMainMenu(), _loadQuickAccess()]).then(function() {
                _loadPages();
            });
        }
    }
})();