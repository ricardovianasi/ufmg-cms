;(function(){
  'use strict';


  angular
    .module('featuredModule')
    .controller('featuredEditController', featuredEditController);

    featuredEditController.$inject = ['$scope',
                                    'ReleasesService',
                                    'MediaService',
                                    'featuredService',
                                    '$timeout',
                                    'NotificationService',
                                    '$location',
                                    '$routeParams'];

    function featuredEditController($scope, ReleasesService, MediaService, featuredService, $timeout, NotificationService, $location, $routeParams) {

      var vm = this; // jshint ignore:line
          vm.removeImage = _removeImage;
          vm.addSpecialist = _addSpecialist;
          vm.removeSpecialist = _removeSpecialist;
          vm.saveFeatured = _saveFeatured;
          vm.featured = {};
          vm.releases = {};
          var _updateFeatured = {};

        featuredService.getFeatured($routeParams.id).then(function(res){
          vm.featured = res.data;
        });

      // Cover Image - Upload
      $scope.$watch('vm.featured.photo', function () {
          _upload(vm.featured.photo);
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
          vm.featured.photo = {
            url: data.url,
            id: data.id
          };
        });
      }

      /**
       * remove image function
       */
      function _removeImage() {
        $timeout(function () {
          vm.featured.photo = '';
          $scope.$apply();
        });
      }

      /**
       *
       * add specialists function
       */
      function _addSpecialist () {
        if (vm.featured.specialists) {
          vm.featured.specialists.push({
            name: '',
            phone: '',
            office: '',
            email: '',
            opened: true
          });
        } else {
          vm.featured.specialists = [];
          vm.featured.specialists.push({
            name: '',
            phone: '',
            office: '',
            email: '',
            opened: true
          });
        }
      }

      /**
       * _removeSpecialist function
       * @param  {int} idx index specialist in array
       */
      function _removeSpecialist(idx) {
        vm.featured.specialists.splice(idx, 1);
      }

      /**
       * _saveFeatured function
       */
      function _saveFeatured(){
        _parseToSave();

        featuredService.update(vm.featured.id, _updateFeatured).then(function(res){
          NotificationService.success('Destaque alterado com sucesso!');
          $location.path('/featured');
        });
      }

      function _parseToSave(){
        _updateFeatured = {
          title: vm.featured.title,
          description: vm.featured.description,
          specialists: vm.featured.specialists,
          photo: vm.featured.photo.id,
          release: vm.featured.release.id
        };
      }
    }
})();
