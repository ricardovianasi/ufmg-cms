;
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
        $rootScope) {
        $rootScope.shownavbar = true;
        $log.info('MediaController');

        $scope.media = [];
        $scope.status = [];
        $scope.currentPage = 1;

        var loadMedia = function (page) {
            MediaService.getMedia(page).then(function (data) {
                $scope.media = data.data;
                $scope.dtOptions = dataTableConfigService.init();
            });
        };

        loadMedia();

        $scope.changePage = function () {
            loadMedia($scope.currentPage);
        };

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        $scope.convertDate = DateTimeHelper.convertDate;

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

        $scope.removeMedia = function (id) {
            ModalService
                .confirm('Você deseja excluir a mídia selecionada?', ModalService.MODAL_MEDIUM)
                .result.then(function () {
                    MediaService.removeMedia(id).then(function () {
                        NotificationService.success('Mídia removida com sucesso.');

                        $route.reload();
                    }, function () {
                        NotificationService.error('A imagem está vinculada a alguma postagem, por este motivo não é possível exclui-la.');
                    });
                });
        };
    }
})();
