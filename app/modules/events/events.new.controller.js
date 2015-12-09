;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsNewController', EventsNewController);

  EventsNewController.$inject = [
    '$scope',
    '$modal',
    '$timeout',
    '$location',
    'CourseService',
    'EventsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  function EventsNewController($scope,
                               $modal,
                               $timeout,
                               $location,
                               CourseService,
                               EventsService,
                               MediaService,
                               NotificationService,
                               StatusService,
                               DateTimeHelper) {
    console.log('... EventsNewController');

    $scope.title = 'Novo Evento';
    $scope.breadcrumb = $scope.title;
    $scope.event = {
      status: StatusService.STATUS_PUBLISHED,
      courses: [],
      tags: []
    };
    $scope.categories = [];
    $scope.courses = [];

    /**
     * Controls event.courses array
     *
     * @param {integer} courseId
     */
    $scope.toggleSelection = function toggleSelection(courseId) {
      var idx = $scope.event.courses.indexOf(courseId);

      if (idx > -1) {
        $scope.event.courses.splice(idx, 1);
      } else {
        $scope.event.courses.push(courseId);
      }
    };

    /**
     * Datepicker options
     */
    $scope.datepickerOpt = {
      initDate: DateTimeHelper.getDatepickerOpt(),
      endDate: DateTimeHelper.getDatepickerOpt()
    };

    /**
     * Add status 'on the fly', according to requirements
     *
     * @type {{opened: boolean}}
     */
    $scope.datepickerOpt.initDate.status = {
      opened: false
    };
    $scope.datepickerOpt.endDate.status = {
      opened: false
    };

    /**
     * Timepicker options
     */
    $scope.timepickerOpt = {
      initTime: DateTimeHelper.getTimepickerOpt(),
      endTime: DateTimeHelper.getTimepickerOpt()
    };

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

    // Watch IMG elements to upload
    $scope.$watch('event.poster', function () {
      if ($scope.event.poster && $scope.event.poster instanceof File) {
        $scope.imgHandler.upload('poster', [
          $scope.event.poster
        ]);
      }
    });
    $scope.$watch('event.photo', function () {
      if ($scope.event.photo && $scope.event.photo instanceof File) {
        $scope.imgHandler.upload('photo', [
          $scope.event.photo
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
            $scope.event[elem] = {
              url: data.url,
              id: data.id
            };
          });
        });
      },
      removeImage: function (elem) {
        $timeout(function () {
          $scope.event[elem] = '';
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
      EventsService.store(data).then(function () {
        NotificationService.success('Evento criado com sucesso.');
        $location.path('/events');
      });
    };

    // Undergraduate Courses
    CourseService.getCourses().then(function (data) {
      $scope.courses = data.data;
    });

    // Events Categories
    EventsService.getEventsCategories().then(function (data) {
      $scope.categories = data.data;
    });

    // Statuses
    StatusService.getStatus().then(function (data) {
      $scope.statuses = data.data;
    });
  }
})();
