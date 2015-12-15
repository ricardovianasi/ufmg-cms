;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesController', PagesController);

  PagesController.$inject = [
    '$scope',
    '$uibModal',
    'PagesService',
    'NotificationService',
    'StatusService',
    'DTOptionsBuilder',
    'DTColumnDefBuilder'
  ];

  function PagesController($scope, $uibModal, PagesService, NotificationService, StatusService, DTOptionsBuilder, DTColumnDefBuilder) {
    console.log('... PagesController');

    $scope.status = [];
    $scope.pages = [];
    $scope.currentPage = 1;

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    /**
     * @param page
     */
    var loadPages = function (page) {
      PagesService.getPages(page).then(function (data) {
        $scope.pages = data.data;

        /**
        * config DTOptionsBuilder
        */
        $scope.dtOptions = DTOptionsBuilder
                            .newOptions()
                            .withPaginationType('full_numbers')
                            .withDisplayLength(30)
                            .withLanguage({
                                "sEmptyTable":     "Nenhum dado foi encontrado. :(",
                                "sInfo":           "Mostrando de _START_ hà _END_ de _TOTAL_ resultados",
                                "sInfoEmpty":      "Mostrando de 0 hà 0 de 0 resultados",
                                "sInfoFiltered":   "(Filtrado de _MAX_ resultados)",
                                "sInfoPostFix":    "",
                                "sInfoThousands":  ",",
                                "sLengthMenu":     "Mostrar _MENU_ resultados",
                                "sLoadingRecords": "Carregando...",
                                "sProcessing":     "Processando...",
                                "sSearch":         "Pesquisar: ",
                                "sZeroRecords":    "Não foram encontrados resultados",
                                "oPaginate": {
                                    "sFirst":    "<<",
                                    "sLast":     ">>",
                                    "sNext":     ">",
                                    "sPrevious": "<"
                                },
                                "oAria": {
                                    "sSortAscending":  ": filtro ascendente ativo",
                                    "sSortDescending": ": filtro descendente ativo"
                                }
                            })
                            .withBootstrap();

        /**
        * config DTColumnDefBuilder
        */
        $scope.dtColumns = [
          DTColumnDefBuilder.newColumnDef(0),
          DTColumnDefBuilder.newColumnDef(1),
          DTColumnDefBuilder.newColumnDef(2)
        ];
      });
    };

    loadPages();

    $scope.changePage = function () {
      loadPages($scope.currentPage);
    };

    $scope.convertDate = function (date) {
      return new Date(date);
    };

    $scope.removePage = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir a página ' + description + '?');
      removeConfirmationModal.result.then(function (data) {
        PagesService.removePage(id).then(function (data) {
          NotificationService.success('Página removida com sucesso.');
          loadPages();
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
  }
})();
