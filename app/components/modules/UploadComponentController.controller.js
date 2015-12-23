(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

  UploadComponentController.$inject = [
    '$scope',
    '$uibModalInstance',
    'dataTableConfigService',
    'MediaService',
    'tabsService'
  ];

  function UploadComponentController($scope, $uibModalInstance, dataTableConfigService, MediaService, tabsService) {
    var vm = this;

    vm.tabs = tabsService.getTabs();

    tabsService.selectTab('home');

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;
    vm.cancel = _cancel;

    var formats = {
      vertical: {
        name: 'Vertical',
        width: 352,
        height: 540,
        cropWidth: 276,
        cropHeight: 424
      },
      medium: {
        name: 'Médio',
        width: 712,
        height: 474,
        cropWidth: 568,
        cropHeight: 378
      },
      big: {
        name: 'Grande',
        width: 1192,
        height: 744,
        cropWidth: 568,
        cropHeight: 355
      },
      wide: {
        name: 'Widescreen',
        type: 'wide',
        width: 1920,
        height: 504,
        cropWidth: 568,
        cropHeight: 149
      }
    };

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
      tabsService.selectTab('midia');

      vm.tabs = tabsService.getTabs();

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
    function _updateMidia() {
      var obj = {
        title: vm.currentFile.title,
        description: vm.currentFile.description,
        altText: vm.currentFile.alt_text,
        legend: vm.currentFile.legend
      };

      MediaService.updateFile(vm.currentFile.id, obj).then(function () {
        tabsService.selectTab('crop');

        vm.tabs = tabsService.getTabs();
      });
    }

    /**
     *
     * @private
     */
    function _cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
