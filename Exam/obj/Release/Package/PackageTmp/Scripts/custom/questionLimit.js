$(document).ready(function () {
    var divId = 0;
    ConvertToSelectize();
    //$('#select1').change(function () {
    //    var parent = $('#select1').find(':selected').val();
    //    var id = $(this).closest('div').attr('id');
    //    console.log(id);
    //    if ($.isNumeric(parent)) {
    //        $.ajax({
    //            type: 'POST',
    //            url: '/Exam/GetProfs',
    //            data: { parent: parent },
    //            success: function (response) {
    //                divId = parseInt(id) + 1;
    //                var div = $('<div class="col-md-12" id="' + divId + '"></div>');
    //                div.appendTo('.selectbox-container');
    //                //var sel =.appendTo('#2');
    //                //var sel = $('<select id="select' + divId + '>');
    //                $.each(response.profs, function (w) {
    //                    console.log(w);
    //                });
    //                var select = $("<select></select>").attr("id", "select" + divId).attr("name", "select");
    //                $.each(response.profs, function (index, data) {
    //                    select.append($("<option></option>").attr("value", data.Item1).text(data.Item2));
    //                });

    //                //$(response.profs).each(function () {
    //                //    sel.append($("<option>").attr('value', this.Item1).text(this.Item2));
    //                //    console.log(this.Item1 + '  ' + this.Item2);
    //                //});
    //                console.log($('#' + divId).length);
    //                $('#' + divId).html(select);
    //            }
    //        });
    //    }

    //});
    CreateSelectBox();
});

function CreateSelectBox() {
    $(document).on('change', '.select', function () {
        var parent = $(this).find(':selected').val();
        var id = $(this).closest('div').attr('id');
        console.log(id);
        if ($.isNumeric(parent)) {
            $.ajax({
                type: 'POST',
                url: '/Exam/GetProfs',
                data: { parent: parent },
                success: function (response) {
                    divId = parseInt(id) + 1;
                    var div = $('<div class="col-md-12" id="' + divId + '"></div>');
                    div.appendTo('.selectbox-container');
                    var select = $("<select class='select'></select>").attr("id", "select" + divId).attr("name", "select");
                    select.append($("<option></option>"));
                    $.each(response.profs, function (index, data) {
                        select.append($("<option></option>").attr("value", data.Item1).text(data.Item2));
                    });
                    $('#' + divId).html(select);
                    $('#select' + divId + '').selectize({
                        create: true,
                        placeholder: 'Select organization...',
                        sortField: 'text',
                        render: {
                            option_create: function (data, escape) {
                                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
                            }
                        }
                    });
                    console.log($('#' + divId).length);
                }
            });
        }
    });
}

function ConvertToSelectize() {
    $('.select').selectize({
        create: true,
        placeholder: 'Select organization...',
        sortField: 'text',
        render: {
            option_create: function (data, escape) {
                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; add new</div>';
            }
        }
    });
}