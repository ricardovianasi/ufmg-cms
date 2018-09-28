(function () {
    'use strict';

    angular.module('releasesModule')
        .controller('ReleasesController', ReleasesController);

    function ReleasesController($filter, dataTableConfigService, NotificationService, ReleasesService,
        DateTimeHelper, PermissionService, ModalService) {

        let vm = this;

        vm.title = 'Releases';
        vm.releases = [];
        vm.currentPage = 1;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;

        vm.changeStatus = changeStatus;
        vm.removeRelease = removeRelease;

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
            ReleasesService
            .getReleases(dataTableConfigService.getParams(params))
            .then(function (res) {
                vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                _permissions();
                vm.releases = res.data;
                var records = {
                    'draw': params.draw,
                    'recordsTotal': res.data.total,
                    'data': [],
                    'recordsFiltered': res.data.total
                };
                fnCallback(records);
            });
        }

        function removeRelease(id, title) {
            let titleModal = $filter('format')('Você deseja excluir o release <b>"{0}"</b>?', title);
            let modal = ModalService.confirm(titleModal, ModalService.MODAL_MEDIUM, { isDanger: true });
            modal.result.then(function () {
                ReleasesService.destroy(id).then(function () {
                    vm.dtInstance.DataTable.draw();
                    NotificationService.success('Release removido com sucesso.');
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('release');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('release');
        }

        function activate() {
            vm.convertDate = DateTimeHelper.convertDate;
            _renderDataTable();
        }
    }
})();
