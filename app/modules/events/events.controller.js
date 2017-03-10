;
(function () {
    'use strict';

    angular.module('eventsModule')
        .controller('EventsController', EventsController);
    /** ngInject */
    function EventsController($scope,
        $route,
        PermissionService,
        dataTableConfigService,
        EventsService,
        DateTimeHelper,
        ModalService,
        NotificationService,
        $rootScope,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('EventsController');

        $scope.title = 'Eventos';
        $scope.events = [];
        $scope.currentPage = 1;


        var loadEvents = function (page) {
            EventsService.getEvents(page).then(function (data) {
                $scope.events = data.data;
                $scope.dtOptions = dataTableConfigService.init();
                _permissions();
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
                .confirm('Deseja remover o evento <b>' + title + '</b>', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    EventsService.destroy(id).then(function () {
                        NotificationService.success('Evento removido com sucesso!');
                        $route.reload();
                    });
                });
        };

        function _permissions() {
            _canDelete();
            _canPost();
        }

        function _canPost() {
            $scope.canPost = PermissionService.canPost('events');
        }

        function _canDelete() {
            $scope.canDelete = PermissionService.canDelete('events');
        }
    }
})();
