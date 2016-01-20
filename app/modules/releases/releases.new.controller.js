;(function () {
  'use strict';

  angular.module('releasesModule')
    .controller('ReleasesNewController', ReleasesNewController);

  ReleasesNewController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    '$filter',
    'ReleasesService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  function ReleasesNewController($scope,
                                 $timeout,
                                 $location,
                                 $filter,
                                 ReleasesService,
                                 MediaService,
                                 NotificationService,
                                 StatusService,
                                 DateTimeHelper) {
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
     * Handle img upload
     */
    $scope.imgHandler = {
      upload: function (elem, files) {
        angular.forEach(files, function (file) {
          MediaService.newFile(file).then(function (data) {
            $scope.release[elem] = {
              url: data.url,
              id: data.id
            };
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
       * @param {*} $e
       */
      addItem: function ($e) {
        $e.preventDefault();

        var idx = $scope.release.files.push({
          external_url: '',
          file: '',
          opened: true
        });
        idx = idx - 1;

        var watchee = $filter('format')('release.files[{0}].file', idx);

        $scope.$watch(watchee, function () {
          if ($scope.release.files[idx].file && $scope.release.files[idx].file instanceof File) {
            $scope.fileHandler.uploadFile(idx, [
              $scope.release.files[idx].file
            ]);
          }
        });
      },
      /**
       * @param {*} $e
       * @param {number} idx
       */
      removeItem: function ($e, idx) {
        $e.preventDefault();

        $scope.release.files.splice(idx, 1);
      },
      /**
       * @param {*} $e
       * @param {number} idx
       */
      saveItem: function ($e, idx) {
        $e.preventDefault();

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

    /**
     * Post to Event Endpoint
     *
     * @param data
     */
    $scope.publish = function (data) {
      ReleasesService.store(data).then(function () {
        NotificationService.success('Release criado com sucesso.');
        $location.path('/releases');
      });
    };
  }
})();
