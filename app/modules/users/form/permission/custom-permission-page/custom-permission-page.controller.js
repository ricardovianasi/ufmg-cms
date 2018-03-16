(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('CustomPermissionPageController', CustomPermissionPageController);

    /** ngInject */
    function CustomPermissionPageController($q, data, PagesService, WidgetsService, NotificationService, $uibModalInstance) {
        let vm = this;

        vm.deletePage = deletePage;
        vm.deleteModule = deleteModule;
        vm.startDialogDelete = startDialogDelete;
        vm.addPage = addPage;
        vm.onPageSelected = onPageSelected;
        vm.addModule = addModule;
        vm.close = close;
        vm.save = save;

        activate();

        ////////////////

        function close() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close(_prepareToSave());
        }

        function onPageSelected(page) {
            vm.pageToAdd = page;
        }

        function addModule(page) {
            if(_canAddedWidget(page.modules, vm.moduleSelected)) {
                page.modules.unshift(_createWidgetToAdd(vm.moduleSelected));
            }
            vm.moduleSelected = undefined;
        }

        function addPage() {
            if(_canAddedPage(vm.pageToAdd)) {
                vm.dataList.unshift(_createPageToAdd(vm.pageToAdd));
            }
            vm.pageSelected = undefined;
            
        }

        function deleteModule(idxModule, page) {
            page.modules.splice(idxModule, 1);
        }

        function deletePage(result, page) {
            let idPage = page.idPage
            let idx = vm.dataList.findIndex(function(data) {
                return idPage === data.idPage;
            });
            endDialodDelete(idPage);
            if(result) {
                vm.dataList.splice(idx, 1);
            }
        }

        function endDialodDelete(idPage) {
            vm.toggleDelete[idPage] = false;
        }

        function startDialogDelete(idPage) {
            vm.toggleDelete[idPage] = true;
        }

        function _prepareToSave() {
            let putPagesIds = [];
            let dataListRaw = angular.copy(vm.dataList);
            let customPutSpecial = _preparePagesToSave(vm.dataList, putPagesIds);
            return {
                idsPages: putPagesIds.join(','),
                putSpecial: JSON.stringify(customPutSpecial),
                raw: dataListRaw 
            };
        }

        function _preparePagesToSave(pages, putPagesIds) {
            return pages.map(function (data) {
                data.modules = _prepareModulesToSave(data.modules);
                putPagesIds.push(data.idPage);
                delete data.title;
                return data;
            });
        }

        function _prepareModulesToSave(modules) {
            return modules.map(function(mod) {
                delete mod.label;
                return mod;
            });
        }

        function _canAddedPage(page) {
            let result = false;
            let isAdded = _checkAdded(page, vm.dataList, 'id', 'idPage');
            if(page && !isAdded) {
                result = true;
            } else if(!page) {
                NotificationService.warn('Atenção, deve ser selecionada uma página antes de inserir.');
            } else if(isAdded) {
                NotificationService.warn('Atenção, esta página já foi inserida.');
            }
            return result;
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
            if(!obj) {return false; };
            let idx = list.findIndex(function(objAdded) {
                return objAdded[refList] === obj[refObj];
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


        function _createWidgetToAdd(widget) {
            return {
                type: widget.type,
                label: widget.label,
                permissions: { put: false, post: false, delete: false }
            }
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