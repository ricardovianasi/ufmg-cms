(function () {
    'use strict';

    angular.module('courseModule')
        .controller('CourseController', CourseController);

    /** ngInject */
    function CourseController($routeParams,
        CourseService,
        dataTableConfigService,
        PermissionService,
        $location,
        ManagerFileService) {

        var vm = this;

        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId || false;
        vm.course = {};
        vm.dtInstance = {};


        vm.removeImage = _removeImage;
        vm.uploadCover = _uploadCover;
        vm.save = _save;

        onInit();

        function onInit() {
            if (angular.isUndefined(vm.type)) {
                $location.path('/course');
                return;
            }
            if (vm.courseId) {
                CourseService
                    .getCourseRoutes(vm.type, vm.courseId)
                    .then(function (res) {
                        vm.courses = res.data;
                    });

                CourseService
                    .getCourseRoute(vm.type, vm.courseId)
                    .then(function (res) {
                        vm.course = res.data;
                        if (!vm.course.detail) {
                            vm.course.detail = {};
                        }
                    });
            } else {
                _renderDataTable();
            }
        }

        function _setPermissionEditBar() {
            let previlege = PermissionService.getPrivilege('course_'+vm.type, 'PUT');
            vm.canEditSideBar = (previlege && previlege.posts === null) || PermissionService.isAdministrator();
        }

        function _renderDataTable() {
            var numberOfColumns = 2;
            var columnsHasNotOrder = [1];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'name'
            }]);

            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getCourses);
            vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);

            function getCourses(params, fnCallback) {
                CourseService
                    .getCourses(vm.type, false, dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.courses = res.data;
                        _setPermissionEditBar();
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);

                    });
            }
        }

        function _save(redirect) {
            CourseService
                .updateTypeCourse(vm.type, vm.courseId, {
                    cover: vm.course.cover,
                    description: vm.course.detail.description
                })
                .then(function () {
                    if (redirect) {
                        $location.path('/course/list/' + vm.type);
                    }
                });
        }

        function _uploadCover() {
            ManagerFileService.imageFiles();
            ManagerFileService
                .open('pageCover')
                .then(function (image) {
                    vm.course.cover = image.id;
                    vm.course.detail.cover = {};
                    vm.course.detail.cover.url = image.url;
                    _save();
                });
        }

        function _removeImage() {
            vm.course.cover = '';
            delete vm.course.detail.cover.url;
            _save();
        }
    }
})();
