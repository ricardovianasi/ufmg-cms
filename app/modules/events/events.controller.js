(function () {
    'use strict';

    angular.module('eventsModule')
        .controller('EventsController', EventsController);

    /** ngInject */
    function EventsController($scope,
        $route,
        PermissionService,
        dataTableConfigService,
        EventsService,
        DateTimeHelper,
        ModalService,
        NotificationService,
        $rootScope,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('EventsController');

        var vm = $scope;

        vm.title = 'Eventos';
        vm.convertDate = DateTimeHelper.convertDate;
        vm.events = [];
        vm.currentPage = 1;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};

        onInit();

        function onInit() {
            _renderDataTable();
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
                name: 'name'
            }, {
                index: 1,
                filter: 'author',
                name: 'name'
            }, {
                index: 2,
                name: 'postDate'
            }]);

            function getEvents(params, fnCallback) {
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
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getEvents);
        }

        vm.remove = function (id, title) {
            ModalService
                .confirm('Deseja remover o evento <b>' + title + '</b>', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    EventsService.destroy(id).then(function () {
                        NotificationService.success('Evento removido com sucesso!');
                        vm.dtInstance.DataTable.draw();
                    });
                });
        };

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
    }
})();
