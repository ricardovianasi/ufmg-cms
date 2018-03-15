(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('CustomPermissionPageController', CustomPermissionPageController);

    /** ngInject */
    function CustomPermissionPageController($q, data, PagesService, WidgetsService, NotificationService) {
        let vm = this;

        vm.deletePage = deletePage;
        vm.deleteModule = deleteModule;
        vm.startDialogDelete = startDialogDelete;
        vm.addPage = addPage;
        vm.onPageSelected = onPageSelected;

        activate();

        ////////////////

        function onPageSelected(page) {
            vm.pageToAdd = page;
        }

        function addPage() {
            if(!_canAddedPage(vm.pageToAdd)) {
                return;
            }
            vm.dataList.unshift(_createPageToAdd(vm.pageToAdd));
        }

        function deleteModule(idxModule, page) {
            page.modules.splice(idxModule, 1);
        }

        function deletePage(result, type, idx) {
            endDialodDelete(type, idx);
            if(result) {
                vm.dataList.splice(idx, 1);
            }
        }

        function endDialodDelete(type, idx) {
            vm.toggleDelete[type+idx] = false;
        }

        function startDialogDelete(type, idx) {
            vm.toggleDelete[type+idx] = true;
            console.log('startDialogDelete', vm.toggleDelete);
        }

        function _canAddedPage(page) {
            let result = false;
            let isAdded = _checkPageAdded(page);
            if(page && !isAdded) {
                result = true;
            } else if(!page) {
                NotificationService.warn('Atenção, deve ser selecionada uma página antes de inserir.');
            } else if(isAdded) {
                NotificationService.warn('Atenção, esta página já foi inserida.');
            }
            return result;
        }

        function _checkPageAdded(page) {
            if(!page) {return false; };
            let idx = vm.dataList.findIndex(function(pgAdded) {
                return pgAdded.idPage === page.id
            });
            return idx >= 0;
        }

        function _createPageToAdd(page) {
            return {
                idPage: page.id,
                title: page.title,
                modules: [],
                permissions: { putTag:false, putSuper: false }
            };
        }

        function _loadAllWidgets() {
            return WidgetsService.getWidgets()
                .then(function(dataWidgets) {
                    vm.listAllWidgets = dataWidgets.data.items;
                });
        }

        function _loadAllPages() {
            return PagesService.getPages()
                .then(function(dataPages) {
                    vm.listAllPages = dataPages.data.items;
                });
        }

        function _mapsWidgets(listWidgets) {
            return listWidgets.map(function(widgetAdded) {
                let widget = vm.listAllWidgets.find(function(wgt) {
                    return wgt.type === widgetAdded.type;
                });
                widgetAdded.label = widget.label;
                return widgetAdded;
            });
        }

        function _mapsData() {
            vm.dataList = data.map(function (pagePermission) {
                let page = vm.listAllPages.find(function(pg) {
                    return pg.id === pagePermission.idPage;
                });
                pagePermission.modules = _mapsWidgets(pagePermission.modules);
                pagePermission.title = page.title;
                return pagePermission;
            });
            console.log('_mapsData', vm.dataList);
        }

        function _loadDataList() {
            if(!data) { return; }
            $q.all([_loadAllWidgets(), _loadAllPages()])
                .then(function () { _mapsData(); });
        }

        function activate() {
            vm.toggleDelete = {};
            vm.dataList = [];
            _loadDataList(); 
        }
    }
})();