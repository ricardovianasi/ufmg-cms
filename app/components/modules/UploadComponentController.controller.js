(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadComponentController', UploadComponentController);

  UploadComponentController.$inject = [
    'dataTableConfigService',
    '$scope',
    'MediaService'
  ];

  function UploadComponentController(dataTableConfigService, $scope, MediaService) {
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

    vm.openMidia = _openMidia;
    vm.changePage = _changePage;
    vm.selectMidia = _selectMidia;

    /**
     *  watch for vm.add_photos model
     *
     */
    $scope.$watch('vm.add_photos', function () {
      if (vm.add_photos) {
        MediaService.newFile(vm.add_photos).then(function (data) {
          vm.currentFile = {
            url: data.url,
            id: data.id,
            author: data.author.name,
            legend: data.legend
          };
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
    function _selectMidia(id, author, legend, url) {
      vm.currentFile = {
        url: url,
        id: id,
        author: author,
        legend: legend
      };
    }
  }
})();
