(function() {
    'use strict';

    angular
        .module('radioModule')
        .controller('CategoryListController', CategoryListController);

    /** ngInject */
    function CategoryListController(dataTableConfigService, RadioService, PermissionService, NotificationService, ModalService) {
        var vm = this;

        vm.registerCategory = registerCategory;
        vm.removeCategory = removeCategory;
        vm.openUpdateCategory = openUpdateCategory;

        vm.dtInstance = {};
        vm.dtOptions = {};
        vm.dtColumns = {};
        vm.listCategory = [];

        vm.nameCategory = '';
        vm.loading = false;

        activate();

        ////////////////

        function openUpdateCategory(categ, idx) {
            let modal = ModalService.inputModal('Edição de categoria da rádio', 'Nome', categ.name, 
                ModalService.MODAL_MEDIUM, {required: true});
            modal.result.then(function (name) {
                categ.name = name;
                _updateCategory(categ, idx);
            })
            .catch(function () { console.log('catch modal categ'); });
        }

        function removeCategory(id, name, idx) {
            let msgConfirm = 'Voce tem certeza que deseja remover a categoria <b>' + name + '</b>?';
            ModalService.confirm(msgConfirm, ModalService.MODAL_MEDIUM, {isDanger: true}).result
                .then(function() { _removeCategory(id, name, idx); })
                .catch(function() { console.log('catch modal delete'); });
        }

        function registerCategory() {
            if(!vm.nameCategory) { return; }
            vm.loading = true;
            RadioService.registerCategory({name: vm.nameCategory})
                .then(function(data) {
                    NotificationService.success('Categoria cadastrada com sucesso.');
                    vm.listCategory.unshift(data.data);
                    vm.nameCategory = '';
                })
                .catch(function(error) { console.error(error); })
                .finally(function() { vm.loading = false; });
        }

        function _updateCategory(categ, idx) {
            RadioService.updateCategory(categ, categ.id)
                .then(function () {
                    vm.listCategory[idx] = categ;
                    NotificationService.success('Categoria alterada com sucesso!');
                });
        }

        function _removeCategory(id, name, idx) {
            RadioService.deleteCategory(id)
                .then(function() {
                    vm.listCategory.splice(idx, 1);
                    if(vm.listCategory.length <= 1) {
                        vm.dtInstance.DataTable.draw();
                    }
                    NotificationService.success('Categoria ' + name + ' removida com sucesso!');
                });
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([
                { index: 0, name: 'name' },
            ]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getProgramas);
        }

        function getProgramas(params, cb) {
            let numberOfColumns = 2;
            let columnsHasNotOrder = [];
            RadioService.listCategory(dataTableConfigService.getParams(params))
                .then(function(res) {
                    _permissions();
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    vm.listCategory = res.data.items;
                    let records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    cb(records);
                });

        }

        function _permissions() {
            vm.canPut = PermissionService.canPut('radio_category');
            vm.canDelete = PermissionService.canDelete('radio_category');
            vm.canPost = PermissionService.canPost('radio_category');
            vm.canActions = vm.canPut && vm.canDelete;
        }

        function activate() {
            _renderDataTable();
        }
    }
})();