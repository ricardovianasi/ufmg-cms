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
        $log) {
        $rootScope.shownavbar = true;
        $log.info('CourseController');

        var vm = this;

        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId || false;
        vm.course = {};


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
                CourseService
                    .getCourses(vm.type)
                    .then(function (res) {
                        vm.courses = res.data;
                        vm.dtOptions = dataTableConfigService.init();
                        _permissions();
                    });
            }
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
