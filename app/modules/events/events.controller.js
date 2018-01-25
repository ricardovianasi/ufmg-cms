(function () {
    'use strict';

    angular.module('eventsModule')
        .controller('EventsController', EventsController);

    /** ngInject */
    function EventsController(PermissionService, dataTableConfigService, EventsService, DateTimeHelper,
        ModalService, NotificationService) {

        let vm = this;

        vm.title = 'Eventos';
        vm.convertDate = DateTimeHelper.convertDate;
        vm.events = [];
        vm.currentPage = 1;
        vm.itemStatus = 'all';
        vm.dtInstance = { };
        vm.canPost = false;
        
        vm.changeStatus = changeStatus;
        vm.remove = remove;

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
            }, {
                index: 3,
                filter: 'type',
                name: 'name'
            }]);
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(_loadEvents);
        }

        function _loadEvents(params, fnCallback) {
            let numberOfColumns = 5;
            let columnsHasNotOrder = [4];
            EventsService
                .getEvents(dataTableConfigService.getParams(params))
                .then(function (res) {
                    vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                    _permissions();
                    vm.events = res.data;
                    var records = {
                        'draw': params.draw,
                        'recordsTotal': res.data.total,
                        'data': [],
                        'recordsFiltered': res.data.total
                    };
                    fnCallback(records);
                });
        }

        function remove(id, title) {
            ModalService
                .confirm('Deseja remover o evento <b>' + title + '</b>?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(function () {
                    EventsService.destroy(id).then(function () {
                        NotificationService.success('Evento removido com sucesso!');
                        vm.dtInstance.DataTable.draw();
                    });
                });
        }

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('events');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('events');
        }

        function activate() {
            _renderDataTable();
        }
    }
})();
