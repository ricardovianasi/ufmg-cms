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
    'NotificationService',
    '$rootScope'];

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
                                   NotificationService,
                                   $rootScope) {
    $rootScope.shownavbar = true;
    var vm = this;

    vm.type = $routeParams.type;
    vm.courseId = $routeParams.courseId;
    vm.save = _save;

    $scope.course = {
      widgets: {
        sidebar: []
      }
    };

    if (typeof vm.courseId !== 'undefined') {
      _getCoursesRoutes();
    } else {
      _getCourses();
    }

    WidgetsService.getWidgets().then(function (data) {
      $scope.widgets = data.data;
    });

    /**
     *
     * @private
     */
    function _getCourses() {
      CourseService.getCourses(vm.type, true).then(function (data) {
        $scope.course.widgets.sidebar = data.data.items[0].sidebar;
      });
    }

    /**
     *
     * @private
     */
    function _getCoursesRoutes() {
      CourseService.getCourseRoute(vm.type, vm.courseId).then(function (data) {
        if (data.data.sidebar.length > 0)
          $scope.course.widgets.sidebar = data.data.sidebar;
        else
          _getCourses();
      });
    }

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
      if (typeof vm.courseId !== 'undefined') {
        CourseService.updateRoutesSidebar(vm.type, vm.courseId, $scope.course.widgets.sidebar).then(function () {
          NotificationService.success('sidebar do percurso salva com sucesso!');
        });
      } else {
        CourseService.updateCourses(vm.type, $scope.course.widgets.sidebar).then(function () {
          NotificationService.success('sidebar salva com sucesso!');
        });
      }
    }
  }
})();
