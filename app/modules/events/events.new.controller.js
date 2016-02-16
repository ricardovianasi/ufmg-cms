;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsNewController', EventsNewController);

  EventsNewController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    'CourseService',
    'EventsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  /**
   * @param $scope
   * @param $timeout
   * @param $location
   * @param CourseService
   * @param EventsService
   * @param MediaService
   * @param NotificationService
   * @param StatusService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function EventsNewController($scope,
                               $timeout,
                               $location,
                               CourseService,
                               EventsService,
                               MediaService,
                               NotificationService,
                               StatusService,
                               DateTimeHelper) {
    console.log('... EventsNewController');

    var vm = this;

    vm.title = 'Novo Evento';
    vm.breadcrumb = vm.title;
    vm.event = {
      status: StatusService.STATUS_PUBLISHED,
      courses: [],
      tags: []
    };
    vm.categories = [];
    vm.courses = [];

    /**
     * Controls event.courses array
     *
     * @param {number} courseId
     */
    vm.toggleSelection = function toggleSelection(courseId) {
      var idx = vm.event.courses.indexOf(courseId);

      if (idx > -1) {
        vm.event.courses.splice(idx, 1);
      } else {
        vm.event.courses.push(courseId);
      }
    };

    /**
     * Datepicker options
     */
    vm.datepickerOpt = {
      initDate: DateTimeHelper.getDatepickerOpt(),
      endDate: DateTimeHelper.getDatepickerOpt()
    };

    /**
     * Add status 'on the fly', according to requirements
     *
     * @type {{opened: boolean}}
     */
    vm.datepickerOpt.initDate.status = {
      opened: false
    };
    vm.datepickerOpt.endDate.status = {
      opened: false
    };

    /**
     * Timepicker options
     */
    vm.timepickerOpt = {
      initTime: DateTimeHelper.getTimepickerOpt(),
      endTime: DateTimeHelper.getTimepickerOpt()
    };

    vm.redactorOptions = {
      plugins: false,
    };

    // Watch IMG elements to upload
    $scope.$watch('vm.event.poster', function () {
      if (vm.event.poster && vm.event.poster instanceof File) {
        vm.imgHandler.upload('poster', [
          vm.event.poster
        ]);
      }
    });

    $scope.$watch('vm.event.photo', function () {
      if (vm.event.photo && vm.event.photo instanceof File) {
        vm.imgHandler.upload('photo', [
          vm.event.photo
        ]);
      }
    });

    /**
     * Handle img upload
     */
    vm.imgHandler = {
      upload: function (elem, files) {
        angular.forEach(files, function (file) {
          MediaService.newFile(file).then(function (data) {
            vm.event[elem] = {
              url: data.url,
              id: data.id
            };
          });
        });
      },
      removeImage: function (elem) {
        $timeout(function () {
          vm.event[elem] = '';
          $scope.$apply();
        });
      }
    };

    /**
     * Post to Event Endpoint
     *
     * @param data
     * @param preview
     */
    vm.publish = function (data, preview) {
      EventsService.store(data).then(function (event) {
        NotificationService.success('Evento criado com sucesso.');

        if (!preview) {
          $location.path('/events');
        } else {
          $window.open(event.data.event_url);
        }
      });
    };

    // Undergraduate Courses
    CourseService.getCourses('graduation').then(function (data) {
      vm.courses = data.data;
    });

    // Events Categories
    EventsService.getEventsCategories().then(function (data) {
      vm.categories = data.data;
    });

    // Statuses
    StatusService.getStatus().then(function (data) {
      vm.statuses = data.data;
    });
  }
})();
