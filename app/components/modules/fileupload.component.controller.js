(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('FileUploadComponentController', FileUploadComponentController);

  FileUploadComponentController.$inject = [
    '$scope',
    '$uibModalInstance',
    'lodash',
    'MediaService',
    'tabsService'
  ];

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param _
   * @param MediaService
   * @param tabsService
   *
   * @constructor
   */
  function FileUploadComponentController($scope, $uibModalInstance, _, MediaService, tabsService) {
    var vm = this;

    vm.tabs = tabsService.getTabs();
    vm.activeFormat = '';

    tabsService.selectTab('midia');

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;
    vm.cancel = _cancel;

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
      var types = "types=doc,docx,xls,xlsx,ppt,pptx,pps,ppsx,ai,psd,zip,rar,7z,pdf";
      MediaService.getMedia(page, 35, types).then(function (result) {
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
        console.log('vai >>>>>>>>>>>>', data);
        $uibModalInstance.close({
          type: data.data.type,
          url: data.data.url,
          legend: vm.currentFile.legend,
          author: vm.currentFile.author.name,
          title: data.data.title,
          isList: vm.currentFile.isList,
          isIcon: vm.currentFile.isIcon
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
