;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$scope',
    '$uibModal',
    'CourseService',
    'NotificationService',
    'StatusService'
  ];

  function CourseController($scope, $modal, CourseService, NotificationService, StatusService) {
    console.log('... CourseController');

    $scope.status = [];
    $scope.courses = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    CourseService.getCourseRoutes().then(function (data) {
      $scope.course_routes = data.data;
    });

    var removeConfirmationModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $modal.open({
        templateUrl: '/components/modal/confirmation.modal.template.html',
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
        // PaginasService.removePage(id).then(function(data){
        //     NotificationService.success('Página removida com sucesso.');
        //     $scope.loadPages();
        // });
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
