;(function(){
  'use strict';


  angular
    .module('featuredModule')
    .controller('featuredNewController', featuredNewController);

    featuredNewController.$inject = ['$scope',
                                    'ReleasesService',
                                    'MediaService',
                                    '$timeout'];

    function featuredNewController($scope, ReleasesService, MediaService, $timeout) {

      var vm = this; // jshint ignore:line
          vm.removeImage = _removeImage;
          vm.featured = {};
          vm.releases = {};

      // Cover Image - Upload
      $scope.$watch('vm.featured.image_upload', function () {
          _upload(vm.featured.image_upload);
      });

      ReleasesService.getReleases().then(function (data) {
        vm.releases = data.data;
      });

      /**
       * upload function
       * @param  {file} file
       */
      function _upload(file) {
        MediaService.newFile(file).then(function (data) {
          vm.featured.image_upload = {
            url: data.url,
            id: data.id
          };
        });
      };

      /**
       * remove image function
       */
      function _removeImage() {
        $timeout(function () {
          vm.featured.image_upload = '';
          $scope.$apply();
        });
      }



      // Specialists
      $scope.addSpecialist = function () {
        if (vm.featured.specialists) {
          vm.featured.specialists.push({
            name: '',
            phone: '',
            title_job: '',
            email: '',
            opened: true
          });
        } else {
          vm.featured.specialists.specialists = [];
          vm.featured.specialists.specialists.push({
            name: '',
            phone: '',
            title_job: '',
            email: '',
            opened: true
          });
        }
      };

      $scope.removeSpecialist = function (idx) {
        vm.featured.specialists.splice(idx, 1);
      };
    }
})();
