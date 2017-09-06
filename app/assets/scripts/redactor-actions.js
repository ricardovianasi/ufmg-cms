onInit();

function onInit() {
    widgetButtonRemove();
}

function widgetButtonRemove() {
    $(document).on('mouseenter', '.figure-removable', function () {
        $(this).append(
            '<span class="remove-button btn btn-danger btn-widget-remove"><i class="fa fa-trash"></i></span>'
        );
    });

    $(document).on('mouseleave', '.figure-removable', function () {
        $('.remove-button').remove();
    });

    $(document).on('click', '.remove-button', function (event) {
        $(this).closest('.figure-removable').remove();
        updateRedactor();
    });
}
