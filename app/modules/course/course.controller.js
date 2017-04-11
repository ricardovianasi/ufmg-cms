(function () {
    'use strict';

    angular.module('courseModule')
        .controller('CourseController', CourseController);

    /** ngInject */
    function CourseController($routeParams,
        CourseService,
        dataTableConfigService,
        NotificationService,
        ModalService,
        permission,
        $rootScope,
        $location,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('CourseController');

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
                        vm.course.detail ? vm.course.detail : vm.course.detail = {};
                        _permissions();
                    });
            } else {
                _renderDataTable();
            }
        }

        function _renderDataTable() {
            var numberOfColumns = 2;
            var columnsHasNotOrder = [1];
            dataTableConfigService.setColumnsHasOrderAndSearch([{
                index: 0,
                name: 'name'
            }]);

            function getCourses(params, fnCallback) {
                CourseService
                    .getCourses(vm.type, false, dataTableConfigService.getParams(params))
                    .then(function (res) {
                        vm.dtColumns = dataTableConfigService.columnBuilder(numberOfColumns, columnsHasNotOrder);
                        _permissions();
                        vm.courses = res.data;
                        var records = {
                            'draw': params.draw,
                            'recordsTotal': res.data.total,
                            'data': [],
                            'recordsFiltered': res.data.total
                        };
                        fnCallback(records);
                         
                    });
            }
            vm.dtOptions = dataTableConfigService.dtOptionsBuilder(getCourses);
        }

        function _save(redirect) {
            CourseService
                .updateTypeCourse(vm.type, vm.courseId, {
                    cover: vm.course.cover,
                    description: vm.course.detail.description
                })
                .then(function (res) {
                    if (redirect) {
                        $location.path('/course/list/' + vm.type);
                    }
                });
        }

        function _permissions() {
            vm.canPermission = permission;
        }

        function _uploadCover() {
            var resolve = {
                formats: function () {
                    return ['pageCover'];
                }
            };
            ModalService.uploadImage(resolve)
                .result
                .then(function (data) {
                    vm.course.cover = data.id;
                    vm.course.detail.cover = {};
                    vm.course.detail.cover.url = data.url;
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
