;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsController', EventsController);

  EventsController.$inject = [
    '$scope',
    'dataTableConfigService',
    'EventsService',
    'DateTimeHelper',
    'ModalService',
  ];

  /**
   * @param $scope
   * @param dataTableConfigService
   * @param EventsService
   * @param DateTimeHelper
   * @param ModalService
   *
   * @constructor
   */
  function EventsController($scope,
                            dataTableConfigService,
                            EventsService,
                            DateTimeHelper,
                            ModalService) {
    console.log('... EventsController');

    $scope.title = 'Eventos';
    $scope.events = [];
    $scope.currentPage = 1;

    var loadEvents = function (page) {
      EventsService.getEvents(page).then(function (data) {
        $scope.events = data.data;
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadEvents();

    $scope.changePage = function () {
      loadEvents($scope.currentPage);
    };

    $scope.convertDate = DateTimeHelper.convertDate;

    /**
     * @param id
     * @param title
     */
    $scope.remove = function (id, title) {
      ModalService
        .confirm('Deseja remover o evento <b>'+title+'</b>', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          EventsService.destroy(id).then(function () {
            NotificationService.success('Evento removido com sucesso!');
            loadEvents();
          });
        });
    };
  }
})();
