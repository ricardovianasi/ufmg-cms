(function() {
    'use strict';

    angular
        .module('alertPortalModule')
        .controller('alertController', alertController);

    /** ngInject */
    function alertController(dataTableConfigService, AlertService, AlertPermissionService, ModalService, NotificationService) {
        var vm = this;

        vm.remove = remove;

        vm.dtInstance = {};

        activate();

        ////////////////

        function activate() {
            _renderDataTable();
        }

        function _renderDataTable() {
            var numberOfColumns = 2;
            var columnsHasNotOrder = [1];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'title'
            }]);

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(alerts);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

            function alerts(params, fnCallback) {
                AlertService
                    .listAlerts(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        _permissions();
                        vm.alerts = res.data.items;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                    });
            }
        }

        function remove(id, title) {
            ModalService
                .confirm('Você deseja excluir o alerta <b>' + title + '</b>?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(() => AlertService.remove(id))
                .then(() => {
                    vm.dtInstance.DataTable.draw();
                    NotificationService.success('Alerta excluído com sucesso.');
                });
        }

        function _permissions() {
            vm.permission = AlertPermissionService.permissions();
        }
    }
})();
