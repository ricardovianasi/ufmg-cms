;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$scope',
    '$uibModal',
    'CourseService',
    'dataTableConfigService',
    'NotificationService',
    'StatusService'
  ];

  function CourseController($scope,
                            $modal,
                            CourseService,
                            dataTableConfigService,
                            NotificationService,
                            StatusService) {
    clog('... CourseController');

    $scope.status = [];
    $scope.courses = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    CourseService.getCourseRoutes().then(function (data) {
      $scope.courses = data.data;
      $scope.dtOptions = dataTableConfigService.init();
    });


    var removeConfirmationModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $modal.open({
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

    $scope.removeCourse = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir o curso "' + description + '"?');
      removeConfirmationModal.result.then(function (data) {
        NotificationService.success('Curso removido com sucesso.');
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
