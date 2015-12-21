(function(){
  'use strict';

  angular
    .module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

    UploadComponentController.$inject = ['dataTableConfigService',
                                         '$scope',
                                         'MediaService'];

    function UploadComponentController(dataTableConfigService, $scope, MediaService){
      var vm = this;

      vm.tabs = {
        home: false,
        midia: false
      };

      vm.currentFile = {
        url: '',
        id: '',
        author: '',
        legend: ''
      };

      vm._openMidia = _openMidia;
      vm.changePage = _changePage;


      /**
      *  watch for vm.add_photos model
      *
      */
      $scope.$watch('vm.add_photos', function () {
        if (vm.add_photos) {
          MediaService.newFile(vm.add_photos).then(function (data) {
            console.log(data);
            vm.currentFile.url = data.url;
            vm.currentFile.id = data.id;
            vm.currentFile.author = data.author.name;
            vm.currentFile.legend = data.legend;
          });
        }
      });


      /**
      *  _openMidia Function
      * open tab media, and call _loadMidia function
      */
      function _openMidia(){
        vm.tabs.midia = true;
        _loadMidia();
      }

      /**
      *  _loadMidia Function
      * get all media
      */
      function _loadMidia(page){
        MediaService.getMedia(page, 27).then(function(result){
          vm.midia = result.data;
          console.log(vm.midia);
        });
      }

      /**
      *  _changePage Function
      *
      */
      function _changePage(){
        _loadMidia(vm.currentPage);
      }
    }
})();
