(function () {
    'use strict';

    angular.module('clippingsModule')
        .controller('ClippingsController', ClippingsController);

    /** ngInject */
    function ClippingsController($filter, $route, ClippingsService, PermissionService,
        dataTableConfigService, DateTimeHelper, NotificationService, $rootScope, Util, $log, ModalService) {

        let vm = this;

        vm.title = 'Clippings';
        vm.clippings = [];
        vm.DateTimeHelper = DateTimeHelper;
        vm.currentPage = 1;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;
        
        vm.changeStatus = changeStatus;
        vm.removeClipping = removeClipping;

        activate();

        function changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_loadReleases);
        }

        function _loadReleases(params, fnCallback) {
            let numberOfColumns = 3;
            let columnsHasNotOrder = [];
            ClippingsService
                .getClippings(dataTableConfigService.getParams(params))
                .then(function (res) {
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    _permissions();
                    vm.clippings = res.data;
                    var records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    fnCallback(records);
                });
        }

        function removeClipping(id, description) {
            let titleModal = $filter('format')('Você deseja excluir o clipping <b>"{0}"</b>?', description);
            let modal = ModalService.confirm(titleModal, ModalService.MODAL_MEDIUM, { isDanger: true });
            modal.result.then(function () {
                ClippingsService.destroy(id).then(function () {
                    NotificationService.success('Clipping removido com sucesso.');
                    vm.dtInstance.DataTable.draw();
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('clipping');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('clipping');
        }

        function activate() {
            _renderDataTable();
        }

    }
})();
