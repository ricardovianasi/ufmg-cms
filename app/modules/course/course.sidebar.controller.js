;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseSidebarController', CourseSidebarController);

  CourseSidebarController.$inject = ['$scope',
    '$routeParams',
    'PagesService',
    'WidgetsService',
    'ModalService',
    'CourseService',
    'NotificationService'];

  /**
   * @param $scope
   * @param $routeParams
   * @param PagesService
   * @param WidgetsService
   * @param ModalService
   * @param CourseService
   * @param NotificationService
   *
   * @constructor
   */
  function CourseSidebarController($scope,
                                   $routeParams,
                                   PagesService,
                                   WidgetsService,
                                   ModalService,
                                   CourseService,
                                   NotificationService) {
    var vm = this;

    vm.type = $routeParams.type;
    vm.save = _save;
    $scope.course = {
      widgets: {
        sidebar: []
      }
    };

    WidgetsService.getWidgets().then(function (data) {
      $scope.widgets = data.data;
    });

    CourseService.getCourses(vm.type, true).then(function (data) {
      $scope.course.widgets.sidebar = data.data.items[0].sidebar;
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
    function _save() {
      CourseService.updateCourses(vm.type, $scope.course.widgets.sidebar).then(function () {
        NotificationService.success('sidebar salva com sucesso!');
      });
    }
  }
})();
