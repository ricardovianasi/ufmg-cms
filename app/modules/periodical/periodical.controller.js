;
(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalController', PeriodicalController);

    /** ngInject */
    function PeriodicalController($scope,
        dataTableConfigService,
        PeriodicalService,
        DateTimeHelper,
        $uibModal,
        NotificationService,
        $route,
        PermissionService,
        $rootScope,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalController');

        $scope.periodicals = [];
        $scope.currentPage = 1;

        _permissions();

        $scope.convertDate = function (data) {
            return DateTimeHelper.dateToStr(data);
        };

        var loadPeriodicals = function (page) {
            PeriodicalService.getPeriodicals(null, page).then(function (data) {
                $scope.periodicals = data.data;
                $scope.dtOptions = dataTableConfigService.init();
            });
        };

        loadPeriodicals();

        $scope.changePage = function () {
            loadPeriodicals($scope.currentPage);
        };

        $scope.removePeriodical = function (id, description) {
            $scope.confirmationModal('md', 'Você deseja excluir a publicação "' + description + '"?');
            removeConfirmationModal.result.then(function (data) {
                PeriodicalService.removePeriodical(id).then(function (data) {
                    NotificationService.success('Publicação removida com sucesso.');
                    $route.reload();
                });
            });
        };

        var removeConfirmationModal;

        $scope.confirmationModal = function (size, title) {
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

        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            $scope.canPost = PermissionService.canPost('periodical');
        }

        function _canDelete() {
            $scope.canDelete = PermissionService.canDelete('periodical');
        }
    }
})();
