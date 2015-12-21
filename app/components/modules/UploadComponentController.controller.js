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

      vm._openMidia = _openMidia;


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
      function _loadMidia(){
        MediaService.getMedia().then(function(result){
          vm.midia = result.data;
          console.log(vm.midia);
        });
      }
    }
})();
