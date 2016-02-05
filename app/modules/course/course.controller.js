;(function () {
  'use strict';

  angular.module('courseModule')
    .controller('CourseController', CourseController);

  CourseController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    'CourseService',
    'dataTableConfigService',
    'NotificationService',
    'MediaService'
  ];

  function CourseController($scope,
                            $modal,
                            $routeParams,
                            CourseService,
                            dataTableConfigService,
                            NotificationService,
                            MediaService) {
    console.log('... CourseController');
    var vm = this;
        vm.type = $routeParams.type;
        vm.courseId = $routeParams.courseId;
        vm.course = {};
        vm.removeImage = _removeImage;

    if(vm.courseId) {
      CourseService.getCourseRoutes(vm.type, vm.courseId).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
      });

      CourseService.getCourse(vm.type, vm.courseId).then(function (data) {
        if(data.data.cover) {
          vm.course.cover_url = data.data.cover.url;
          vm.course.cover = data.data.cover.id;
        }

        if(vm.course.cover)
          vm.showCover = true;
      });
    } else {
      CourseService.getCourses(vm.type).then(function (data) {
        vm.courses = data.data;
        vm.dtOptions = dataTableConfigService.init();
      });
    }


    $scope.$watch('vm.course_cover', function () {
      if (vm.course_cover) {
        _upload([vm.course_cover]);
      }
    });

    /**
     *
     * @param files
     * @private
     */
    function _upload(files) {
      angular.forEach(files, function (file) {
        var obj = {
          title: file.title ? file.title : '',
          description: file.description ? file.description : '',
          altText: file.alt_text ? file.alt_text : '',
          legend: file.legend ? file.legend : ''
        };

        MediaService.newFile(file).then(function (data) {
          vm.course.cover = data.id;
          vm.course.cover_url = data.url;
          _uploadCourseCover();
        });
      });
    }

      /**
       *
       * @private
       */
    function _removeImage() {
      vm.course.cover = '';
      vm.course.cover_url = '';
      vm.showCover = false;
      _uploadCourseCover();
    }

      /**
       *
       * @private
       */
    function _uploadCourseCover(){
      CourseService.uploadCourseCover(vm.type, vm.courseId, vm.course.cover).then(function(data){
        NotificationService.success('Capa atualizada com sucesso!');
      });
    }
  }
})();
