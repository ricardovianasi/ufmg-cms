;(function () {
  'use strict';

  angular.module('galleryModule')
    .controller('GalleryController', GalleryController);

  GalleryController.$inject = [
    '$scope',
    'dataTableConfigService',
    'GalleryService',
    'StatusService',
    'NotificationService',
    'ModalService',
    'DateTimeHelper',
  ];

  /**
   * @param $scope
   * @param dataTableConfigService
   * @param GalleryService
   * @param StatusService
   * @param NotificationService
   * @param ModalService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function GalleryController($scope,
                             dataTableConfigService,
                             GalleryService,
                             StatusService,
                             NotificationService,
                             ModalService,
                             DateTimeHelper) {
    console.log('... GaleriasController');

    $scope.galleries = [];
    $scope.status = [];
    $scope.currentPage = 1;
    $scope.DateTimeHelper = DateTimeHelper;

    var loadGalleries = function (page) {
      GalleryService.getGalleries(page).then(function (data) {
        $scope.galleries = data.data;
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadGalleries();

    $scope.changePage = function () {
      loadGalleries($scope.currentPage);
    };

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    /**
     * @param id
     * @param name
     */
    $scope.removeGallery = function (id, name) {
      ModalService
        .confirm('Você deseja excluir a galeria "' + name + '"?')
        .result
        .then(function () {
          GalleryService.removeGallery(id).then(function () {
            NotificationService.success('Galeria removida com sucesso.');
            $route.reload();
          });
        });
    };
  }
})();
