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
        $rootScope,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('CourseController');

        var vm = this;

        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId;
        vm.course = {};

        vm.removeImage = _removeImage;
        vm.uploadCover = _uploadCover;

        onInit();

        function onInit() {
            if (vm.courseId) {
                CourseService
                    .getCourseRoutes(vm.type, vm.courseId)
                    .then(function (data) {
                        vm.courses = data.data;

                        angular.forEach(vm.courses.items, function (value, key) {
                            vm[key].name = value.subdivision_name ? value.subdivision_name : value.name;
                        }, vm.courses.items);

                        vm.dtOptions = dataTableConfigService.init();
                    });

                CourseService
                    .getCourseRoute(vm.type, vm.courseId)
                    .then(function (data) {
                        vm.course = {
                            id: data.data.id,
                            name: data.data.name
                        };

                        if (data.data.cover) {
                            vm.course.cover_url = data.data.cover.url;
                            vm.course.cover = data.data.cover.id;
                        }

                        if (vm.course.cover) {
                            vm.showCover = true;
                        }
                    });
            } else {
                $log.info('Load');
                CourseService
                    .getCourses(vm.type)
                    .then(function (res) {
                        vm.courses = res.data;
                        vm.dtOptions = dataTableConfigService.init();
                    });
            }
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
                    vm.course.cover_url = data.url;

                    _uploadCourseCover();
                });
        }

        function _removeImage() {
            vm.course.cover = '';
            vm.course.cover_url = '';
            vm.showCover = false;

            _uploadCourseCover();
        }

        function _uploadCourseCover() {
            CourseService.uploadCourseCover(vm.type, vm.courseId, vm.course.cover).then(function () {
                NotificationService.success('Capa atualizada com sucesso!');
            });
        }
    }
})();
