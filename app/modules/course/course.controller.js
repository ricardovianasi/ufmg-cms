;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$routeParams',
    'CourseService',
    'dataTableConfigService',
    'NotificationService',
    'ModalService',
    '$rootScope'
  ];

  /**
   * @param $routeParams
   * @param CourseService
   * @param dataTableConfigService
   * @param NotificationService
   * @param ModalService
   *
   * @constructor
   */
  function CourseController($routeParams,
                            CourseService,
                            dataTableConfigService,
                            NotificationService,
                            ModalService,
                            $rootScope) {
    $rootScope.shownavbar = true;
    console.log('... CourseController');

    var vm = this;

    vm.type = $routeParams.type;
    vm.courseId = $routeParams.courseId;
    vm.course = {};

    vm.removeImage = _removeImage;
    vm.uploadCover = _uploadCover;

    if (vm.courseId) {
      CourseService.getCourseRoutes(vm.type, vm.courseId).then(function (data) {
        vm.courses = data.data;

        angular.forEach(vm.courses.items, function (value, key) {
          this[key].name = value.subdivision_name ? value.subdivision_name : value.name;
        }, vm.courses.items);

        vm.dtOptions = dataTableConfigService.init();
      });

      CourseService.getCourseRoute(vm.type, vm.courseId).then(function (data) {
        vm.course = {
          id: data.data.id,
          name: data.data.name
        };

        if (data.data.cover) {
          vm.course.cover_url = data.data.cover.url;
          vm.course.cover = data.data.cover.id;
        }

        if (vm.course.cover)
          vm.showCover = true;
      });
    } else {
      CourseService.getCourses(vm.type).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
      });
    }

    /**
     * @private
     */
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

    /**
     * @private
     */
    function _removeImage() {
      vm.course.cover = '';
      vm.course.cover_url = '';
      vm.showCover = false;

      _uploadCourseCover();
    }

    /**
     * @private
     */
    function _uploadCourseCover() {
      CourseService.uploadCourseCover(vm.type, vm.courseId, vm.course.cover).then(function () {
        NotificationService.success('Capa atualizada com sucesso!');
      });
    }
  }
})();
