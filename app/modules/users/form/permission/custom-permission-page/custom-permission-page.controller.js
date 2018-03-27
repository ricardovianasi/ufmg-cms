(function() {
    'use strict';

    angular
        .module('usersModule')
        .controller('CustomPermissionPageController', CustomPermissionPageController);

    /** ngInject */
    function CustomPermissionPageController($q, data, dataUser, PagesService, WidgetsService,
        NotificationService, $uibModalInstance) {
        let vm = this;

        vm.deletePage = deletePage;
        vm.deleteModule = deleteModule;
        vm.toggleDialogDelete = toggleDialogDelete;
        vm.addPage = addPage;
        vm.changePutSuper = changePutSuper;
        vm.onPageSelected = onPageSelected;
        vm.addModule = addModule;
        vm.isPageCreator = isPageCreator;
        vm.getMessageCreator = getMessageCreator;
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

        function getMessageCreator() {
            let firstName = dataUser.name.split(' ')[0];
            return firstName + ' é o autor.';
        }

        function isPageCreator(idAuthor) {
            if(dataUser) {
                return dataUser.id === idAuthor; 
            }
            return false;
        }

        function changePutSuper(page) {
            if(page.permissions.putSuper) {
                page.permissions.putTag = true;
            }
        }

        function onPageSelected(page) {
            vm.pageToAdd = page;
        }

        function addModule(page, widget, voidToast) {
            let moduleToAdd = widget || vm.moduleSelected;
            if(_canAddedWidget(page.modules, moduleToAdd, voidToast)) {
                page.modules.unshift(_createWidgetToAdd(moduleToAdd));
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
            let idx = _getIndexPage(page.idPage);
            endDialodDelete(page.idPage);
            if(result) {
                vm.dataList.splice(idx, 1);
            }
        }

        function endDialodDelete(idPage) {
            vm.toggleDelete[idPage] = false;
        }

        function toggleDialogDelete(idPage) {
            vm.toggleDelete[idPage] = !vm.toggleDelete[idPage];
        }

        function _prepareToSave() {
            let putPagesIds = [];
            let dataListRaw = angular.copy(vm.dataList);
            let customPutSpecial = _preparePagesToSave(vm.dataList, putPagesIds);
            let code64 = btoa(JSON.stringify(customPutSpecial));
            return {
                idsPages: putPagesIds.join(','),
                putSpecial: code64,
                raw: dataListRaw 
            };
        }

        function _preparePagesToSave(pages, putPagesIds) {
            return pages.map(function (data) {
                data.modules = _prepareModulesToSave(data.modules);
                putPagesIds.push(data.idPage);
                delete data.title;
                delete data.idAuthor;
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

        function _canAddedWidget(modules, widget, voidToast) {
            let result = false;
            let isAdded = _checkAdded(widget, modules, 'type', 'type');
            if(widget && !isAdded) {
                result = true;
            } else if(!widget && !voidToast) {
                NotificationService.warn('Atenção, deve ser selecionado um módulo antes de inserir.');
            } else if(isAdded && !voidToast) {
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

        function _createPageToAdd(page) {
            _loadModulesPreAdded(page.id);
            return {
                idPage: page.id,
                title: page.title,
                idAuthor: page.author.id,
                modules: [],
                permissions: { putTag:false, putSuper: false }
            };
        }

        function _loadModulesPreAdded(idPage) {
            vm.isLoadingModules = true;
            PagesService.getPage(idPage).then(function(dataPage) {
                let idx = _getIndexPage(idPage);
                let widgets = dataPage.data.widgets;
                let page = vm.dataList[idx];
                if(widgets) {
                    let allWidgets = widgets.main.concat(widgets.side);
                    allWidgets.forEach(function(widget) { addModule(page, widget, true); });
                }
            }).catch(function(err) { console.error(err); })
            .then(function() {
                vm.isLoadingModules = false;
            });
        }

        function _createWidgetToAdd(widget) {
            return {
                type: widget.type,
                label: widget.label || widget.title,
                permissions: { put: false, post: false, delete: false }
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
            try { data = JSON.parse(atob(data)); }
            catch (err) { data = []; }
            vm.dataList = data.map(function (pagePermission) {
                let page = vm.listAllPages.find(function(pg) {
                    return pg.id === pagePermission.idPage;
                });
                pagePermission.modules = _mapsWidgets(pagePermission.modules);
                pagePermission.title = page.title;
                pagePermission.idAuthor = page.author.id;
                return pagePermission;
            });
        }
        
        function _loadDataList() {
            if(!data) { return; }
            $q.all([_loadAllWidgets(), _loadAllPages()])
                .then(function () { _mapsData(); });
        }

        function _getIndexPage(idPage) {
            return vm.dataList.findIndex(function(pg) {
                return idPage === pg.idPage;
            });
        }

        function activate() {
            vm.toggleDelete = {};
            vm.dataList = [];
            _loadDataList(); 
        }
    }
})();