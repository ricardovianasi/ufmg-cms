(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalController', PeriodicalController);

    /** ngInject */
    function PeriodicalController(dataTableConfigService, PeriodicalService, DateTimeHelper, NotificationService, 
        DTOptionsBuilder, PermissionService, DTColumnDefBuilder, ModalService) {

        var vm = this;

        vm.periodicals = [];
        vm.currentPage = 1;
        vm.convertDate = _convertDate;
        vm.setNamePeriodical = _setNamePeriodical;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;

        vm.changeStatus = changeStatus;
        vm.removePeriodical = removePeriodical;

        activate();

        function changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'name'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_loadPeriodicals);
        }

        function _loadPeriodicals(params, fnCallback) {
            let numberOfColumns = 4;
            let columnsHasNotOrder = [3];
            PeriodicalService
                .getPeriodicals(false, dataTableConfigService.getParams(params))
                .then(function (res) {
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    _permissions();
                    vm.periodicals = res.data;
                    var records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    fnCallback(records);
                });
        }

        function _setNamePeriodical(periodical) {
            PeriodicalService.setPeriodicalName(periodical);
        }

        function _convertDate(data) {
            return DateTimeHelper.dateToStr(data);
        }

        function removePeriodical(id, description) {
            let titleModal = 'Você deseja excluir a publicação <b>"' + description + '"</b>?';
            let modal = ModalService.confirm(titleModal, ModalService.MODAL_MEDIUM, { isDanger: true });
            modal.result.then(function () {
                PeriodicalService.removePeriodical(id).then(function () {
                    NotificationService.success('Publicação removida com sucesso.');
                    vm.dtInstance.DataTable.draw();
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('periodical');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('periodical');
        }

        function activate() {
            _renderDataTable();
        }
    }
})();
