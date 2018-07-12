(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesController', PagesController);

    /** ngInject */
    function PagesController($scope, dataTableConfigService, PermissionService, PagesService, NotificationService,
        ModalService, DateTimeHelper, $log) {

        $log.info('PagesController');
        var vm = $scope;
        vm.dtColumns = {};
        vm.dtOptions = {};
        vm.pages = null;
        vm.currentPage = 1;
        vm.remove = _remove;
        vm.canDelete = null;
        vm.canPost = null;
        vm.changeStatus = _changeStatus;
        vm.showButtonEdit = showButtonEdit;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPut = canPut;

        function onInit() {
            _renderDataTable();
            vm.convertDate = DateTimeHelper.convertDate;
        }

        function _changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            var numberOfColumns = 4;
            var columnsHasNotOrder = [3];
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

            function getPages(params, fnCallback) {
                PagesService.getPagesByUser(dataTableConfigService.getParams(params), true)
                    .then(function(res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.pages = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getPages);
        }

        function _remove(id, title) {
            ModalService
                .confirm('Você deseja excluir a página <b>' + title + '</b>?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(function () {
                    PagesService
                        .removePage(id)
                        .then(function () {
                            vm.dtInstance.DataTable.draw();
                            NotificationService.success('Página removida com sucesso.');
                        });
                });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('page');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('page');
        }

        function canPut(context, id) {
            return PermissionService.canPut('page', id);
        }

        function showButtonEdit(item) {
            return canPut('page', item.id) || (item.isAuthor && vm.canPost);
        }

        onInit();
    }
})();
