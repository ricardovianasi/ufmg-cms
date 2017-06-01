(function () {
    'use strict';

    angular.module('mediaModule')
        .controller('MediaController', MediaController);

    /** ngInject */
    function MediaController($scope,
        $uibModal,
        $route,
        MediaService,
        PermissionService,
        $log,
        dataTableConfigService,
        StatusService,
        NotificationService,
        DateTimeHelper,
        ModalService,
        Util,
        $rootScope) {
        $rootScope.shownavbar = true;
        $log.info('MediaController');

        var vm = $scope;

        vm.convertDate = DateTimeHelper.convertDate;
        vm.media = [];
        vm.status = [];
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
            var numberOfColumns = 5;
            var columnsHasNotOrder = [0, 4];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 1,
                name: 'title'
            }, {
                index: 2,
                name: 'name',
                filter: 'author'
            }, {
                index: 3,
                name: 'postDate'
            }]);

            function getMedias(params, fnCallback) {
                MediaService
                    .getMedias(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        vm.media = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);

                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getMedias);
        }

        vm.removeMedia = function (id) {
            ModalService
                .confirm('Você deseja excluir a mídia selecionada?', ModalService.MODAL_MEDIUM)
                .result.then(function () {
                    MediaService.removeMedia(id).then(function () {
                        NotificationService.success('Mídia removida com sucesso.');
                        vm.dtInstance.DataTable.draw();
                    }, function () {
                        NotificationService
                            .error('A imagem está vinculada a alguma postagem, por este motivo não é possível exclui-la.');
                    });
                });
        };
    }
})();
