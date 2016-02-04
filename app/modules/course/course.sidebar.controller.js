;(function(){
  'use strict';

  angular.module('courseModule')
    .controller('CourseSidebarController', CourseSidebarController);


  CourseSidebarController.$inject = ['$scope',
                                      '$routeParams',
                                      '$filter',
                                      'PagesService',
                                      'WidgetsService',
                                      'ModalService',
                                      'CourseService',
                                      'NotificationService'];

  function CourseSidebarController($scope, $routeParams, $filter, PagesService, WidgetsService, ModalService, CourseService, NotificationService) {
    var vm = this;

    vm.type = $routeParams.type;
    vm.save = _save;
    $scope.course = {
      widgets: {
        sidebar: []
      }
    };

    WidgetsService.getWidgets().then(function (data) {
      console.log(data.data);
      $scope.widgets = data.data;
    });

    /**
     *
     * @param column
     * @param idx
     * @returns {*}
     */
    vm.handleModule = function (column, idx) {
      return PagesService.module().handle($scope, column, idx);
    };

    /**
     * @param column
     * @param idx
     */
    $scope.removeModule = function (column, idx) {
      ModalService
        .confirm('Deseja remover o widget?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          $scope.course.widgets[column].splice(idx, 1);
        });
    };

    /**
     *
     * @private
     */
    function _save(){
      CourseService.updateCourses(vm.type, $scope.course.widgets.sidebar).then(function(data){
        NotificationService.success('sidebar salva com sucesso!');
      });
    }

  }
})();
