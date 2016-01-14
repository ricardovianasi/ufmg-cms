(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

  UploadComponentController.$inject = [
    '$scope',
    '$uibModalInstance',
    'MediaService',
    'tabsService',
    'formats'
  ];

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param MediaService
   * @param tabsService
   * @param formats
   *
   * @constructor
   */
  function UploadComponentController($scope, $uibModalInstance, MediaService, tabsService, formats) {
    var vm = this;

    vm.tabs = tabsService.getTabs();
    vm.selector = {};
    vm.formats = {};
    vm.add_photos = null;
    vm.image = null;
    vm.activeFormat = '';

    tabsService.selectTab('home');

    var availableFormats = {
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
      },
      pageCover: {
        name: 'Capa da Página',
        width: 1920,
        height: 444
      }
    };

    formats = formats || ['vertical', 'medium', 'big', 'wide'];

    angular.forEach(formats, function (item) {
      vm.formats[item] = availableFormats[item];
    });

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;
    vm.updateMidia = _updateMidia;
    vm.cancel = _cancel;
    vm.save = _save;
    vm.setFormat = _setFormat;

    // Set default format
    _setFormat(formats[0], false);

    /**
     * @param format
     * @param setCrop
     *
     * @private
     */
    function _setFormat(format, setCrop) {
      var obj = availableFormats[format];

      if (setCrop !== false) {
        vm.selector = angular.extend(vm.selector, {
          x1: 0,
          y1: 0,
          x2: obj.width,
          y2: obj.height
        });
      }
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

      MediaService.updateFile(vm.currentFile.id, obj).then(function () {
        tabsService.selectTab('crop');

        vm.tabs = tabsService.getTabs();
        vm.image = $('img', '#mrImageContainer')[0];
      });
    }

    /**
     * @private
     */
    function _cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    /**
     * @private
     */
    function _save() {
      var obj = {
        x: vm.selector.x1,
        y: vm.selector.y1,
        width: vm.selector.x2 - vm.selector.x1,
        height: vm.selector.y2 - vm.selector.y1,
        resize_width: availableFormats[vm.activeFormat].width,
        resize_height: availableFormats[vm.activeFormat].height
      };

      //Workaround for MrImage that does not provide these values
      if (vm.image.naturalWidth != vm.image.width) {
        obj.x = (vm.image.naturalWidth * vm.selector.x1) / vm.image.width;
        obj.y = (vm.image.naturalHeight * vm.selector.y1) / vm.image.height;
        obj.width = ((vm.image.naturalWidth * vm.selector.x2) / vm.image.width) - obj.x;
        obj.height = ((vm.image.naturalHeight * vm.selector.y2) / vm.image.height) - obj.y;
      }

      MediaService.cropImage(vm.currentFile.id, obj).then(function (data) {
        $uibModalInstance.close({
          type: vm.activeFormat,
          id: data.data.id,
          url: data.data.url,
          legend: vm.currentFile.legend,
          author: vm.currentFile.author.name
        });
      });
    }
  }
})();
