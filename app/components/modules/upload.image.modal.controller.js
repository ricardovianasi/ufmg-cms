(function () {
    'use strict';

    angular.module('componentsModule')
        .controller('UploadImageModalController', UploadImageModalController);

    /** ngInject */
    function UploadImageModalController(
        $log,
        $scope,
        $uibModalInstance,
        $timeout,
        Cropper,
        MediaService) {

        var data = {};
        var file = {};
        var position = {};
        var vm = $scope;

        vm.active_step = {};
        vm.cropper = {};
        vm.cropperProxy = 'cropper.first';
        vm.hideEvent = 'hide';
        vm.imageLink = '';
        vm.media = [];
        vm.selected_image = '';
        vm.showEvent = 'show';
        vm.steps = [];
        vm.upload_photo = null;

        vm.activeStep = _activeStep;
        vm.clear = _clear;
        vm.closeInsertImage = _closeInsertImage;
        vm.hideCropper = _hideCropper;
        vm.okInsertImage = _okInsertImage;
        vm.onFile = _onFile;
        vm.preview = _preview;
        vm.scale = _scale;
        vm.selectFormat = _selectFormat;
        vm.selectImage = _selectImage;
        vm.selectLibrary = _selectLibrary;
        vm.showCropper = _showCropper;

        function onInit() {
            _onEvents();
            vm.steps = [{
                step: 'Formato da Imagem',
                slug: 'format'
            }, {
                step: 'Selecione a Biblioteca',
                slug: 'selectlibrary'
            }, {
                step: 'Mídia',
                slug: 'media'
            }, {
                step: 'Publicação da Imagem',
                slug: 'published'
            }];

            vm.active_step = vm.steps[0];

            vm.formats = [{
                name: 'Vertical',
                type: 'vertical',
                size: '352x540',
                width: 352,
                height: 540,
                cropWidth: 276,
                cropHeight: 424
            }, {
                name: 'Horizontal',
                type: 'medium',
                size: '712x474',
                width: 712,
                height: 474,
                cropWidth: 568,
                cropHeight: 378
            }, {
                name: 'Grande',
                type: 'big',
                size: '1192x744',
                width: 1192,
                height: 744,
                cropWidth: 568,
                cropHeight: 355
            }, {
                name: 'Widescreen',
                type: 'wide',
                size: '1920x504',
                width: 1920,
                height: 504,
                cropWidth: 568,
                cropHeight: 149
            }];

            vm.libraries = [{
                name: 'Biblioteca de Imagens',
                type: 'medialibrary',
                enabled: true
            }, {
                name: 'ZUNI',
                type: 'zuni',
                enabled: false
            }];

            vm.selected_library = '';
            vm.options = {
                zoomable: true,
                maximize: true,
                cropBoxMovable: false,
                cropBoxResizable: false,
                dragCrop: false,
                crop: function (e, dataNew) {
                    data = dataNew;
                    position.x = e.x;
                    position.y = e.y;
                    position.width = e.width;
                    position.height = e.height;
                }
            };

            vm.form = {
                alt: '',
                description: ''
            };
        }

        onInit();

        function _onEvents() {
            vm.$watch('upload_photo', function () {
                if (vm.upload_photo) {
                    MediaService.newFile(vm.upload_photo).then(function (data) {
                        var obj = {};

                        obj.url = data.url;
                        obj.id = data.id;
                        vm.media.push(obj);
                        vm.selectImage(obj);
                    });
                }
            });

            vm.$on('cropme:done', function (ev, result, canvasEl) {
                $log.info(ev, result, canvasEl);
            });
        }

        function _hideCropper() {
            vm.dataUrl = '';
            vm.$broadcast(vm.hideEvent);
        }

        function _activeStep(idx) {
            vm.active_step = vm.steps[idx];
        }

        function _selectImage(image) {
            if (vm.selected_image !== image) {
                vm.selected_image = image;
            }
        }

        function _onFile(blob) {
            file = blob;
            angular.forEach([blob], function (file) {
                MediaService.newFile(file).then(function (data) {
                    vm.imageId = data.id;
                    Cropper.encode((file = blob)).then(function (dataUrl) {
                        vm.dataUrl = dataUrl;
                        $timeout(showCropper); // jshint ignore: line
                    });
                });
            });
        }

        function _preview() {
            if (!file || !data) {
                return;
            }

            Cropper.crop(file, data).then(Cropper.encode).then(function (dataUrl) {
                (vm.preview || (vm.preview = {})).dataUrl = dataUrl;
            });
        }

        function _clear() {
            if (!vm.cropper.first) {
                return;
            }
            vm.cropper.first('clear');
        }

        function _scale(width) {
            Cropper.crop(file, data)
                .then(function (blob) {
                    return Cropper.scale(blob, {
                        width: width
                    });
                })
                .then(Cropper.encode)
                .then(function (dataUrl) {
                    (vm.preview || (vm.preview = {})).dataUrl = dataUrl;
                });
        }

        function _selectLibrary(library) {
            vm.selected_library = library;
            vm.activeStep(2);
        }

        function _selectFormat(format) {
            vm.selectedFormat = format;

            var _ratio = 1 / (format.height / format.width);

            vm.options.aspectRatio = _ratio;
            vm.activeStep(1);

            if (!vm.cropper.first) {
                return;
            }

            vm.cropper.first('setAspectRatio', _ratio);
            vm.cropper.first('setCropBoxData', cropboxSize); // jshint ignore: line
        }

        function _showCropper() {
            vm.activeStep(3);
            vm.dataUrl = vm.selected_image.url;
            $timeout(function () {
                vm.$broadcast(vm.showEvent);
            });
        }

        function _okInsertImage(crop) {
            var obj = {
                x: position.x,
                y: position.y,
                width: position.width,
                height: position.height,
                resize_width: vm.selectedFormat.width,
                resize_height: vm.selectedFormat.height
            };

            if (!crop) {
                $uibModalInstance.close({
                    type: vm.selectedFormat.type,
                    url: vm.selected_image.url,
                    legend: vm.form.legend ? vm.form.legend : '',
                    author: vm.form.author ? vm.form.author : ''
                });
            } else {
                MediaService.cropImage(vm.selected_image.id, obj).then(function (data) {
                    $uibModalInstance.close({
                        type: vm.selectedFormat.type,
                        url: data.data.url,
                        legend: vm.form.legend ? vm.form.legend : '',
                        author: vm.form.author ? vm.form.author : ''
                    });
                });
            }
        }

        function _closeInsertImage() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();
