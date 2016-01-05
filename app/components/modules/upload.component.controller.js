(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

  UploadComponentController.$inject = [
    '$scope',
    '$uibModalInstance',
    'MediaService',
    'tabsService'
  ];

  function UploadComponentController($scope, $uibModalInstance, MediaService, tabsService) {
    var vm = this;

    vm.tabs = tabsService.getTabs();

    tabsService.selectTab('home');

    vm.selector = {
      //x1: 0,
      //x2: 0,
      //y1: 0,
      //y2: 0
    };
    vm.formats = {
      vertical: {
        name: 'Vertical',
        width: 352,
        height: 540
      },
      medium: {
        name: 'Médio',
        width: 712,
        height: 474
      },
      big: {
        name: 'Grande',
        width: 1192,
        height: 744
      },
      wide: {
        name: 'Widescreen',
        width: 1920,
        height: 504
      }
    };

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;
    vm.cancel = _cancel;
    vm.save = _save;
    vm.setFormat = _setFormat;
    vm.activeFormat = '';

    // Set default format
    _setFormat('medium');

    /**
     * @param format
     *
     * @private
     */
    function _setFormat(format) {
      var obj = vm.formats[format];

      vm.selector = angular.extend(vm.selector, {
        x1: 0,
        y1: 0,
        x2: obj.width,
        y2: obj.height
      });
      vm.activeFormat = format;
      vm.aspectRatio = 1 / (obj.height / obj.width);
    }

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

    /**
     *
     * @private
     */
    function _save() {
      console.log(vm.selector);

      var obj = {
        x: vm.selector.x1,
        y: vm.selector.y1,
        width: vm.selector.x2,
        height: vm.selector.y2,
        resize_width: vm.formats[vm.activeFormat].width,
        resize_height: vm.formats[vm.activeFormat].height
      };

      MediaService.cropImage(vm.currentFile.id, obj).then(function (data) {
        $uibModalInstance.close({
          type: vm.activeFormat,
          url: data.data.url,
          legend: vm.currentFile.legend,
          author: vm.currentFile.author.name
        });
      });
    }
  }
})();
