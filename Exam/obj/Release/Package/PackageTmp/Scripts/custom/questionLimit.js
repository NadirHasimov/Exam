$(document).ready(function () {
    var divId = 0;
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
    $('#select1').change(function () {
        var parent = $('#select1').find(':selected').val();
        var id = $(this).closest('div').attr('id');
        console.log(id);
        if ($.isNumeric(parent)) {
            $.ajax({
                type: 'POST',
                url: '/Exam/GetProfs',
                data: { parent: parent },
                success: function (response) {
                    divId = parseInt(id) + 1;
                    var div = $('<div class="col-md-12" id="' + divId + '">' + $('<select id="select' + divId + '>') + '</div>');
                    div.appendTo('.selectbox-container');
                    //var sel =.appendTo('#2');
                    var sel = $('<select id="select' + divId + '>').appendTo('.selectbox-container');
                    $(response).each(function () {
                        sel.append($("<option>").attr('value', this.Item1).text(this.Item2));
                        console.log(this.Item1);
                    });
                }
            });
        }

    });
});
