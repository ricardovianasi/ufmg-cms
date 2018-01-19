(function() {
    'use strict';

    angular
        .module('newMenuModule')
        .controller('NewMenuController', MenuController);
    
        /** ngInject */
    function MenuController($scope, $log, $q, $rootScope, $filter, NotificationService, ModalService,
        PermissionService, PagesService, MenuService, $uibModal) {

        var vm = this;

        vm.save = save;
        vm.editItem = editItem;
        vm.isEmpty = isEmpty;
        vm.listCanShow = listCanShow;
        vm.toggle = toggle;
        vm.isOpen = isOpen;
        vm.removeItem = removeItemDialog;
        vm.searchPage = searchPage;

        vm.addLink = addLink;
        vm.hasErrorLink = hasErrorLink;
    
        activate();

        ////////////////

        function addLink(type) {
            vm.submit = true;
            let isValid = vm.link && vm.link.label && vm.link['external_url'];
            if(isValid) {
                vm.submit = false;
                vm.link.id = Number.parseInt(Date.now().toString());
                vm[type].unshift(vm.link);
            }
            _createLink();
        }

        function hasErrorLink(field) {
            return vm.submit && !(vm.link && vm.link[field]);
        }

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

        function searchPage(typePage, query) {
            let result = $filter('filter')(vm.all[typePage], {label: query});
            vm[typePage] = result;
            console.log('searchPage', typePage, query, result);
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
            let type = isQuickAccess ? vm.types.quickAccess : vm.types.mainMenu;
            let instanceModal = _openEditMenu(item, parent, isQuickAccess);
            instanceModal.result.then(function(res) {
                vm[type] = res.list || vm[type];
                _changeItemFromList(vm[type], res.item);
            }).catch(function(error) {console.error(error);});
        }

        function _changeItemFromList(list, item) {
            let itemModel = _searchDeep(list, item.id);
            let isChangeName = itemModel.label !== item.label;
            if(isChangeName && !item.oldLabel) {
                itemModel.oldLabel = itemModel.label;
            }
            itemModel.oldLabel = itemModel.oldLabel === item.label ? '' : itemModel.oldLabel;
            delete item.oldLabel;
            for(let key in item) {
                itemModel[key] = item[key];
            }
        }

        function _openEditMenu(itemMenu, itemParent, isQuickAccess) {
            var instanceModal = $uibModal.open({
                templateUrl: 'modules/new-menu/edit-modal/menu-edit.modal.template.html',
                controller: 'MenuEditController as vm',
                keyboard: false,
                size: 'md',
                resolve: {
                    listSelect: function() { return isQuickAccess ? null : angular.copy(vm[vm.types.mainMenu]); },
                    item: function() { return angular.copy(itemMenu); },
                    parent: function() { return angular.copy(itemParent); },
                    isQuick: function() { return isQuickAccess; },
                }
            });
            return instanceModal;
        }

        function removeItemDialog(type, item, parent) {
            var title = 'Confirmar exclusão do <b>' + item.label + '</b> e seus subitens do menu?';
            ModalService.confirm(title)
            .result
            .then(function() {
                _removeItem(type, item, parent);
            }).catch(function(error) { console.error(error); });
        }

        function _removeItem(type, item, parent) {
            let listToRemove = parent ? parent.children : vm[type];
            var idxItem = listToRemove.indexOf(item);
            listToRemove.splice(idxItem, 1);

            _backToPages(type, item);
            if(item.children.length) {
                _backDeepToPages(type, item.children);
                item.children = [];
            }
        }

        function _backToPages(type, item) {
            if(type === vm.types.mainMenu) {
                vm.pages.unshift(item);
                vm.all.pages.unshift(item);
            } else {
                vm.pagesQuick.unshift(item);
                vm.all.pagesQuick.unshift(item);
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

        function _searchDeep(list, id) {
            let found;
            for(var i = 0; i < list.length; i++) {
                if(list[i].id === id) {
                    return list[i];
                }
                if (list[i].children.length) {
                    found = _searchDeep(list[i].children, id);
                }
                if(found) {
                    return found;
                }
            }
            return null;
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
                    _setCopyPagesToFilter();
                });
        }

        function _setCopyPagesToFilter() {
            vm.all = {};
            vm.all.pages = angular.copy(vm.pages);
            vm.all.pagesQuick = angular.copy(vm.pagesQuick);
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

        function _itemRemoved(e, ui) {
            let itemRemoved = ui.item[0];
            let isRemovedPage = itemRemoved.dataset && 
                (itemRemoved.dataset.type === 'pagesQuick' || itemRemoved.dataset.type === 'pages');
            if(isRemovedPage) {
                _whenRemovePage(itemRemoved.dataset.type, Number.parseInt(itemRemoved.dataset.id));
            }
        }
        
        function _whenRemovePage(typePage, id) {
            let listAllPages = vm.all[typePage];
            let index = listAllPages.findIndex(function (pg) {
                if(pg.page && pg.page.id) {
                    return pg.page.id === id;
                }
                return pg.id === id;
            });
            if(index >= 0) {
                listAllPages.splice(index, 1);
            }
        }

        function _baseConfigSortable(type) {
            return {
                connectWith: '.connect-' + type,
                dropOnEmpty: true,
                cursor: 'move',
                remove: _itemRemoved
            };
        }

        function _initKeyType() {
            vm.types = {
                quickAccess: 'quickAccess',
                mainMenu: 'mainMenu'
            };
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('menu');
        }

        function _permissions() {
            _canPut();
        }

        function _createLink() {
            vm.link = {
                children: [],
            };
        }

        function activate() {
            _initKeyType();
            _createLink();
            vm.loading = {};
            vm.stateToggles = {};
            vm.optionsSortableItems = _setOptionsSortable(vm.types.mainMenu, 'placeholder-main');
            vm.optionsSortableQuick = _setOptionsSortable(vm.types.quickAccess, 'placeholder-main');
            $q.all([_loadData(vm.types.mainMenu), _loadData(vm.types.quickAccess)]).then(function() {
                _loadPages();
                _permissions();
            });
        }
    }
})();