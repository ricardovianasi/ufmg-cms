(function () {
    'use strict';

    angular.module('eventsModule')
        .controller('EventsNewController', EventsNewController);

    /** ngInject */
    function EventsNewController($scope,
        $timeout,
        $location,
        CourseService,
        EventsService,
        MediaService,
        NotificationService,
        ManagerFileService,
        StatusService,
        DateTimeHelper,
        ModalService,
        $rootScope,
        TagsService,
        $log,
        $window,
        PermissionService,
        validationService) {
        var allTags = [];
        var vm = $scope;
        vm.vm = vm;

        vm.title = 'Novo Evento';
        vm.breadcrumb = vm.title;
        vm.event = {
            status: StatusService.STATUS_PUBLISHED,
            courses: [],
            tags: [],
            endDate: null
        };
        vm.categories = [];
        vm.courses = [];

        vm.addPoster = _addPoster;

        onInit();

        function onInit() {
            $log.info('EventsNewController');
        }

        function _addPoster() {
            ManagerFileService.allFiles();
            ManagerFileService
                .open('free')
                .then(function (file) {
                    vm.event.poster = file;
                });
        }

        vm.toggleSelection = function toggleSelection(courseId) {
            var idx = vm.event.courses.indexOf(courseId);

            if (idx > -1) {
                vm.event.courses.splice(idx, 1);
            } else {
                vm.event.courses.push(courseId);
            }
        };

        function _permissions() {
            vm.canPermission = PermissionService.canPost('events');
        }

        vm.datepickerOpt = {
            initDate: DateTimeHelper.getDatepickerOpt(),
            endDate: DateTimeHelper.getDatepickerOpt()
        };

        vm.datepickerOpt.initDate.status = {
            opened: false
        };
        vm.datepickerOpt.endDate.status = {
            opened: false
        };

        vm.timepickerOpt = {
            initTime: DateTimeHelper.getTimepickerOpt(),
            endTime: DateTimeHelper.getTimepickerOpt()
        };

        vm.setEndDefault = function () {
            if (vm.event.endDate === '' || vm.event.endDate === null) {
                vm.event.endDate = vm.event.initDate;
            }
        };

        vm.redactorOptions = {
            plugins: false,
        };

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
            uploadPhoto: function () {
                ManagerFileService.imageFiles();
                ManagerFileService
                    .open('medium')
                    .then(function (image) {
                        vm.event.photo = image;
                    });
            },
            removeImage: function (elem) {
                $timeout(function () {
                    vm.event[elem] = '';
                    vm.$apply();
                });
            }
        };

        vm.publish = function (data) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            vm.setEndDefault();
            vm.isLoading = true;
            EventsService
                .store(data)
                .then(function (event) {
                    NotificationService.success('Evento criado com sucesso.');
                    $location.path('/events/edit/' + event.data.id);
                }).catch(console.error)
                .then(function () {
                    vm.isLoading = false;
                });
        };

        CourseService.getCourses('graduation').then(function (data) {
            vm.courses = data.data;
            _permissions();
        });

        EventsService.getEventsCategories().then(function (data) {
            vm.categories = data.data;
        });

        StatusService.getStatus().then(function (res) {
            vm.statuses = res.data;
        });

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        vm.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };
    }
})();
