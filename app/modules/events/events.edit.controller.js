;(function () {
  'use strict';

  angular.module('eventsModule')
    .controller('EventsEditController', EventsEditController);

  EventsEditController.$inject = [
    '$scope',
    '$timeout',
    '$location',
    '$routeParams',
    '$window',
    'CourseService',
    'EventsService',
    'MediaService',
    'NotificationService',
    'StatusService',
    'ModalService',
    'DateTimeHelper',
    '$rootScope',
    'TagsService'
  ];

  /**
   * @param $scope
   * @param $timeout
   * @param $location
   * @param $routeParams
   * @param $window
   * @param CourseService
   * @param EventsService
   * @param MediaService
   * @param NotificationService
   * @param StatusService
   * @param ModalService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function EventsEditController($scope,
                                $timeout,
                                $location,
                                $routeParams,
                                $window,
                                CourseService,
                                EventsService,
                                MediaService,
                                NotificationService,
                                StatusService,
                                ModalService,
                                DateTimeHelper,
                                $rootScope,
                                TagsService) {
    $rootScope.shownavbar = true;
    console.log('... EventsEditController');

    var allTags = [];

    var vm = this;

    vm.title = 'Editar Evento: ';
    vm.breadcrumb = vm.title;
    vm.event = {
      courses: [],
      tags: []
    };
    vm.categories = [];
    vm.courses = [];

    /**
     * Controls event.courses array
     *
     * @param {integer} courseId
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

    $scope.$watch('event.photo', function () {
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
      /**
       * @param elem
       * @param files
       */
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
      /**
       *
       */
      uploadPhoto: function () {
        var resolve = {
          formats: function () {
            return ['medium'];
          }
        };

        ModalService
          .uploadImage(resolve)
          .result
          .then(function (data) {
            vm.event.photo = {
              url: data.url,
              id: data.id
            };
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
      _parseTime(data);

      console.log(data);

      EventsService.update(data, $routeParams.id).then(function (event) {
        NotificationService.success('Evento atualizado com sucesso.');

        if (!preview) {
          $location.path('/events');
        } else {
          $window.open(event.data.event_url);
        }
      });
    };

    /**
     *
     */
    vm.remove = function () {
      ModalService
        .confirm('Você deseja excluir o evento <b>' + vm.event.name + '</b>?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          EventsService.destroy($routeParams.id).then(function () {
            NotificationService.success('Evento removido com sucesso.');
            $location.path('/events');
          });
        });
    };

    EventsService.getEvent($routeParams.id).then(function (data) {
      console.log(data);

      var event = data.data;
      var tags = event.tags;
      var courses = event.courses;

      event.courses = [];
      event.tags = [];
      event.initDate = new Date(event.init_date);
      event.endDate = new Date(event.end_date);

      event.init_hour = new Date("October 13, 2014 " + event.init_hour);
      event.end_hour = new Date("October 13, 2014 " + event.end_hour);


      delete event.init_date;
      delete event.end_date;

      angular.forEach(courses, function (course) {
        event.courses.push(course.id);
      });

      // delete event.undergraduate_courses;

      event.type = event.type.id;

      delete event.event_type;

      angular.forEach(tags, function (tag) {
        event.tags.push(tag.name);
      });


      event.scheduled_date = moment(data.data.post_date, "YYYY-DD-MM").format('DD/MM/YYYY');
      event.scheduled_time = moment(data.data.post_date, "YYYY-DD-MM hh:mm").format('hh:mm');

      vm.event = event;
    });

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


    /**
     *
     * @param data
     * @private
     */
    function _parseTime(data){
      data.end_hour = moment(data.end_hour).format('HH:mm');
      data.init_hour = moment(data.init_hour).format('HH:mm');
    }

    TagsService.getTags().then(function(data){
      allTags = data.data.items[0];
    });

    $scope.findTags = function($query) {
      return TagsService.findTags($query, allTags);
    };
  }
})();
