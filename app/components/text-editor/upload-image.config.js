;(function(){
  'use strict';

  angular.module('componentsModule')
    .config([
      '$routeProvider',
      '$locationProvider',
      '$provide',
      function ($routeProvider, $locationProvider, $provide) {
        $provide.decorator('taOptions', [
          'taRegisterTool',
          '$delegate',
          'MediaService',
          '$modal',
          function (taRegisterTool, taOptions, MediaService, $modal) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('insertImage', {
              iconclass: 'fa fa-picture-o',
              tooltiptext: 'oir',
              action: function ($scope, $timeout) {
                var _this = this;
                var UploadImageModalCtrl = function ($scope, $uibModalInstance, $timeout, $sce, Cropper) {
                  $scope.add_photos = null;
                  $scope.imageLink = '';

                  var file;
                  var data;

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
                      .then(Cropper.encode).then(function (dataUrl) {
                        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
                      });
                  };

                  var position = {};

                  $scope.showEvent = 'show';
                  $scope.hideEvent = 'hide';

                  function showCropper() {
                    $scope.$broadcast($scope.showEvent);
                  }

                  function hideCropper() {
                    $scope.$broadcast($scope.hideEvent);
                  }

                  $scope.formats = [
                    {
                      name: 'Vertical (esquerda)',
                      size: '352x540',
                      width: 352,
                      height: 540
                    },
                    {
                      name: 'Vertical (direita)',
                      size: '352x540',
                      width: 352,
                      height: 540

                    },
                    {
                      name: 'Médio',
                      size: '712x474',
                      width: 712,
                      height: 474
                    },
                    {
                      name: 'Grande',
                      size: '1192x744',
                      width: 1192,
                      height: 744
                    },
                    {
                      name: 'Widescreen',
                      size: '1920x504',
                      width: 1920,
                      height: 504
                    }
                  ];

                  $scope.selectedFormat = $scope.formats[0];

                  $scope.selectFormat = function (format) {
                    $scope.selectedFormat = format;

                    var _ratio = 1 / (format.height / format.width);

                    if (!$scope.cropper.first) {
                      return;
                    }

                    $scope.cropper.first('setAspectRatio', _ratio);
                  };

                  $scope.options = {
                    maximize: true,
                    aspectRatio: 1 / ($scope.selectedFormat.height / $scope.selectedFormat.width),
                    zoomable: false,
                    crop: function (e, dataNew) {
                      data = dataNew;
                      position.x = e.x;
                      position.y = e.y;
                      position.width = e.width;
                      position.height = e.height;
                    }
                  };

                  $scope.upload = function (files) {
                    angular.forEach(files, function (file) {
                      MediaService.newFile(file);
                    });
                  };

                  $scope.$watch('add_photos', function () {
                    if ($scope.add_photos) {
                      $scope.upload([$scope.add_photos]);
                    }
                  });

                  $scope.okInsertImage = function () {
                    var obj = {
                      x: position.x,
                      y: position.y,
                      width: position.width,
                      height: position.height
                    };

                    MediaService.cropImage($scope.imageId, obj).then(function (data) {
                      $uibModalInstance.close(data.data.url);
                    });
                  };
                  $scope.closeInsertImage = function () {
                    $uibModalInstance.dismiss('cancel');
                  };

                  $scope.$on("cropme:done", function (ev, result, canvasEl) {
                    console.log(ev, result, canvasEl);
                  });
                };

                var moduleModal = $modal.open({
                  templateUrl: '/components/modal/upload-images.modal.template.html',
                  controller: UploadImageModalCtrl,
                  backdrop: 'static',
                  size: 'lg'
                });

                var insertImageLink = function (url) {
                  setTimeout(function () {
                    _this.$editor().wrapSelection('insertImage', url, true);
                    $scope.apply();
                  }, 0);
                };

                moduleModal.result.then(function (data) {
                  _this.$editor().wrapSelection('insertImage', data, true);
                  _this.$editor().wrapSelection('insertImage', data, true);
                });
              }
            });

            // add the button to the default toolbar definition
            // taOptions.toolbar[1].push('insertImage');
            return taOptions;
          }
        ]);
      }
    ]);
})();
