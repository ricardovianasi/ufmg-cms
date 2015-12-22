(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

  UploadComponentController.$inject = [
    'dataTableConfigService',
    '$scope',
    'MediaService',
    'tabsService'
  ];

  function UploadComponentController(dataTableConfigService, $scope, MediaService, tabsService) {
    var vm = this;

    vm.tabs = tabsService.getTabs();

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;

    /**
     *  watch for vm.add_photos model
     *
     */
    $scope.$watch('vm.add_photos', function () {
      if (vm.add_photos) {
        MediaService.newFile(vm.add_photos).then(function (data) {
          vm.currentFile = data;
          _loadMidia();
        });
      }
    });

    /**
     *  _openMidia Function
     * open tab media, and call _loadMidia function
     */
    function _openMidia() {
      vm.tabs.midia = true;
      _loadMidia();
    }

    /**
     *  _loadMidia Function
     * get all media
     */
    function _loadMidia(page) {
      MediaService.getMedia(page, 27).then(function (result) {
        vm.midia = result.data;
      });
    }

    /**
     *  _changePage Function
     *
     */
    function _changePage() {
      _loadMidia(vm.currentPage);
    }

    /**
     *  _selectMidia Function
     *
     */

    function _selectMidia(data) {
      vm.currentFile = data;
    }

    /**
     * function _updateMidia
     */
    function _updateMidia(){

      var obj = {
        title: vm.currentFile.title,
        description: vm.currentFile.description,
        altText: vm.currentFile.alt_text,
        legend: vm.currentFile.legend
      };

      MediaService.updateFile(vm.currentFile.id, obj).then(function(result){
        console.log(result);
      });
    }
  }
})();
