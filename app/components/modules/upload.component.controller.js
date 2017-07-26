(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('UploadComponentController', UploadComponentController);

    /** ngInject */
    function UploadComponentController($scope,
        $uibModalInstance,
        $timeout,
        MediaService,
        tabsService,
        Util,
        formats,
        NotificationService,
        $log) {

        var vm = this;
        var availableFormats = {};
        var countPage = 0;

        vm.activeFormat = '';
        vm.add_photos = null;
        vm.formats = {};
        vm.image = null;
        vm.midia = [];
        vm.selector = {};
        vm.tabs = tabsService.getTabs();
        vm.zoomOut = false;

        vm.cancel = _cancel;
        vm.cancelUpdateMidia = _cancelUpdateMidia;
        vm.changePage = _changePage;
        vm.openMidia = _openMidia;
        vm.save = _save;
        vm.searchMidia = _searchMidia;
        vm.selectMidia = _selectMidia;
        vm.setFormat = _setFormat;
        vm.updateMidia = _updateMidia;

        onInit();

        function onInit() {
            $log.info('UploadComponentController');
            countPage = 0;
            availableFormats = {
                vertical: {
                    name: 'Vertical',
                    width: 352,
                    height: 540
                },
                medium: {
                    name: 'Horizontal',
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
                },
                digitalizedCover: {
                    name: 'Capa Digitalizada',
                    width: 350,
                    height: 498
                },
                bigPageCover: {
                    name: 'Capa da publicação',
                    width: 1920,
                    height: 720
                },
                galleryImage: {
                    name: 'Imagem de galeria',
                    width: 952,
                    height: 600
                }
            };

            formats = formats || ['vertical', 'medium', 'big', 'wide'];
            _setFormatAvailable();
            tabsService.selectTab('home');

            $scope.$watch('vm.add_photos', function () {
                if (vm.add_photos) {
                    MediaService.newFile(vm.add_photos).then(function (data) {
                        vm.currentFile = data;
                        _loadMidia();
                    });
                }
            });
        }

        function _setFormatAvailable() {
            angular.forEach(formats, function (item) {
                vm.formats[item] = availableFormats[item];
            });
        }

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

        function _openMidia() {
            tabsService.selectTab('midia');

            vm.tabs = tabsService.getTabs();

            _loadMidia();
        }

        function _searchMidia(inputSearch) {
            _loadMidia(inputSearch);
        }

        function _loadMidia(inputSearch) {
            // var types = 'types=png,jpg,jpeg';
            var params = {
                page: countPage,
                page_size: 10,
                order_by: {
                    field: 'postDate',
                    direction: 'ASC'
                },
                search: inputSearch
            };
            if (!params.search && countPage === 1) {
                vm.currentElement = 0;
            }
            MediaService
                .getMedia(Util.getParams(params))
                .then(function (result) {
                    countPage++;
                    vm.currentElement += result.data.items.length;
                    vm.midia = Object.assign(vm.midia, result.data);
                });
        }

        function _changePage() {
            _loadMidia(vm.currentPage);
        }

        function _selectMidia(data) {
            vm.zoomOut = false;
            vm.currentFile = data;

            // Set default format
            $timeout(function () {
                _setFormat(formats[0]);
            }, 500);
        }

        function _updateMidia() {
            if (_validate(vm.currentFile.legend)) {
                NotificationService.info('Legenda deve ser inserida obrigatoriamente.');

                return false;
            }

            var obj = {
                title: vm.currentFile.title,
                description: vm.currentFile.description,
                altText: vm.currentFile.alt_text,
                legend: vm.currentFile.legend,
                author_name: vm.currentFile.author_name
            };

            MediaService.updateFile(vm.currentFile.id, obj).then(function () {
                tabsService.selectTab('crop');
                vm.tabs = tabsService.getTabs();
                vm.image = $('img', '#mrImageContainer')[0];

                $timeout(function () {
                    $('.btn-click').trigger('click');
                });
            });
        }

        function _cancelUpdateMidia() {
            vm.zoomOut = true;
        }

        function _cancel() {
            $uibModalInstance.dismiss('cancel');
        }

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
            if (vm.image.naturalWidth !== vm.image.width) {
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
                    author: vm.currentFile.author_name
                });
            });
        }

        function _validate(variable) {
            return _.isEmpty(variable);
        }
    }
})();
