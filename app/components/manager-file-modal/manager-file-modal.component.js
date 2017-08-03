(function () {
    'use strict';

    angular
        .module('componentsModule')
        .component('managerFileModal', {
            templateUrl: 'components/manager-file-modal/manager-file-modal.html',
            controller: managerFileModalCtrl,
            controllerAs: 'vm'
        });

    /** ngInject */
    function managerFileModalCtrl($scope,
        MediaService,
        $q,
        ManagerFileService,
        Util,
        ModalService,
        NotificationService,
        $timeout) {

        var vm = $scope;
        var vmForFileWatch = this;
        var countPage = 1;
        var hasRequest = false;
        var pageSize = 12;
        var Formats = vm.$parent.formats;
        var imageTempToDelete;
        var formatSelected = Formats[0] || 'free';

        vm.selector = {};
        vm.formats = {};
        vm.whatStep = 'files';
        vm.currentFile = {};
        vm.availableFormats = {};
        vm.activeFormat = {};
        vm.aspectRatio = {};
        vm.files = {};
        vmForFileWatch.file = {};
        vm.currentElement = 0;
        vm.filterType = 'all';
        vm.fileNotFound = false;
        vm.EXTENSION = ManagerFileService.getExtension();

        vm.setFormat = _setFormat;
        vm.close = _close;
        vm.back = _back;
        vm.insert = _insert;
        vm.updateMidia = _updateMidia;
        vm.loadMoreImages = _loadMoreImages;
        vm.remove = _remove;
        vm.edit = _edit;
        vm.filterTo = _filterTo;
        vm.isDescriptionTitle = _isDescriptionTitle;

        onInit();

        function onInit() {
            onEvents();
            Util.setTypeParam(vm.filterType);
            _filterTo(vm.EXTENSION[0].files);
            vm.availableFormats = {
                free: {
                    name: 'Selecione a área',
                },
                logo: {
                    name: 'Logo',
                    width: 300,
                    height: 72
                },
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
            _setFormatAvailable();
        }

        function _close() {
            if (imageTempToDelete) {
                MediaService.removeMedia(imageTempToDelete.id);
            }
            vm.$parent.close();
        }

        function _back() {
            if (imageTempToDelete) {
                MediaService.removeMedia(imageTempToDelete.id)
                    .then(function () {
                        imageTempToDelete = null;
                    });
            }
            vm.whatStep = 'files';
        }

        function _setDefaultFormat() {
            $timeout(function () {
                if (Formats[0]) {
                    _setFormat(Formats[0]);
                }
            }, 300);
        }

        function _setFormatAvailable() {
            angular.forEach(Formats, function (item) {
                vm.formats[item] = vm.availableFormats[item];
            });
        }

        function onEvents() {
            vm.$watch('vm.file', function () {
                if (vmForFileWatch.file) {
                    watchFile();
                }
            });
        }

        function watchFile() {
            if (vm.whatStep === 'files') {
                MediaService
                    .newFile(vmForFileWatch.file)
                    .then(function (data) {
                        vm.currentFile = data;
                        vm.whatStep = 'pos';
                        imageTempToDelete = data;
                    });
            }
        }

        function _edit(file, forceEdit) {
            if (!file.url) {
                NotificationService.error('Erro ao editar imagem');
            }
            vm.currentFile = file;
            if ((!file.legend || file.legend === '') || !forceEdit) {
                vm.whatStep = 'pos';
            } else {
                verifyFile(file);
            }
        }

        function _insert() {
            var obj = {
                x: vm.selector.x1,
                y: vm.selector.y1,
                width: vm.selector.x2 - vm.selector.x1,
                height: vm.selector.y2 - vm.selector.y1,
                resize_width: vm.availableFormats[vm.activeFormat].width,
                resize_height: vm.availableFormats[vm.activeFormat].height
            };

            if (vm.imageOriginal.naturalWidth !== vm.imageOriginal.width) {
                obj.x = ((vm.imageOriginal.naturalWidth * vm.selector.x1) / vm.imageOriginal.width);
                obj.y = ((vm.imageOriginal.naturalHeight * vm.selector.y1) / vm.imageOriginal.height);
                obj.width = (((vm.imageOriginal.naturalWidth * vm.selector.x2) / vm.imageOriginal.width) - obj.x);
                obj.height = (((vm.imageOriginal.naturalHeight * vm.selector.y2) / vm.imageOriginal.height) - obj.y);
            }

            if (!vm.selector.x2 && !vm.selector.y2) {
                obj = {
                    x: 0,
                    y: 0,
                    width: vm.imageOriginal.naturalWidth,
                    height: vm.imageOriginal.naturalHeight,
                    resize_width: vm.imageOriginal.naturalWidth,
                    resize_height: vm.imageOriginal.naturalHeight
                };
            }

            MediaService
                .cropImage(vm.currentFile.id, obj)
                .then(function (res) {
                    res.data.type = formatSelected;
                    ManagerFileService.close(res.data);
                    vm.$parent.close();
                });
        }

        function _validate(variable) {
            return _.isEmpty(variable);
        }

        function _remove(event, id, index) {
            event.stopPropagation();
            ModalService
                .confirm('Excluir a imagem?', ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    MediaService.removeMedia(id).then(function () {
                        NotificationService.success('Arquivo removido com sucesso.');
                        vm.files.splice(index, 1);
                        if (vm.files.length < pageSize) {
                            _loadMoreImages();
                        }
                    });
                });
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

            MediaService
                .updateFile(vm.currentFile.id, obj)
                .then(function (res) {
                    verifyFile(res.data);
                });
        }

        function verifyFile(file) {
            if (vm.currentFile.type === 'png' || vm.currentFile.type === 'jpg') {
                editImage();
            } else {
                ManagerFileService.close(file);
                vm.$parent.close();
            }
        }

        function editImage() {
            _setDefaultFormat();
            $timeout(function () {
                vm.imageOriginal = $('img', '#mrImageContainer')[0];
            }, 300);
            vm.whatStep = 'edit';
        }

        function _setFormat(format, setCrop) {
            formatSelected = format;
            var obj = vm.availableFormats[format];
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

        function _loadMoreImages(search) {
            reset(vm.files);
            loadMore(search);
        }

        function _isDescriptionTitle(file) {
            return (
                file.title &&
                file.type !== 'jpg' &&
                file.type !== 'jpeg' &&
                file.type !== 'png'
            );
        }

        function _filterTo(type) {
            Util.setTypeParam(type);
            vm.filterType = type;
            countPage = 1;
            vm.currentElement = 0;
            vm.files = [];
            hasRequest = false;
            $timeout(function () {
                _loadMoreImages();
            });
        }

        function reset(data) {
            if (!data || angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function loadMore(search) {
            var searchQuery = 'legend';
            if (search || !hasRequest) {
                if (search || search === '') {
                    countPage = 1;
                    vm.files = [];
                } else {
                    if (countPage === 1) {
                        vm.files = [];
                    }
                    hasRequest = true;
                }
                var params = {
                    page: countPage,
                    page_size: pageSize,
                    order_by: {
                        field: 'createdAt',
                        direction: 'DESC'
                    },
                    isFiles: true,
                    search: search
                };
                if (!params.search && countPage === 1) {
                    vm.currentElement = 0;
                }
                MediaService
                    .getMedia(Util.getParams(params, searchQuery), true)
                    .then(function (res) {
                        countPage++;
                        vm.currentElement += res.data.items.length;
                        if (res.data.total > vm.currentElement && pageSize >= res.data.items.length) {
                            $timeout(function () {
                                hasRequest = false;
                            }, 200);
                        }
                        for (var index = 0; index < res.data.items.length; index++) {
                            vm.files.push(res.data.items[index]);
                        }
                        $timeout(function () {
                            if (vm.files.length === 0) {
                                vm.fileNotFound = true;
                            } else {
                                vm.fileNotFound = false;
                            }
                        }, 200);
                    });
            }
        }
    }
})();
