;(function () {
  'use strict';

  angular.module('mediaModule')
    .controller('MediaController', MediaController);

  MediaController.$inject = [
    '$scope',
    '$uibModal',
    '$route',
    'MediaService',
    'dataTableConfigService',
    'StatusService',
    'NotificationService',
    'DateTimeHelper',
    'ModalService',
  ];

  /**
   * @param $scope
   * @param $uibModal
   * @param $route
   * @param MediaService
   * @param dataTableConfigService
   * @param StatusService
   * @param NotificationService
   * @param DateTimeHelper
   * @param ModalService
   *
   * @constructor
   */
  function MediaController($scope,
                           $uibModal,
                           $route,
                           MediaService,
                           dataTableConfigService,
                           StatusService,
                           NotificationService,
                           DateTimeHelper,
                           ModalService) {
    console.log('... MediaController');

    $scope.media = [];
    $scope.status = [];
    $scope.currentPage = 1;

    /**
     * @param page
     */
    var loadMedia = function (page) {
      MediaService.getMedia(page).then(function (data) {
        $scope.media = data.data;
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadMedia();

    /**
     *
     */
    $scope.changePage = function () {
      loadMedia($scope.currentPage);
    };

    /**
     *
     */
    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.convertDate = DateTimeHelper.convertDate;

    var removeConfirmationModal;

    /**
     * @param size
     * @param title
     */
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

    /**
     * @param id
     */
    $scope.removeMedia = function (id) {
      ModalService
        .confirm('Você deseja excluir a mídia selecionada?')
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
