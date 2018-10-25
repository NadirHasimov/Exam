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
    modifyDepartment();
    modifyCategory();
    deleteDepartment();
    deleteCategory();
    displayOperationResult();
});

var $selectizeSubCategory;

function CreateSelectBox() {

    $(document).on('change', '.select', function () {
        var value = $(this).find(':selected').val().split('/');

        var parent = value[0];
        var grandpa = value[2];
        grandpa = parseInt(value[1]) === 0 ? '' : grandpa + ' >> ';
        var id = parseInt($(this).closest('div').attr('id'));
        var divId = 0;

        $('.department-container .parent').each(function () {
            i = $(this).attr('id').substring(2);
            console.log(i);
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

                    var ParentDiv = $('<div class="parent" id="id' + divId + '"></div>'); //create parent div 
                    ParentDiv.appendTo('.department-container'); //append to page 

                    var div = $('<div class="col-md-11" id="' + divId + '"></div>'); // create
                    div.appendTo(ParentDiv);

                    var select = $("<select class='select'></select>").attr("id", "select" + divId).attr("name", "select");
                    select.append($("<option></option>"));
                    var optionsCount = 0;
                    $.each(response.profs, function (index, data) {
                        select.append($("<option></option>").attr("value", data.Item1 + '/' + data.Item3 + '/' + data.Item4).text(data.Item2));
                        optionsCount++;
                    });

                    $('#' + divId).html(select);

                    $('#select' + divId + '').selectize({
                        create: true,
                        placeholder: '--Seç--',
                        sortField: 'text',
                        render: {
                            option_create: function (data, escape) {
                                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; əlavə et</div>';
                            }
                        }
                    });
                    if (optionsCount !== 0) {
                        $(ParentDiv).append(`<div class="form-group">
                                            <div class="">
                                                <a href="#" class="modifyDepartment btn btn-info">Dəyişdir</a>
                                                <a href="#" class="deleteDepartment btn btn-danger">Sil</a>
                                            </div>
                                         </div>`);
                    }
                    divId = 0;
                }
            });
        }
        else {
            divId = parseInt(id) + 1;
            $('.department-container .parent').each(function () {
                i = $(this).attr('id').substring(2);
                console.log(i);
                if (parseInt(i) > id) {
                    $(this).remove();
                }
            });

            divId = parseInt(id) + 1;

            var ParentDiv = $('<div class="parent" id="id' + divId + '"></div>'); //create parent div 
            ParentDiv.appendTo('.department-container'); //append to page 

            var div = $('<div class="col-md-11" id="' + divId + '"></div>'); // create
            div.appendTo(ParentDiv);

            var select = $("<select class='select'></select>").attr("id", "select" + divId).attr("name", "select");
            select.append($("<option></option>"));

            $('#' + divId).html(select);

            $('#select' + divId + '').selectize({
                create: true,
                placeholder: '--Seç--',
                sortField: 'text',
                render: {
                    option_create: function (data, escape) {
                        return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; əlavə et</div>';
                    }
                }
            });
        }
        console.log($(this).find(':selected').text());
        //var parentId = $.isNumeric(grandpa) ? grandpa : 0;
        //console.log(parentId + '--parent');
        $.ajax({
            type: 'GET',
            url: '/Exam/GridPartial',
            data: { path: grandpa + $(this).find(':selected').text() },
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
                        var optionsCount = 0;
                        $.each(response.data, function (index, w) {
                            optionsCount++;
                            select.append($("<option></option>").attr("value", w.Item1).text(w.Item2));
                        });
                        $('#sub').html(select);
                        if (optionsCount === 0) {
                            $('#categoryButtons').html('');
                        } else {
                            $('#categoryButtons').html(`<div class="form-group">
                                                                    <div class="">
                                                                        <a href="#" class="modifyCategory btn btn-info">Dəyişdir</a>
                                                                        <a href="#" class="deleteCategory btn btn-danger">Sil</a>
                                                                    </div>
                                                                </div>`);
                        }
                        $('#subId').selectize({
                            create: true,
                            placeholder: '~~Seç~~',
                            sortField: 'text',
                            render: {
                                option_create: function (data, escape) {
                                    return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; əlavə et</div>';
                                }
                            }
                        });

                        console.log(response.data);
                    },
                    error: function () {
                        showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
                    }
                });
            } else {
                var select = $("<select></select>").attr("id", "subId").attr("name", "select");
                select.append($("<option></option>"));
                $('#sub').html(select);
                $('#subId').selectize({
                    create: true,
                    placeholder: '~~Seç~~',
                    sortField: 'text',
                    render: {
                        option_create: function (data, escape) {
                            return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; əlavə et</div>';
                        }
                    }
                });
            }
        }
        else {
            $('#sub').html('');
            $('#categoryButtons').html('');
        }
    });
}

function ConvertToSelectize() {
    $('select').selectize({
        create: true,
        placeholder: '~~Seç~~',
        sortField: 'text',
        render: {
            option_create: function (data, escape) {
                return '<div class="create"><strong>' + escape(data.input) + '</strong>&hellip; əlavə et</div>';
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
        limit = parseInt($('#limit').val());
        count = parseInt($('#count').val());
        console.log(count < limit);
        if (count < limit) {
            showErrorNotification('Limit, ümüumi saydan böyükdür.');
        }
        else if (limit === 0 || count === 0) {
            showErrorNotification('Sual və minimum düzgün  cavab sayı 0 ola bilməz.');
        }
        else {
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
            console.log(array.length);
            if (($.isNumeric(parentId) || parentId.length > 1) && array.length !== 0) {
                $.ajax({
                    type: 'POST',
                    url: '/Exam/AddQuesLimit',
                    data: { count: count, limit: limit, subId: subId, parentId: parentId, array: array },
                    success: function (response) {
                        console.log(response);
                        var counter = 0;
                        if (response.Item1) {
                            showSuccessNotification('Əməliyyat uğurla yerinə yetirildi.');
                            $('.parent .modifyDepartment').each(function (i) {
                                console.log(i);
                                counter++;
                            });
                            if (counter < array.length - 1) {
                                $('#select' + counter).change();
                            } else {
                                $('#select' + (array.length - 1)).change();
                            }
                            //console.log(counter);
                        } else {
                            showErrorNotification(response.Item2);
                        }
                    },
                    error: function () {
                        showErrorNotification('Xəta baş verdi, giriş verilənlərini yoxlayın.');
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

function modifyDepartment() {
    var depart, selectId, departId, departText, divId;
    $(document).on('click', '.modifyDepartment', function () {
        //Part 1
        //select closest department option
        depart = $(this).parent().parent().parent().find('select');
        divId = parseInt($(this).parent().parent().parent().find('.col-md-11').attr('id'));
        console.log(divId);
        selectId = depart.attr('id');
        console.log(depart.html());
        if (selectId === 'select1') {
            departText = depart.find(':selected').first().text();
        } else {
            departText = depart.find(':selected').text();
        }
        departId = depart.find(':selected').val().split('/')[0];
        $('#modifiedText').val(departText);
        //check departId valid 
        if (departId > 0) {
            //show modal
            $('#confirmUpDelStatus').val('0');
            $('#departModifyModal').modal('show').appendTo('body');
        }
        //Part 2s
        //Update current depart when click ok button
    });


    $('#mdfy_ok').click(function () {
        var inputText = $('#modifiedText').val();
        if (parseInt($('#confirmUpDelStatus').val()) === 0) {// check modify category or depart
            if (inputText) {
                console.log(departId + ' ' + departText);
                console.log(depart);
                if (depart) {
                    $.ajax({
                        type: 'POST',
                        url: '/Exam/UpdateDepart',
                        data: { id: departId, text: $('#modifiedText').val() },
                        success: function (response) {
                            if (response) {
                                //depart.find(':selected').text($('#modifiedText').val());
                                //depart[0].selectize.clearCache();
                                //depart[0].selectize.destroy();
                                //$('#' + selectId).selectize();
                                if (selectId === 'select1') {
                                    window.location.replace('/Exam/QuestionLimit/#success');
                                    window.location.reload();
                                } else {
                                    $('#select' + (divId - 1)).change();
                                }
                                showSuccessNotification('Əməliyyat uğurla yerinə yetirildi.');
                                depart = null;
                                departId = null;
                                departText = null;
                            } else {
                                showErrorNotification('Xəta başverdi, yenidən cəhd edin.');
                            }
                        },
                        error: function () {
                            showErrorNotification('Xəta baş verdi.');
                        }
                    });
                    //console.log($('#select1').html());
                    $('#departModifyModal').modal('hide');
                }
                departId = null;
                departText = null;
            } else {
                $('#modifiedText').addClass('input-validation-error');
            }
            $('#modifiedText').keypress(function () {
                if ($('#modifiedText').val().length + 1) {
                    $('#modifiedText').removeClass('input-validation-error');
                } else {
                    $('#modifiedText').addClass('input-validation-error');
                }
            });
            $('#modifiedText').keyup(function () {
                if ($('#modifiedText').val().length === 0) {
                    $('#modifiedText').addClass('input-validation-error');
                }
                else {
                    $('#modifiedText').removeClass('input-validation-error');
                }
            });
        }
    });

}

function modifyCategory() {
    var category, selectId, categoryId, categoryText, categoryVal;
    $(document).on('click', '.modifyCategory', function () {
        //Part 1
        //select closest department option
        category = $(this).parent().parent().parent().parent().find('select');
        categoryVal = category.find(':selected').val();
        categoryId = category.find(':selected').val();

        selectId = category.attr('id');
        if (selectId === 'subId') {
            categoryText = category.find(':selected').text();
        } else {
            categoryText = category.find(':selected').first().text();
        }
        console.log(category.html());
        console.log(categoryText + ' ' + categoryId);
        $('#modifiedText').val(categoryText);
        //check categoryId valid 
        if (categoryId > 0) {
            //show modal
            $('#confirmUpDelStatus').val('1');
            $('#departModifyModal').modal('show').appendTo('body');
        }
    });
    //Part 2s
    //Update current depart when click ok button


    $('#mdfy_ok').click(function () {
        if (parseInt($('#confirmUpDelStatus').val()) === 1) {// check modify category or depart
            var inputText = $('#modifiedText').val();
            if (inputText) {
                console.log(categoryText + ' ' + categoryId);
                if (category) {
                    console.log(6666666);
                    $.ajax({
                        type: 'POST',
                        url: '/Exam/UpdateCategory',
                        data: { id: categoryId, text: $('#modifiedText').val() },
                        success: function (response) {
                            if (response) {
                                //category[0].selectize.clearCache();
                                //category[0].selectize.destroy();
                                if (selectId === 'subId') {
                                    showSuccessNotification('Əməliyyat uğurla yerinə yetirildi.');
                                    console.log(categoryVal);
                                    $('#parentCategory').change();

                                } else {
                                    window.location.replace('/Exam/QuestionLimit#success');
                                    window.location.reload();
                                }
                                //$('#' + selectId).find(':selected').text($('#modifiedText').val());
                                //$(category).selectize();
                                category = null;
                                categoryId = null;
                                categoryText = null;
                            } else {
                                showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
                            }
                        },
                        error: function () {
                            showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
                        }
                    });
                    //console.log($('#select1').html());
                    $('#departModifyModal').modal('hide');
                }
                categoryId = null;
                categoryText = null;
            } else {
                $('#modifiedText').addClass('input-validation-error');
            }
            $('#modifiedText').keypress(function () {
                if ($('#modifiedText').val().length + 1) {
                    $('#modifiedText').removeClass('input-validation-error');
                } else {
                    $('#modifiedText').addClass('input-validation-error');
                }
            });
            $('#modifiedText').keyup(function () {
                if ($('#modifiedText').val().length === 0) {
                    $('#modifiedText').addClass('input-validation-error');
                }
                else {
                    $('#modifiedText').removeClass('input-validation-error');
                }
            });
        }
    });
}

function deleteCategory() {
    var category, id, deleteButton, selectId;

    $(document).on('click', '.deleteCategory', function () {
        category = $(this).parent().parent().parent().parent().find('select');
        selectId = category.attr('id');
        deleteButton = $(this);
        id = category.find(':selected').val();
        if (id > 0) {
            $('#confirmModal').modal('show').appendTo('body');
            $('#DeleteUpDelStatus').val('1');
        }
        console.log(id);
    });

    $('#confirm').click(function () {
        if (parseInt($('#DeleteUpDelStatus').val()) === 1) {
            var divId = parseInt($(deleteButton).parent().parent().parent().find('.col-md-11').attr('id'));
            divId = divId - 1;
            console.log(divId);
            $.ajax({
                type: 'POST',
                url: '/Exam/DeleteCategory',
                data: { id: id },
                success: function (response) {
                    if (response) {
                        if (selectId === 'subId') {
                            showSuccessNotification('Əməliyyat uğurla yerinə yetirildi.');
                            $('#confirmModal').modal('hide');
                            $('#parentCategory').change();

                        } else {
                            window.location.replace('/Exam/QuestionLimit#success');
                            window.location.reload();
                        }
                    } else {
                        showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
                    }
                },
                error: function () {
                    showErrorNotification('Xəta baş verdi, yenidən cəhd edin');
                }
            });
        }
    });
}

function deleteDepartment() {
    var depart, id, deleteButton;

    $(document).on('click', '.deleteDepartment', function () {
        depart = $(this).parent().parent().parent().find('select');
        deleteButton = $(this);
        id = depart.find(':selected').val().split('/')[0];
        if (id > 0) {
            $('#confirmModal').modal('show').appendTo('body');
            $('#DeleteUpDelStatus').val('0');
        }
        console.log(id);
    });

    $('#confirm').click(function () {
        if (parseInt($('#DeleteUpDelStatus').val()) === 0) {
            var divId = parseInt($(deleteButton).parent().parent().parent().find('.col-md-11').attr('id'));
            divId = divId - 1;
            console.log(divId);
            $.ajax({
                type: 'POST',
                url: '/Exam/DeleteDepart',
                data: { id: id },
                success: function (response) {
                    if (response) {
                        if (divId === 0) {
                            window.location.replace('/Exam/QuestionLimit#success');
                            window.location.reload();
                        } else {
                            $('#select' + divId).change();
                            $('#confirmModal').modal('hide');
                            showSuccessNotification('Operation executed successfully.');
                        }
                    } else {
                        showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
                    }
                },
                error: function () {
                    showErrorNotification('Xəta baş verdi, yenidən cəhd edin');
                }
            });
        }
    });
}

function displayOperationResult() {
    result = window.location.hash;
    if (result === '#success') {
        showSuccessNotification('Operation executed successfully.');
    }
    window.location.hash = '';
}
