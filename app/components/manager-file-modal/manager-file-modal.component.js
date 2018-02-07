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
        $window,
        ModalService,
        NotificationService,
        $timeout) {

        var vm = $scope;
        var vmForFileWatch = this; // jshint ignore: line
        var countPage = 1;
        var hasRequest = false;
        var pageSize = 20;
        var Formats = vm.$parent.formats;
        var imageTempToDelete;
        var formatSelected = Formats[0] || 'free';

        vm.title = vm.$parent.title;
        vm.selector = {};
        vm.formats = {};
        vm.whatStep = 'files';
        vm.currentFile = {};
        vm.availableFormats = {};
        vm.activeFormat = {};
        vm.aspectRatio = {};
        vm.files = {};
        vmForFileWatch.file = false;
        vm.currentElement = 0;
        vm.filterType = 'all';
        vm.fileNotFound = false;
        vm.EXTENSION = ManagerFileService.getExtension();
        vm.dzMethods = {};
        vm.loadingImageEdit = false;
        vm.imageOriginal = null;
        vm.imageMaxWidth = 380;

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
        vm.dzCallbacks = _dzCallbacks();
        vm.dzOptions = _dzOptions();
        vm.waitTofile = _waitTofile;
        vm.filterType = vm.EXTENSION[0].files;

        onInit();

        function onInit() {
            _filterTo(vm.EXTENSION[0].files);
            vm.availableFormats = {
                free: {
                    name: 'Editar',
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
            _crossBrowser();
            _getCancelDialogUpload();
        }

        function _getCancelDialogUpload() {
            var dialogs = [];
            $timeout(function () {
                $('.dz-hidden-input').each(function (index, element) {
                    element.onclick = function () {
                        $window.document.body.onfocus = focusDialogUpload;
                    };
                    dialogs.push(element);
                });
            });

            function focusDialogUpload() {
                dialogs.forEach(function (element) {
                    if (element.value === '') {
                        vm.waterTofile = false;
                    }
                });
            }
        }

        function _waitTofile() {
            vm.waterTofile = true;
            _getCancelDialogUpload();
        }

        function _crossBrowser() {
            var browser = Util.detectBrowser();
            if (browser === 'safari') {
                $timeout(function () {
                    $('.manager-file-modal-container').css('height', '80vh');
                }, 300);
            }
        }

        function _getAcceptedFiles() {
            var acceptedFiles = '';
            for (var index = 0; index < vm.EXTENSION.length; index += 1) {
                var element = vm.EXTENSION[index];
                if (element.files !== 'all') {
                    acceptedFiles += ',.' + element.files.split(',').join(',.');
                }
            }
            return acceptedFiles;
        }

        function _dzOptions() {
            return {
                url: '/',
                acceptedFiles: _getAcceptedFiles(),
                method: 'files',
                maxFiles: '1',
                dictDefaultMessage: '<button class="btn btn-secondary btn-lg">' +
                    '<i class="fa fa-cloud-upload"></i> Enviar Arquivos' +
                    '</button><br /> Arraste e solte o arquivo aqui para enviar',
                dictResponseError: 'Erro ao enviar arquivo!',
            };
        }

        function _isValidFile(file) {
            var currentExtension = file.type.split('/')[1];
            for (var j = 0; j < vm.EXTENSION.length; j += 1) {
                var extensions = vm.EXTENSION[j].files;
                if (extensions === 'all') {
                    return true;
                }
                extensions = extensions.split(',');
                for (var index = 0; index < extensions.length; index += 1) {
                    if (currentExtension === extensions[index]) {
                        return true;
                    }
                }
            }
            return false;
        }

        function _dzCallbacks() {
            return {
                addedfile: function (file) {
                    if (file.type && _isValidFile(file)) {
                        _addMidia(file);
                    } else {
                        vm.waterTofile = false;
                        NotificationService.error('Arquivo inválido!', vm.title);
                        vm.dzMethods.removeAllFiles();
                    }
                }
            };
        }

        function _addMidia(file) {
            if (vm.whatStep === 'files') {
                MediaService
                    .newFile(file)
                    .then(function (data) {
                        vm.currentFile = data;
                        vm.whatStep = 'pos';
                        imageTempToDelete = data;
                        vm.waterTofile = false;
                    })
                    .catch(function () {
                        vm.waterTofile = false;
                        NotificationService.error('Erro ao enviar arquivo.');
                        vm.dzMethods.removeAllFiles();
                    });
            }
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

        function waitLoadImage() {
            var defer = $q.defer();
            vm.imageOriginal = null;

            function recursiveGetImage() {
                $timeout(function () {
                    vm.imageOriginal = $('img#mrImageContainer')[0];
                    if (vm.imageOriginal) {
                        vm.loadingImageEdit = true;
                        defer.resolve();
                        return;
                    }
                    recursiveGetImage();
                }, 100);
            }

            recursiveGetImage();
            return defer.promise;
        }

        function radioSizeImage() {
            var radio = vm.imageOriginal.naturalHeight / vm.imageOriginal.naturalWidth;
            if (radio < 1) {
                vm.imageMaxWidth = 600;
            } else {
                vm.imageMaxWidth = 380;
            }
        }

        function _setDefaultFormat() {
            radioSizeImage();
            if (Formats[0] && Formats[0] !== 'free') {
                $timeout(function () {
                    _setFormat(Formats[0]);
                }, 400);
            }
        }

        function _setFormatAvailable() {
            angular.forEach(Formats, function (item) {
                vm.formats[item] = vm.availableFormats[item];
            });
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
                height: vm.selector.y2 - vm.selector.y1
            };
            if (angular.isUndefined(vm.availableFormats[vm.activeFormat])) {
                obj.resize_width = vm.imageOriginal.naturalWidth;
                obj.resize_height = vm.imageOriginal.naturalHeight;
            } else {
                obj.resize_width = vm.availableFormats[vm.activeFormat].width;
                obj.resize_height = vm.availableFormats[vm.activeFormat].height;
            }

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
            if (!(vm.currentFile.type === 'png' || vm.currentFile.type === 'jpg' || vm.currentFile.type === 'jpeg')) {
                if (_validate(vm.currentFile.title)) {
                    NotificationService.info('Título deve ser inserida obrigatoriamente.');
                    return false;
                }
            } else {
                if (_validate(vm.currentFile.legend)) {
                    NotificationService.info('Legenda deve ser inserida obrigatoriamente.');
                    return false;
                }
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
            if (vm.currentFile.type === 'png' || vm.currentFile.type === 'jpg' || vm.currentFile.type === 'jpeg') {
                editImage();
            } else {
                ManagerFileService.close(file);
                vm.$parent.close();
            }
        }

        function editImage() {
            vm.whatStep = 'edit';
            vm.imageMaxWidth = null;
            waitLoadImage()
                .then(function () {
                    _setDefaultFormat();
                });
        }

        function _fullImageEdit() {
            vm.selector = angular.extend(vm.selector, {
                x1: 0,
                y1: 0,
                x2: vm.imageOriginal.naturalWidth,
                y2: vm.imageOriginal.naturalHeight
            });
            vm.aspectRatio = 1 / (vm.imageOriginal.naturalHeight / vm.imageOriginal.naturalWidth);
        }

        function _setFormat(format, setCrop) {
            vm.activeFormat = format;
            if (format === 'free') {
                _fullImageEdit();
            } else {
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
                vm.aspectRatio = 1 / (obj.height / obj.width);
            }
            vm.imageOriginal = $('img', '#mrImageContainerEdit')[0];
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
                Util.setTypeParam(vm.filterType);
                MediaService
                    .getMedia(Util.getParams(params, searchQuery), true)
                    .then(function (res) {
                        let lengthItems = res.data.items ? res.data.items.length : 0;
                        countPage++;
                        vm.currentElement += lengthItems;
                        if (res.data.total > vm.currentElement && pageSize >= lengthItems) {
                            $timeout(function () {
                                hasRequest = false;
                            }, 200);
                        }
                        for (var index = 0; index < lengthItems; index++) {
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
