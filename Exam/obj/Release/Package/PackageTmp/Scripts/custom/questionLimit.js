$(document).ready(function () {
    ConvertToSelectize();
    CreateSelectBox();
    Save();
    //$('.category-container select').on('change', function () {
    //    GetQuesCounts();
    //    console.log('change');
    //});s
    $(document).on('change', '.category-container select', function () {

        GetQuesCounts();
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
        console.log(id);
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
        if (count < limit) {
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
            $.ajax({
                type: 'POST',
                url: '/Exam/AddQuesLimit',
                data: { count: count, limit: limit, subId: subId, parentId: parentId, array: array },
                success: function (response) {
                    if (response) {
                        showSuccessNotification('1111');
                    } else {
                        showErrorNotification(5555);
                    }
                },
                error: function () {
                    showErrorNotification('asdad');
                }
            });
            console.log(array);
        }
    });
}

function GetQuesCounts(prof = null) {
    var profId = prof == null || prof === '' ? $('.department-container select').eq(-2).find(':selected').val().split('/')[1] : prof;
    var subId = null;
    subId = $('.category-container select').last().find(':selected').val();
    subId = subId === '' ? $('.category-container select').first().find(':selected').val() : subId;
    console.log(subId);
    $('#count').val(0);
    $('#limit').val(0);
    if (subId != null && subId !== '') {
        $.ajax({
            url: '/Exam/GetCounts',
            type: 'GET',
            data: { profId: profId == null ? 0 : profId, subId: subId },
            success: function (response) {
                if (response.Item1 !== 0) {
                    $('#count').val(response.Item1);
                    $('#limit').val(response.Item2);
                }
            }
        });
    }
}