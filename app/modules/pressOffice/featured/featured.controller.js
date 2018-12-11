(function () {
    'use strict';

    angular.module('featuredModule')
        .controller('FeaturedController', featuredNewController);

    /** ngInject */
    function featuredNewController(
        featuredService,
        PermissionService,
        DateTimeHelper,
        dataTableConfigService,
        $filter,
        $uibModal,
        $scope,
        NotificationService
    ) {

        var vm = $scope;
        var removeConfirmationModal;

        vm.remove = _remove;
        vm.highlights = [];
        vm.changeStatus = _changeStatus;
        vm.itemStatus = 'all';
        vm.dtInstance = {};
        vm.canPost = false;

        function onInit() {
            vm.convertDate = DateTimeHelper.convertDate;
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

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getFeatureds);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

            function getFeatureds(params, fnCallback) {
                featuredService
                    .getFeatureds(dataTableConfigService.getParams(params))
                    .then(function (res) {
                        _permissions();
                        vm.highlights = res.data;
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

        function _confirmationModal(size, title) {
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
        }

        function _remove(id, description) {
            _confirmationModal('md', $filter('format')('Você deseja excluir o destaque "{0}"?', description));

            removeConfirmationModal.result.then(function () {
                featuredService.destroy(id).then(function () {
                    vm.dtInstance.DataTable.draw();
                    NotificationService.success('Destaque removido com sucesso.');
                });
            });
        }

        function _permissions() {
            _canDelete();
            _canPost();
            _canPut();
        }

        function _canPost() {
            vm.canPost = PermissionService.canPost('highlighted_press');
        }

        function _canDelete() {
            vm.canDelete = PermissionService.canDelete('highlighted_press');
        }

        function _canPut() {
            vm.canPut = PermissionService.canPut('highlighted_press');
        }


        onInit();
    }
})();
