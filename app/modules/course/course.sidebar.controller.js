(function () {
    'use strict';

    angular.module('courseModule')
        .controller('CourseSidebarController', CourseSidebarController);

    /** ngInject */
    function CourseSidebarController($scope,
        $routeParams,
        PagesService,
        WidgetsService,
        ModalService,
        CourseService,
        NotificationService,
        $rootScope,
        $location,
        HandleChangeService) {
        var vm = this;

        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId;
        vm.save = _save;

        HandleChangeService.registerHandleChange('/course', ['PUT'], $scope,
            ['course'], undefined, _hasLoaded);

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

        function _hasLoaded(oldValue) {
            return oldValue.widgets.sidebar.length > 0 || !vm.courseId;
        }

        function _getCourses() {
            CourseService.getCourses(vm.type, true).then(function (data) {
                $scope.course.widgets.sidebar = data.data.items[0].sidebar;
            });
        }

        function _getCoursesRoutes() {
            CourseService.getCourseRoute(vm.type, vm.courseId).then(function (data) {
                if (data.data.sidebar.length > 0) {
                    $scope.course.widgets.sidebar = data.data.sidebar;
                } else {
                    _getCourses();
                }
            });
        }

        vm.handleModule = function (column, idx) {
            return PagesService.module().handle($scope, column, idx);
        };

        $scope.removeModule = function (column, idx) {
            ModalService
                .confirm('Deseja remover o widget?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    $scope.course.widgets[column].splice(idx, 1);
                });
        };

        function _save() {
            if (typeof vm.courseId !== 'undefined') {
                CourseService.updateRoutesSidebar(vm.type, vm.courseId, $scope.course.widgets.sidebar).then(function () {
                    NotificationService.success('sidebar do percurso salva com sucesso!');
                    $location.path('course/list/' + vm.type);
                });
            } else {
                CourseService.updateCourses(vm.type, $scope.course.widgets.sidebar).then(function () {
                    NotificationService.success('sidebar salva com sucesso!');
                    $location.path('course/list/' + vm.type);
                });
            }
        }
    }
})();
