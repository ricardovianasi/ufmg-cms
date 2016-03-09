;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsController', EventsController);

  EventsController.$inject = [
    '$scope',
    '$route',
    'dataTableConfigService',
    'EventsService',
    'DateTimeHelper',
    'ModalService',
    'NotificationService',
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param $route
   * @param dataTableConfigService
   * @param EventsService
   * @param DateTimeHelper
   * @param ModalService
   * @param NotificationService
   *
   * @constructor
   */
  function EventsController($scope,
                            $route,
                            dataTableConfigService,
                            EventsService,
                            DateTimeHelper,
                            ModalService,
                            NotificationService,
                            $rootScope) {
    $rootScope.shownavbar = true;
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
            $route.reload();
          });
        });
    };
  }
})();
