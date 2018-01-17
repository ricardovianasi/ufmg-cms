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

        vm.save = save;
        vm.editItem = editItem;
        vm.isEmpty = isEmpty;
        vm.listCanShow = listCanShow;
        vm.toggle = toggle;
        vm.isOpen = isOpen;
        vm.removeItem = removeItemDialog;

        activate();

        ////////////////

        function isEmpty(list) {
            return list ? !list.length : true;
        }

        function listCanShow(parentId, list) {
            return vm.stateToggles[parentId] || isEmpty(list);
        }

        function toggle(id) {
            vm.stateToggles[id] = !vm.stateToggles[id];
        }

        function isOpen(id) {
            return vm.stateToggles[id];
        }

        function save(type) {
            vm.loading[type] = true;
            MenuService.update(inflection.underscore(type), vm[type])
                .then(function () {
                    NotificationService.success('Alterações salvas com sucesso!');
                })
                .catch(console.error)
                .then(function() { vm.loading[type] = false; });
        }

        function editItem(item, parent, isQuickAccess) {
            var instanceModal = _openEditMenu(item, parent, isQuickAccess);
            instanceModal.result.then(function(res) {
                let idxItem;
                if(isQuickAccess) {
                    _changeItemFromList(vm[vm.types.quickAccess], res.item);
                } else {
                    vm[vm.types.mainMenu] = res.list;
                    _changeItemFromList(vm[vm.types.mainMenu], res.item);
                }
            }).catch(function(error) {console.error});
        }

        function removeItemDialog(type, item, parent) {
            var title = 'Confirmar exclusão do <b>' + item.label + '</b> e seus subitens do menu?';
            ModalService.confirm(title)
            .result
            .then(function() {
                _removeItem(type, item, parent);
            }).catch(function(error) { });
        }

        function _removeItem(type, item, parent) {
            let listToRemove = vm[type];
            if(parent) {
                var idxItem = parent.children.indexOf(item);
                parent.children.splice(idxItem, 1);
            } else {
                var idxItem = listToRemove.indexOf(item);
                listToRemove.splice(idxItem, 1);
            }
            _backToPages(type, item);
            if(item.children.length) {
                _backDeepToPages(type, item.children);
                item.children = [];
            }
        }

        function _backToPages(type, item) {
            if(type === vm.types.mainMenu) {
                vm.pages.unshift(item);
            } else {
                vm.pagesQuick.unshift(item);
            }
        }

        function _backDeepToPages(type, listChildren) {
            listChildren.forEach(function(val) {
                _backToPages(type, val);
                if (val.children.length) {
                    _backDeepToPages(type, val.children);
                    val.children = [];
                }
            });
        }

        function _openEditMenu(itemMenu, itemParent, isQuickAccess) {
            var instanceModal = $uibModal.open({
                templateUrl: 'modules/new-menu/edit-modal/menu-edit.modal.template.html',
                controller: 'MenuEditController as vm',
                keyboard: false,
                size: 'md',
                resolve: {
                    listSelect: function() { return isQuickAccess ? null : angular.copy(vm[vm.types.mainMenu]) },
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
            let isChangeName = list[idxItem].label !== item.label;
            if(isChangeName && !item.oldLabel) {
                item.oldLabel = list[idxItem].label;
            }
            item.oldLabel = item.oldLabel === item.label ? '' : item.oldLabel;
            list[idxItem] = item;
        }

        function _loadData(type) {
            return MenuService.get(type)
                .then(function (res) {
                    vm[type] = res.data.items;
                });
        }

        function _loadPages() {
            PagesService.getPages()
                .then(function(res) {
                    let pagesMod = _preparePages(res.data.items);
                    vm.pages = _filterPagesNotIndexed(vm[vm.types.mainMenu], pagesMod);
                    vm.pagesQuick = _filterPagesNotIndexed(vm[vm.types.quickAccess], pagesMod);
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
            let listToStr = JSON.stringify(listTo);
            return listToStr.includes('"page":{"id":' + idPage);
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

        function _setOptionsSortable(type, placeholder) {
            var options = _baseConfigSortable(type);
            if(placeholder) {
                options.placeholder = placeholder;
            }
            return options;
        }

        function _baseConfigSortable(type) {
            return {
                connectWith: '.connect-' + type,
                dropOnEmpty: true,
                cursor: 'move'
            };
        }

        function _updateSortable(event, ui) {
            console.log('_update', event, ui);
            console.log('model', vm.items, vm.pages);
        }

        function _initKeyType() {
            vm.types = {
                quickAccess: 'quickAccess',
                mainMenu: 'mainMenu'
            };
        }

        function activate() {
            _initKeyType();
            vm.loading = {};
            vm.stateToggles = {};
            vm.optionsSortableItems = _setOptionsSortable(vm.types.mainMenu, 'placeholder-primary');
            vm.optionsSortableQuick = _setOptionsSortable(vm.types.quickAccess, 'placeholder-primary');
            $q.all([_loadData(vm.types.mainMenu), _loadData(vm.types.quickAccess)]).then(function() {
                _loadPages();
            });
        }
    }
})();