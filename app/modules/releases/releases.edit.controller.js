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
    'ReleasesService',
    'MediaService',
    'NotificationService',
    'DateTimeHelper'
  ];

  function ReleasesEditController($scope,
                                  $timeout,
                                  $location,
                                  $routeParams,
                                  $filter,
                                  ReleasesService,
                                  MediaService,
                                  NotificationService,
                                  DateTimeHelper) {
    console.log('... ReleasesEditController');

    $scope.title = 'Editar Evento: ';
    $scope.breadcrumb = $scope.title;
    $scope.release = {};

    /**
     * Redactor config
     */
    $scope.redactorConfig = {
      lang: 'pt_br',
      replaceDivs: false,
      plugins: ['imagencrop'],
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
        ['img', ['src', 'alt']],
        ['figure', 'class'],
        ['a', ['href', 'title']]
      ]
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
          url: '',
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
        NotificationService.success('Release salvo com sucesso.');
        $location.path('/releases');
      });
    };

    ReleasesService.getRelease($routeParams.id).then(function (data) {
      var release = data.data;

      release.authorName = release.author_name;

      var date = new Date(release.service.when);

      release.service.when = {
        day: $filter('date')(date, 'dd'),
        month: $filter('date')(date, 'MM'),
        year: $filter('date')(date, 'yyyy')
      };

      var files = [];

      angular.forEach(release.files, function (file) {
        var fl = {
          external_url: file.external_url,
          file: ''
        };

        if (file.file !== null) {
          fl.file = file.file.url;
        }

        files.push(fl);
      });

      release.files = files;

      delete release.author;
      delete release.author_name;

      $scope.release = release;
      $scope.title = $scope.title + release.name;
      $scope.breadcrumb = $scope.title;
    });
  }
})();
