;(function () {
  'use strict';

  angular.module('releasesModule')
    .controller('ReleasesNewController', ReleasesNewController);

  ReleasesNewController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    '$filter',
    '$uibModal',
    '$window',
    'ReleasesService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper',
    '$rootScope'
  ];

  function ReleasesNewController($scope,
                                 $timeout,
                                 $location,
                                 $filter,
                                 $uibModal,
                                 $window,
                                 ReleasesService,
                                 MediaService,
                                 NotificationService,
                                 StatusService,
                                 DateTimeHelper,
                                 $rootScope) {
    $rootScope.shownavbar = true;
    console.log('... ReleasesNewController');

    $scope.title = 'Novo Release';
    $scope.breadcrumb = $scope.title;
    $scope.release = {
      status: StatusService.STATUS_PUBLISHED,
      source: {},
      service: {
        when: {}
      },
      files: []
    };

    /**
     * Redactor config
     */
    $scope.redactorOptions = {
      plugins: false,
    };

    // Time and Date
    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = ['2015', '2016', '2017'];
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    $scope.$watch('release.thumb', function () {
      if ($scope.release.thumb && $scope.release.thumb instanceof File) {
        $scope.imgHandler.upload('thumb', [
          $scope.release.thumb
        ]);
      }
    });

    /**
     * _addWatcher function
     * @param {int} idx
     */
    var _addWatcher = function(idx){

     var watchee = $filter('format')('release.files[{0}].file', idx);

      $scope.$watch(watchee, function () {
      if ($scope.release.files[idx].file && $scope.release.files[idx].file instanceof File) {
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
          external_url: '',
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
      ReleasesService.store(data).then(function (release) {
        NotificationService.success('Release criado com sucesso.');

        if (!preview) {
          $location.path('/releases');
        } else {
          $window.open(release.data.release_url);
        }
      });
    };
  }
})();
