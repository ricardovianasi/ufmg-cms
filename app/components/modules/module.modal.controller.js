;(function(){
  'use strict';

  angular
    .module('componentsModule')
    .controller('ModuleModalController', ModuleModalController);

    function ModuleModalController($scope,
                                   $modal,
                                   $filter,
                                   $timeout,
                                   MediaService,
                                   ModuleService,
                                   $modalInstance,
                                   module,
                                   widgets,
                                   extraContent) {

    $scope.widgets = widgets;
    $scope.galleries = extraContent.galleries;
    $scope.categories = extraContent.categories;
    $scope.news_types = extraContent.news_types;
    $scope.tags = extraContent.tags[0];
    $scope.news = extraContent.news;
    $scope.pages = extraContent.pages;
    $scope.events = extraContent.events;
    $scope.icons = extraContent.icons;

    $scope.widget = {
      selected: {},
      type: '',
      title: ''
    };

    $scope.$watch('widget.selected', function () {
      $scope.widget.type = $scope.widget.selected.type;
    });

    if (module) {
      $scope.module = angular.copy(module);
      $scope.widget.id = module.id;
      $scope.widget.type = module.type;
      $scope.widget.title = module.title;
      $scope.widget.selected.type = module.type;

      angular.extend($scope.widget, ModuleService.parseWidgetToLoad($scope.module));
    }

    var moduleModal;

    $scope.addLink = function () {
      if ($scope.widget.links) {
        $scope.widget.links.push({
          label: '',
          page: '',
          external_url: ''
        });
      } else {
        $scope.widget.links = [];
        $scope.widget.links.push({
          label: '',
          external_url: ''
        });
      }
    };

    $scope.addGallery = function (gal) {
      if ($scope.widget.galleries) {
        $scope.widget.galleries.push(gal);
      } else {
        $scope.widget.galleries = [];
        $scope.widget.galleries.push(gal);
      }
    };

    $scope.removeGallery = function (idx) {
      if ($scope.widget.galleries[idx]) {
        $scope.widget.galleries.splice(idx, 1);
      }
    };

    $scope.removeNews = function (idx) {
      if ($scope.widget.news[idx]) {
        $scope.widget.news.splice(idx, 1);
      }
    };

    $scope.removeLink = function (idx) {
      $scope.widget.links.splice(idx, 1);
    };

    var UploadImageModalCtrl = function ($scope, $modalInstance, $timeout, $sce, Cropper) {
      $scope.upload_photo = null;
      $scope.imageLink = '';

      var file, data;

      $scope.media = extraContent.media;

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
          $modalInstance.close({
            type: $scope.selectedFormat.type,
            url: $scope.selected_image.url,
            legend: $scope.form.legend ? $scope.form.legend : '',
            author: $scope.form.author ? $scope.form.author : ''
          });
        } else {
          MediaService.cropImage($scope.selected_image.id, obj).then(function (data) {
            $modalInstance.close({
              type: $scope.selectedFormat.type,
              url: data.data.url,
              legend: $scope.form.legend ? $scope.form.legend : '',
              author: $scope.form.author ? $scope.form.author : ''
            });
          });
        }
      };

      $scope.closeInsertImage = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.$on("cropme:done", function (ev, result, canvasEl) {
        console.log(ev, result, canvasEl);
      });
    };

    jQuery.Redactor.prototype.imagencrop = function () {
      return {
        init: function () {
          var button = this.button.add('imagencrop', 'Image-N-Crop');

          this.button.addCallback(button, this.imagencrop.show);
          this.button.setAwesome('imagencrop', 'fa-picture-o');
        },
        showEdit: function ($image) {
          console.log('show edit', $image);
        },
        show: function () {
          var _this = this;

          _this.selection.save();
          moduleModal = $modal.open({
            templateUrl: '/views/upload-images.modal.template.html',
            controller: UploadImageModalCtrl,
            backdrop: 'static',
            size: 'lg'
          });

          moduleModal.result.then(function (data) {
            var cropped = {
              vertical: function (data) {
                var html = '&nbsp;<figure class="vertical"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              medium: function (data) {
                var html = '&nbsp;<figure class="medium"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              big: function (data) {
                var html = '&nbsp;<section class="snippet snippet--big"><figure class="big"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure></section><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              },
              wide: function (data) {
                var html = '&nbsp;<section class="snippet snippet--wide"><figure class="wide"><img src="' + data.url + '" title="' + data.author + '" alt="' + data.legend + '"><figcaption>' + data.legend + '</figcaption></figure></section><br><p></p>';
                _this.selection.restore();
                _this.insert.htmlWithoutClean(html);
              }
            };

            var croppedObj = {
              url: data.url,
              legend: data.legend ? data.legend : '',
              author: data.author ? data.author : ''
            };

            if (data.type == 'vertical') {
              cropped.vertical(croppedObj);
            } else if (data.type == 'medium') {
              cropped.medium(croppedObj);
            } else if (data.type == 'big') {
              cropped.big(croppedObj);
            } else if (data.type == 'wide') {
              cropped.wide(croppedObj);
            }
          });
        }
      };
    };

    $scope.redactorConfig = {
      lang: 'pt_br',
      replaceDivs: false,
      plugins: ['imagencrop'],
      paragraphize: false,
      linebreaks: false,
      formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5'],
      buttons: [
        'html',
        'formatting',
        'bold',
        'italic',
        'deleted',
        'unorderedlist',
        'orderedlist',
        'outdent',
        'indent',
        'image',
        'file',
        'link',
        'alignment',
        'horizontalrule',
        'imagencrop'
      ],
      allowedAttr: [
        ['section', 'class'],
        ['div', 'class'],
        ['img', ['src', 'alt', 'title']],
        ['figure', 'class'],
        ['a', ['href', 'title']]
      ]
    };

    $scope.ok = function () {
      var _obj = {
        id: $scope.widget.id || null,
        title: $scope.widget.title || null,
        type: $scope.widget.type
      };

      angular.extend(_obj, $scope.widget);

      console.log('>>> ok', _obj);

      $modalInstance.close(_obj);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.preparePartial = function () {
      ModuleService.preparePartial($scope);
    };
  };
})();
