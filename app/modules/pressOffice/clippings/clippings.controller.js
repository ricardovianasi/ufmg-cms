(function () {
    'use strict';

    angular.module('clippingsModule')
        .controller('ClippingsController', ClippingsController);

    /** ngInject */
    function ClippingsController(
        $scope,
        $uibModal,
        $filter,
        $route,
        ClippingsService,
        PermissionService,
        dataTableConfigService,
        DateTimeHelper,
        NotificationService,
        $rootScope,
        Util,
        $log
    ) {
        $log.info('ClippingsController');

        var vm = $scope;
        var removeConfirmationModal;

        vm.title = 'Clippings';
        vm.clippings = [];
        vm.DateTimeHelper = DateTimeHelper;
        vm.currentPage = 1;
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;


        function onInit() {
            _renderDataTable();
        }

        function _changeStatus(status) {
            vm.itemStatus = status;
            dataTableConfigService.setParamStatus(status);
            vm.dtInstance.DataTable.draw();
        }

        function _renderDataTable() {
            var numberOfColumns = 3;
            var columnsHasNotOrder = [];
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

            function getClippings(params, fnCallback) {
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
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getClippings);
        }


        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            var vm = $scope;
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        vm.confirmationModal = function (size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: ConfirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        };

        vm.removeClipping = function (id, description) {
            vm.confirmationModal('md', $filter('format')('Você deseja excluir o clipping "{0}"?', description));

            removeConfirmationModal.result.then(function () {
                ClippingsService.destroy(id).then(function () {
                    NotificationService.success('Clipping removido com sucesso.');
                    vm.dtInstance.DataTable.draw();
                });
            });
        };

        function _permissions() {
            _canDelete();
            _canPost();
            _canPut();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('clipping');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('clipping');
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('clipping');
        }
        onInit();
    }
})();
