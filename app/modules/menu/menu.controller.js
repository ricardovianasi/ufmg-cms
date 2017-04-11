(function () {
    'use strict';

    angular.module('menuModule')
        .controller('MenuController', MenuController);

    /** ngInject */
    function MenuController($scope,
        NotificationService,
        ModalService,
        PermissionService,
        MenuService,
        $log,
        Util,
        $q,
        PagesService,
        $rootScope,
        $filter) {

        $rootScope.shownavbar = true;
        $log.info('NoticiasController');

        var vm = this;
        var pages = [];
        var menus = MenuService.MENUS;

        Util.restoreOverflow();

        //Public functions
        vm.removeItem = _removeItem;
        vm.editTitle = _editTitle;
        vm.save = _save;
        vm.newGroup = _newGroup;
        vm.removeQuickAccessItem = _removeQuickAccessItem;

        vm.filterPages = function (menuType, val) {
            if (menuType == 'mainMenu') {
                vm.pages = $filter('filter')(vm.pages, val);
                if (vm.pages.length <= 0) {
                    vm.pages = pages;

                    _removePagesIndexed(menuType, $scope.menus[menuType], true);
                }
            } else {

                vm.quickPages = $filter('filter')(vm.quickPages, val);

                if (vm.quickPages.length <= 0) {
                    vm.quickPages = pages;

                    _removePagesIndexed(menuType, $scope.menus[menuType], true);
                }

            }
        };

        //Public models
        vm.pages = [];
        $scope.menus = {};
        vm.sortableOptions = {
            placeholder: 'list-group-item',
            connectWith: '.main',
            update: function (event, ui) {
                if (!ui.item.sortable.received) {
                    var originNgModel = ui.item.sortable.sourceModel;
                    var itemModel = originNgModel[ui.item.sortable.index];
                    if (
                        originNgModel == vm.pages ||
                        ui.item.sortable.droptargetModel == $scope.menus.quickAccess
                    ) {
                        var exists = !!$scope.menus.quickAccess.filter(function (x) {
                            return x.label === itemModel.label;
                        }).length;

                        if (exists) {
                            ui.item.sortable.cancel();
                        }
                    }
                }
            },
        };

        vm.quickSortableOptions = {
            placeholder: 'list-group-item-quickaccess',
            connectWith: '.main',
            stop: function (e, ui) {},
            update: function (event, ui) {
                // on cross list sortings received is not true
                // during the first update
                // which is fired on the source sortable
                if (!ui.item.sortable.received) {
                    var originNgModel = ui.item.sortable.sourceModel;
                    var itemModel = originNgModel[ui.item.sortable.index];


                    // check that its an actual moving
                    // between the two lists
                    if (
                        originNgModel == vm.quickPages ||
                        ui.item.sortable.droptargetModel == $scope.menus.quickAccess
                    ) {
                        var exists = !!$scope.menus.quickAccess.filter(function (x) {
                            return x.label === itemModel.label;
                        }).length;

                        if (exists) {
                            ui.item.sortable.cancel();
                        }
                    }
                }
            },
        };

        function _removeItem() {
            var args = Array.prototype.slice.call(arguments);
            var allArgs = Array.prototype.slice.call(arguments);

            ModalService
                .confirm('Deseja remover o item?')
                .result
                .then(function () {
                    var base = 0;
                    angular.forEach(allArgs, function (i) {
                        base++;
                    });

                    var spliceAux = allArgs.splice(0, 1)[0];

                    var menu = args.splice(0, 1)[0];
                    var idx = base > 3 ? args.splice(2, 1)[0] : args.splice(1, 1)[0];

                    if (idx === undefined) {
                        idx = args.splice(0, 1)[0];
                    }

                    var menuName = 'menus.' + menu;

                    var auxInterator = 0;

                    angular.forEach(allArgs, function (i) {

                        if (auxInterator !== 2 && allArgs.length === 3) {
                            menuName += '[' + i + '].children';
                        } else if (auxInterator !== 1 && allArgs.length === 2) {
                            menuName += '[' + i + '].children';
                        } else {
                            $log.info('ready');
                        }
                        auxInterator++;
                    });

                    var item = $scope.$eval(menuName);

                    vm.pages.push(item[idx]);
                    item.splice(idx, 1);
                });
        }

        function _removeQuickAccessItem(idx) {
            ModalService
                .confirm('Deseja remover o item?')
                .result
                .then(function () {
                    vm.quickPages.push($scope.menus.quickAccess[idx]);
                    $scope.menus.quickAccess.splice(idx, 1);
                });
        }

        function _editTitle(idx) {

            if (typeof idx.newTitle === 'undefined') {
                idx.newTitle = idx.label;
            }

            idx.editTitle = true;
        }

        function _save(type) {
            MenuService.update(inflection.underscore(type), $scope.menus[type]).then(function () {
                NotificationService.success('Menu salvo com sucesso!');
            });
        }

        function _newGroup(type) {
            $scope.menus[type].push({
                page: null,
                label: 'Novo grupo',
                target_blank: null,
                external_url: null,
                children: [],
            });
        }

        function _populateMenus() {
            angular.forEach(menus, function (value, type) {
                MenuService.get(type).then(function (data) {
                    menus[type] = data.data.items;
                    $scope.menus[type] = [];

                    _populateMenusChildren(type);
                    _removePagesIndexed(type, data.data.items, false);
                });
            });
        }

        function _populateMenusChildren(type) {
            angular.forEach(menus[type], function (item) {
                $scope.menus[type].push({
                    page: item.page ? item.page.id : null,
                    label: item.label,
                    target_blank: null,
                    external_url: null,
                    children: item.children || false,
                });
            });
        }

        PagesService.getPages().then(function (data) {

            angular.forEach(data.data.items, function (page) {
                pages.push({
                    page: page.id,
                    label: page.title,
                    target_blank: null,
                    external_url: null,
                    children: [],
                });
            });

            vm.pages = pages.slice();
            vm.quickPages = (JSON.parse(JSON.stringify(vm.pages)));

            _populateMenus();
            _permissions();

        });

        function _removePagesIndexed(menuType, menuItems, onFilter) {

            angular.forEach(menuItems, function (value, key) {

                if (onFilter) {
                    if (menuType == 'mainMenu') {
                        angular.forEach(vm.pages, function (v, k) {
                            if (menuItems[key].page == vm.pages[k].page)
                                vm.pages.splice(k, 1);
                        });
                    } else {
                        angular.forEach(vm.quickPages, function (v, k) {
                            if (menuItems[key].page == vm.quickPages[k].page)
                                vm.quickPages.splice(k, 1);
                        });
                    }
                } else {
                    if (menuType == 'mainMenu') {
                        angular.forEach(vm.pages, function (v, k) {
                            if (menuItems[key].page.id == vm.pages[k].page)
                                vm.pages.splice(k, 1);
                        });
                    } else {
                        angular.forEach(vm.quickPages, function (v, k) {
                            if (menuItems[key].page.id == vm.quickPages[k].page)
                                vm.quickPages.splice(k, 1);
                        });
                    }
                }

                if (menuItems[key].children.length > 0);
                _removePagesIndexed(menuType, menuItems[key].children, onFilter);
            });
        }

        function _permissions() {
            _canPut();
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('menu');
        }
    }
})();
