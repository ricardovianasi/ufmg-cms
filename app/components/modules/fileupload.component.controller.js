(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('FileUploadComponentController', FileUploadComponentController);

    /** ngInject */
    function FileUploadComponentController($scope, $uibModalInstance, $log, MediaService, tabsService) {
        var vm = this;
        $log.info('FileUploadComponentController');

        vm.tabs = tabsService.getTabs();
        vm.activeFormat = '';

        tabsService.selectTab('midia');

        vm.openMidia = _openMidia;
        vm.changePage = _changePage;
        vm.selectMidia = _selectMidia;
        vm.updateMidia = _updateMidia;
        vm.cancel = _cancel;

        _loadMidia();

        $scope.$watch('vm.add_audio', function () {
            if (vm.add_audio) {
                MediaService.newFile(vm.add_audio).then(function (data) {
                    vm.currentFile = data;
                    vm.currentFile.isIcon = false;
                    vm.currentFile.isList = true;
                    _loadMidia();
                });
            }
        });

        function _openMidia() {
            tabsService.selectTab('midia');

            vm.tabs = tabsService.getTabs();

            _loadMidia();
        }

        function _loadMidia(page) {
            var types = "types=doc,docx,xls,xlsx,ppt,pptx,pps,ppsx,ai,psd,zip,rar,7z,pdf";
            MediaService.getMedia(page, 35, types).then(function (result) {
                vm.midia = result.data;
            });
        }

        function _changePage() {
            _loadMidia(vm.currentPage);
        }

        function _selectMidia(data) {
            vm.currentFile = data;
            vm.currentFile.isIcon = false;
            vm.currentFile.isList = true;

        }

        function _updateMidia() {
            var obj = {
                title: vm.currentFile.title,
                description: vm.currentFile.description,
                altText: vm.currentFile.alt_text,
                legend: vm.currentFile.legend
            };

            MediaService.updateFile(vm.currentFile.id, obj).then(function (data) {
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

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
