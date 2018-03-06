(function () {
    'use strict';

    angular.module('courseModule')
        .controller('CourseSidebarController', CourseSidebarController);

    /** ngInject */
    function CourseSidebarController($scope, $routeParams, WidgetsService, ModalService, CourseService,
        NotificationService, $rootScope, $location, HandleChangeService) {
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

        HandleChangeService.registerHandleChange('/course', ['PUT'], $scope,
            ['course.widgets.sidebar'], _evenedUpSideBar, _hasLoaded);

        if (typeof vm.courseId !== 'undefined') {
            _getCoursesRoutes();
        } else {
            _getCourses();
        }

        function _hasLoaded(oldValue) {
            return oldValue.length > 0 || !vm.courseId;
        }

        function _evenedUpSideBar(sidebar) {
            return sidebar.map(function(widget) {
                delete widget.content;
                delete widget.links;
                return widget;
            });
        }

        function _getCourses() {
            CourseService.getCourses().then(function (data) {
                let course = data.data.items.find(function(c) { return c.slug === vm.type; });
                $scope.course.widgets.sidebar = course.sidebar;
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
                    NotificationService.success('sidebar do percurso salva com sucesso!');
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
