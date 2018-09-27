$(document).ready(function () {
    ConvertToSelectize();
    CreateSelectBox();
    Save();
    //$('.category-container select').on('change', function () {
    //    GetQuesCounts();
    //    console.log('change');
    //});s
    $(document).on('change', '.category-container select', function () {
        var prof = $('.department-container select').eq(-2).find(':selected').val().split('/')[0];
        GetQuesCounts(prof);
    });
    //$('.category-container select').change(function () {
    //    console.log('change');
    //});
});

function CreateSelectBox() {

    $(document).on('change', '.select', function () {
        var value = $(this).find(':selected').val().split('/');
        var parent = value[0];
        var id = parseInt($(this).closest('div').attr('id'));
        var divId = 0;

        $('div').each(function () {
            i = $(this).attr('id');
            if (parseInt(i) > id) {
                $(this).remove();
            }
        });

        if ($.isNumeric(parent)) {
            GetQuesCounts(parent);
            $.ajax({
                type: 'POST',
                url: '/Exam/GetProfs',
                data: { parent: parent },
                success: function (response) {
                    divId = parseInt(id) + 1;
                    var div = $('<div class="col-md-12" id="' + divId + '"></div>');
                    div.appendTo('.department-container');
                    var select = $("<select class='select'></select>").attr("id", "select" + divId).attr("name", "select");
                    select.append($("<option></option>"));
                    $.each(response.profs, function (index, data) {
                        select.append($("<option></option>").attr("value", data.Item1 + '/' + data.Item3).text(data.Item2));
                    });
                    $('#' + divId).html(select);
                    $('#select' + divId + '').selectize({
                        create: true,
                        placeholder: '--Select--',
                        sortField: 'text',
                        render: {
                            option_create: function (data, escape) {
                                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
                            }
                        }
                    });
                    divId = 0;
                }
            });
        }
        else {
            divId = parseInt(id) + 1;
            $('div').each(function () {
                i = $(this).attr('id');
                if (parseInt(i) > id) {
                    $(this).remove();
                }
            });
            var div = $('<div class="col-md-12" id="' + divId + '"></div>');
            div.appendTo('.department-container');
            var select = $("<select class='select'></select>").attr("id", "select" + divId).attr("name", "select");
            select.append($("<option></option>"));
            $('#' + divId).html(select);
            $('#select' + divId + '').selectize({
                create: true,
                placeholder: '--Select--',
                sortField: 'text',
                render: {
                    option_create: function (data, escape) {
                        return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
                    }
                }
            });
        }
        console.log($(this).find(':selected').text());
        $.ajax({
            type: 'GET',
            url: '/Exam/GridPartial',
            data: { prof: $(this).find(':selected').text() },
            success: function (response) {
                $('#Grid').html(response);
            }
        });
    });

    $(document).on('change', '#parentCategory', function () {
        console.log($(this).find(':selected').val());
        parentCategory = $(this).find(':selected').val();
        if (parseInt(parentCategory) !== 14) {
            if ($.isNumeric(parentCategory)) {
                $.ajax({
                    type: 'GET',
                    url: '/Exam/GetSubCategories',
                    data: { id: $(this).find(':selected').val() },
                    success: function (response) {
                        var select = $("<select></select>").attr("id", "subId").attr("name", "select");
                        select.append($("<option></option>"));
                        $.each(response.data, function (index, w) {
                            select.append($("<option></option>").attr("value", w.Item1).text(w.Item2));
                        });
                        $('#sub').html(select);
                        $('#subId').selectize({
                            create: true,
                            placeholder: '~~Select option~~',
                            sortField: 'text',
                            render: {
                                option_create: function (data, escape) {
                                    return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
                                }
                            }
                        });
                        console.log(response.data);
                    },
                    error: function () {
                        showErrorNotification('Error occured.');
                    }
                });
            } else {
                var select = $("<select></select>").attr("id", "subId").attr("name", "select");
                select.append($("<option></option>"));
                $('#sub').html(select);
                $('#subId').selectize({
                    create: true,
                    placeholder: '~~Select option~~',
                    sortField: 'text',
                    render: {
                        option_create: function (data, escape) {
                            return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
                        }
                    }
                });
            }
        }
        else {
            $('#sub').html('');
        }
    });
}

function ConvertToSelectize() {
    $('select').selectize({
        create: true,
        placeholder: '~~Select option~~',
        sortField: 'text',
        render: {
            option_create: function (data, escape) {
                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
            }
        }
    });
}
var object = {
    child: "",
    parent: ""
};

var array = [];
function Save() {
    parent = 'first';

    $('#save').on('click', function () {
        limit = $('#limit').val();
        count = $('#count').val();
        console.log(count + ' ' + limit);
        if (parseInt(count) < parseInt(limit)) {
            showErrorNotification('Limit greater than count.');
        } else {
            array = [];

            $('.department-container select').each(function (i) {
                object = {};
                val = $(this).find(':selected').val().split('/');
                object.child = val[0];
                object.parent = val[1];

                console.log(object);
                //$('.department-container select').each(function (j) {
                //    if (j === i - 1) {
                //        parent = $(this).find(':selected').val() == null || $(this).find(':selected').val() === ''
                //            ? 'first' : $(this).find(':selected').val();
                //    }
                //});
                //object.child = $(this).find(':selected').val();
                //object.parent = parent;
                //parent = '';
                if (!$.isEmptyObject(object.child)) {
                    array.push(object);
                }
            });

            subId = $('#subId').find(':selected').val();
            parentId = $('#parentCategory').find(':selected').val();
            if ($.isNumeric(parentId)) {
                $.ajax({
                    type: 'POST',
                    url: '/Exam/AddQuesLimit',
                    data: { count: count, limit: limit, subId: subId, parentId: parentId, array: array },
                    success: function (response) {
                        if (response) {
                            showSuccessNotification('Operation successfully executed.');
                        } else {
                            showErrorNotification('Error occured.');
                        }
                    },
                    error: function () {
                        showErrorNotification('Error ocured. Check network properties.');
                    }
                });
            }
            else {
                showErrorNotification('Select all fields.');
            }
            console.log(array);
        }
    });
}

function GetQuesCounts(prof) {
    //var profId = prof == null || prof === '' ? $('.department-container select').eq(-2).find(':selected').val().split('/')[0] : prof;
    var subId = null;
    subId = $('.category-container select').last().find(':selected').val();
    subId = subId === '' ? $('.category-container select').first().find(':selected').val() : subId;
    console.log(subId + '--  ' + prof);
    $('#count').val(0);
    $('#limit').val(0);
    if (subId != null && subId !== '') {
        $.ajax({
            url: '/Exam/GetCounts',
            type: 'GET',
            data: { profId: prof == null ? 0 : prof, subId: subId },
            success: function (response) {
                if (response.Item1 !== 0) {
                    $('#count').val(response.Item1);
                    $('#limit').val(response.Item2);
                }
            }
        });
    }
}