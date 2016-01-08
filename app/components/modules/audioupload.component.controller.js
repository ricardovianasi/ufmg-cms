(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('AudioUploadComponentController', AudioUploadComponentController);

  AudioUploadComponentController.$inject = [
    '$scope',
    '$uibModalInstance',
    'lodash',
    'MediaService',
    'tabsService',
    'formats'
  ];

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param _
   * @param MediaService
   * @param tabsService
   * @param formats
   *
   * @constructor
   */
  function AudioUploadComponentController($scope, $uibModalInstance, _, MediaService, tabsService, formats) {
    var vm = this;

    vm.tabs = tabsService.getTabs();

    tabsService.selectTab('midia');


    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;
    vm.cancel = _cancel;
    vm.activeFormat = '';

    _loadMidia();
    /**
     *  watch for vm.add_photos model
     *
     */
    $scope.$watch('vm.add_audio', function () {
      if (vm.add_audio) {
        MediaService.newFile(vm.add_audio).then(function (data) {
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
      tabsService.selectTab('midia');

      vm.tabs = tabsService.getTabs();

      _loadMidia();
    }

    /**
     *  _loadMidia Function
     * get all media
     */
    function _loadMidia(page) {
      MediaService.getMedia(page, 27, 'type=mp3').then(function (result) {
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
     * _selectMidia Function
     *
     * @param data
     * @private
     */
    function _selectMidia(data) {
      vm.currentFile = data;
    }

    /**
     * function _updateMidia
     *
     * @private
     */
    function _updateMidia() {
      var obj = {
        title: vm.currentFile.title,
        description: vm.currentFile.description,
        altText: vm.currentFile.alt_text,
        legend: vm.currentFile.legend
      };

      MediaService.updateFile(vm.currentFile.id, obj).then(function (data) {
        $uibModalInstance.close({
          type: vm.activeFormat,
          url: data.data.url,
          legend: vm.currentFile.legend,
          author: vm.currentFile.author.name
        });
      });
    }

    /**
     * @private
     */
    function _cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
