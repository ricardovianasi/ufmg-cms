(function () {
    'use strict';

    angular.module('courseModule')
        .controller('CourseSidebarController', CourseSidebarController);

    /** ngInject */
    function CourseSidebarController($scope, $routeParams, WidgetsService, ModalService, CourseService,
        NotificationService, $location, $timeout) {
        var vm = this;

        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId;
        vm.handleModule = handleModule;
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

        function _getCourses() {
            vm.loadedSidebar = false;
            CourseService.getCourses().then(function (data) {
                let course = data.data.items.find(function(c) { return c.slug === vm.type; });
                $scope.course.widgets.sidebar = course.sidebar;
                $timeout(function() { vm.loadedSidebar = true; }, 1000);
            });
        }

        function _getCoursesRoutes() {
            vm.loadedSidebar = false;
            CourseService.getCourseRoute(vm.type, vm.courseId).then(function (data) {
                if (data.data.sidebar.length > 0) {
                    $scope.course.widgets.sidebar = data.data.sidebar;
                    $timeout(function() { vm.loadedSidebar = true; }, 1000);
                } else {
                    _getCourses();
                }
            });
        }

        function handleModule(column, idx) {
            let widgetSelected = $scope.course.widgets[column][idx];
            WidgetsService.openWidgetModal(widgetSelected)
                .then(function(data) {
                    _updateModule(data, column, idx);
                });
        }

        function _updateModule(data, column, idx) {
            if (typeof idx !== 'undefined') {
                $scope.course.widgets[column][idx] = data;
            } else {
                $scope.course.widgets[column].push(data);
            }
        }

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
                    NotificationService.success('sidebar do percurso salvo com sucesso!');
                    $location.path('course/list/' + vm.type);
                });
            } else {
                CourseService.updateCourses(vm.type, $scope.course.widgets.sidebar).then(function (dataUpdated) {
                    NotificationService.success('sidebar salva com sucesso!');
                    CourseService.updateCoursesLocal(vm.type, dataUpdated.data);
                    $location.path('course/list/' + vm.type);
                });
            }
        }
    }
})();
