;(function () {
  'use strict';

  angular.module('releasesModule')
    .controller('ReleasesEditController', ReleasesEditController);

  ReleasesEditController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    '$routeParams',
    '$filter',
    '$uibModal',
    '$window',
    'ReleasesService',
    'MediaService',
    'NotificationService',
    'DateTimeHelper',
    '$rootScope',
    'validationService'
  ];

  /**
   * @param $scope
   * @param $timeout
   * @param $location
   * @param $routeParams
   * @param $filter
   * @param $uibModal
   * @param $window
   * @param ReleasesService
   * @param MediaService
   * @param NotificationService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function ReleasesEditController($scope,
                                  $timeout,
                                  $location,
                                  $routeParams,
                                  $filter,
                                  $uibModal,
                                  $window,
                                  ReleasesService,
                                  MediaService,
                                  NotificationService,
                                  DateTimeHelper,
                                  $rootScope,
                                  validationService) {
    $rootScope.shownavbar = true;
    console.log('... ReleasesEditController');

    $scope.title = 'Editar Release: ';
    $scope.breadcrumb = $scope.title;
    $scope.release = {};

    // Time and Date
    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = DateTimeHelper.yearRange(5);
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    /**
     * Redactor config
     */
    $scope.redactorOptions = {
      plugins: false,
    };

    $scope.$watch('release.thumb', function () {
      if ($scope.release.thumb && $scope.release.thumb instanceof File) {
        $scope.imgHandler.upload('thumb', [
          $scope.release.thumb
        ]);
      }
    });

    $scope.removeReleasesFiles = function (idx) {
      $scope.release.files[idx].file = '';
    };

    /**
     * _addWatcher function
     * @param {int} idx
     */
    var _addWatcher = function (idx) {
      var watchee = $filter('format')('release.files[{0}].file', idx);

      $scope.$watch(watchee, function () {
        if ($scope.release.files[idx] && $scope.release.files[idx].file instanceof File) {
          $scope.release.files[idx].external_url = '';
          $scope.fileHandler.uploadFile(idx, [
            $scope.release.files[idx].file
          ]);
        }
      });
    };

    /**
     * Handle img upload
     */
    $scope.imgHandler = {
      upload: function (elem, files) {
        angular.forEach(files, function (file) {
          MediaService.newFile(file).then(function (data) {
            var x = 0;
            var y = 0;
            var width = data.width;
            var height = data.height;

            if (data.width != data.height) {
              x = (data.width / 2) - (256 / 2);
              y = (data.height / 2) - (256 / 2);
              width = 256;
              height = 256;
            }

            var obj = {
              x: x,
              y: y,
              width: width,
              height: height,
              resize_width: 256,
              resize_height: 256,
            };

            MediaService.cropImage(data.id, obj).then(function (data) {
              var resp = data.data;

              $scope.release[elem] = {
                url: resp.url,
                id: resp.id
              };
            });
          });
        });
      },
      removeImage: function (elem) {
        $timeout(function () {
          $scope.release[elem] = '';
          $scope.$apply();
        });
      }
    };

    /**
     * File Handler
     *
     * @type {{add: $scope.fileHandler.add, remove: $scope.fileHandler.remove, save: $scope.fileHandler.save}}
     */
    $scope.fileHandler = {
      /**
       *
       */
      addItem: function () {
        var idx = $scope.release.files.push({
          url: '',
          file: '',
          opened: true,
          isFile: true
        });
        idx = idx - 1;

        _addWatcher(idx);
      },
      /**
       * @param {number} idx
       */
      removeItem: function (idx) {
        if ($scope.release.files[idx].external_url !== '' || $scope.release.files[idx].file !== '') {
          confirmationModal('md', 'Você deseja excluir este arquivo?');

          removeConfirmationModal.result.then(function () {
            $scope.release.files.splice(idx, 1);
          });

          return;
        }

        $scope.release.files.splice(idx, 1);
      },
      /**
       * @param {number} idx
       */
      saveItem: function (idx) {
        $scope.release.files[idx].opened = false;
      },
      /**
       * @param idx
       * @param files
       */
      uploadFile: function (idx, files) {
        angular.forEach(files, function (file) {
          MediaService.newFile(file).then(function (data) {
            $scope.release.files[idx].file = data.url;
            $scope.release.files[idx].id = data.id;
          });
        });
      },
      /**
       * @param idx
       */
      removeFile: function (idx) {
        $timeout(function () {
          delete $scope.release.files[idx].id;

          $scope.release.files[idx].file = '';
          $scope.$apply();
        });
      }
    };

    var removeConfirmationModal;

    /**
     * @param size
     * @param title
     */
    var confirmationModal = function (size, title) {
      removeConfirmationModal = $uibModal.open({
        templateUrl: 'components/modal/confirmation.modal.template.html',
        controller: ConfirmationModalCtrl,
        backdrop: 'static',
        size: size,
        resolve: {
          title: function () {
            return title;
          }
        }
      });
    };

    /**
     * @param $scope
     * @param $uibModalInstance
     * @param title
     *
     * @constructor
     */
    var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
      $scope.modal_title = title;

      $scope.ok = function () {
        $uibModalInstance.close();
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    /**
     * Post to Event Endpoint
     *
     * @param data
     * @param preview
     */
    $scope.publish = function (data, preview) {
      if(!validationService.isValid($scope.formRelease.$invalid))
        return false;

      ReleasesService.update(data, $routeParams.id).then(function (release) {
        NotificationService.success('Release salvo com sucesso.');

        if (!preview) {
          $location.path('/releases');
        } else {
          $window.open(release.data.release_url);
        }
      });
    };

    $scope.remove = function () {
      confirmationModal('md', 'Você deseja excluir este release?');

      removeConfirmationModal.result.then(function () {
        ReleasesService.destroy($routeParams.id).then(function () {
          NotificationService.success('Release removido com sucesso.');
          $location.path('/releases');
        });
      });
    };

    ReleasesService.getRelease($routeParams.id).then(function (data) {
      var release = data.data;
      release.authorName = release.author_name;

      var files = [];

      angular.forEach(release.files, function (file) {
        var fl = {
          external_url: file.external_url,
          file: '',
          isFile: false,
          type: 'video',
          title: file.title
        };

        if (file.file !== null) {
          fl.id = file.file.id;
          fl.file = file.file.url;
          fl.isFile = true;
          fl.type = file.file.type;
        }

        files.push(fl);
      });

      release.files = files;

      delete release.author;
      delete release.author_name;

      release.scheduled_date = moment(data.data.post_date, "YYYY-DD-MM").format('DD/MM/YYYY');
      release.scheduled_time = moment(data.data.post_date, "YYYY-DD-MM hh:mm").format('hh:mm');

      $scope.release = release;
      $scope.title = $scope.title + release.name;
      $scope.breadcrumb = $scope.title;

      angular.forEach('$scope.release.files', function (value, key) {
        _addWatcher(key);
      });

    });
  }

})();
