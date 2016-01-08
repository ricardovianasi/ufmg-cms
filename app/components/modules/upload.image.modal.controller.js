;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('UploadImageModalController', UploadImageModalController);

  UploadImageModalController.$inject = [
    '$scope',
    '$uibModalInstance',
    '$timeout',
    'Cropper'
  ];

  function UploadImageModalController($scope, $uibModalInstance, $timeout, Cropper) {
    $scope.upload_photo = null;
    $scope.imageLink = '';

    var file, data;

    $scope.media = [];

    $scope.steps = [
      {
        step: 'Formato da Imagem',
        slug: 'format'
      },
      {
        step: 'Selecione a Biblioteca',
        slug: 'selectlibrary'
      },
      {
        step: 'Mídia',
        slug: 'media'
      },
      {
        step: 'Publicação da Imagem',
        slug: 'publish'
      }
    ];

    $scope.active_step = $scope.steps[0];

    $scope.activeStep = function (idx) {
      $scope.active_step = $scope.steps[idx];
    };

    $scope.selected_image = '';

    $scope.selectImage = function (image) {
      if ($scope.selected_image != image) {
        $scope.selected_image = image;
      }
    };

    $scope.onFile = function (blob) {
      file = blob;
      angular.forEach([blob], function (file) {
        MediaService.newFile(file).then(function (data) {
          $scope.imageId = data.id;
          Cropper.encode((file = blob)).then(function (dataUrl) {
            $scope.dataUrl = dataUrl;
            $timeout(showCropper);  // wait for $digest to set image's src
          });
        });
      });
    };

    $scope.cropper = {};
    $scope.cropperProxy = 'cropper.first';

    $scope.preview = function () {
      if (!file || !data) {
        return;
      }

      Cropper.crop(file, data).then(Cropper.encode).then(function (dataUrl) {
        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
      });
    };

    $scope.clear = function (degrees) {
      if (!$scope.cropper.first) {
        return;
      }

      $scope.cropper.first('clear');
    };

    $scope.scale = function (width) {
      Cropper.crop(file, data)
        .then(function (blob) {
          return Cropper.scale(blob, {width: width});
        })
        .then(Cropper.encode)
        .then(function (dataUrl) {
          ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
        });
    };

    var position = {};

    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';

    $scope.hideCropper = function () {
      $scope.dataUrl = '';
      $scope.$broadcast($scope.hideEvent);
    };

    $scope.formats = [
      {
        name: 'Vertical',
        type: 'vertical',
        size: '352x540',
        width: 352,
        height: 540,
        cropWidth: 276,
        cropHeight: 424
      },
      {
        name: 'Médio',
        type: 'medium',
        size: '712x474',
        width: 712,
        height: 474,
        cropWidth: 568,
        cropHeight: 378
      },
      {
        name: 'Grande',
        type: 'big',
        size: '1192x744',
        width: 1192,
        height: 744,
        cropWidth: 568,
        cropHeight: 355
      },
      {
        name: 'Widescreen',
        type: 'wide',
        size: '1920x504',
        width: 1920,
        height: 504,
        cropWidth: 568,
        cropHeight: 149
      }
    ];

    $scope.libraries = [
      {
        name: 'Biblioteca de Imagens',
        type: 'medialibrary',
        enabled: true
      },
      {
        name: 'ZUNI',
        type: 'zuni',
        enabled: false
      }
    ];

    $scope.selected_library = '';

    $scope.selectLibrary = function (library) {
      $scope.selected_library = library;
      $scope.activeStep(2);
    };

    $scope.options = {
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

    $scope.selectFormat = function (format) {
      $scope.selectedFormat = format;

      var _ratio = 1 / (format.height / format.width);

      $scope.options.aspectRatio = _ratio;
      $scope.activeStep(1);

      if (!$scope.cropper.first) {
        return;
      }

      $scope.cropper.first('setAspectRatio', _ratio);
      $scope.cropper.first('setCropBoxData', cropboxSize);
    };

    $scope.form = {
      alt: '',
      description: ''
    };

    $scope.showCropper = function () {
      $scope.activeStep(3);
      $scope.dataUrl = $scope.selected_image.url;
      $timeout(function () {
        $scope.$broadcast($scope.showEvent);
      });
    };

    $scope.$watch('upload_photo', function () {
      if ($scope.upload_photo) {
        MediaService.newFile($scope.upload_photo).then(function (data) {
          var obj = {};

          obj.url = data.url;
          obj.id = data.id;
          $scope.media.push(obj);
          $scope.selectImage(obj);
        });
      }
    });

    $scope.okInsertImage = function (crop) {
      var obj = {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        resize_width: $scope.selectedFormat.width,
        resize_height: $scope.selectedFormat.height
      };

      if (!crop) {
        $uibModalInstance.close({
          type: $scope.selectedFormat.type,
          url: $scope.selected_image.url,
          legend: $scope.form.legend ? $scope.form.legend : '',
          author: $scope.form.author ? $scope.form.author : ''
        });
      } else {
        MediaService.cropImage($scope.selected_image.id, obj).then(function (data) {
          $uibModalInstance.close({
            type: $scope.selectedFormat.type,
            url: data.data.url,
            legend: $scope.form.legend ? $scope.form.legend : '',
            author: $scope.form.author ? $scope.form.author : ''
          });
        });
      }
    };

    $scope.closeInsertImage = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.$on("cropme:done", function (ev, result, canvasEl) {
      clog(ev, result, canvasEl);
    });
  }
})();
