var SubId = "";

$(document).ready(function () {
    GetSubCategories();
    CreateDataTable();
    CreateEventHandler();
    Preview();
    View();
    ApproveQuestions();
    Edit();
    CatchCustomTirggers();
    displayOperationResult();
    ValidateQuestion();
});

function CatchCustomTirggers() {
    $(document).on("sub", function () {
        console.log(SubId);
        if (SubId) {
            $("#subCategoryId").val(SubId);
        }
    });
}

function GetSubCategories() {
    $(document).on('change', "#parentCategoryId", function () {
        var id = $('#parentCategoryId').val();
        console.log(id);
        if (parseInt(id) === 14) {
            console.log(55);
            var firstValue = "";
            $.ajax({
                type: 'GET',
                url: '/Candidate/GetProfessions',
                success: function (data) {
                    $('#subCategoryId').empty();
                    //$('#subCategoryId').append('<option></option>');
                    $.each(data, function (i, w) {
                        console.log(w);
                        firstValue = i === 0 ? w.Item1 : firstValue;
                        $('#subCategoryId').append('<option value="' + w.Item1 + '">' + w.Item2 + '</option>');
                    });
                    $('#subCategoryId').select2({
                        placeholder: '--Vəzifə seç--'
                    });
                    if (SubId) {
                        $('#subCategoryId').select2('val', SubId);
                    } else {
                        $('#subCategoryId').select2('val', firstValue);
                    }
                    //$(document).trigger("sub");
                }
            });
        }
        else {
            firstValue = '';
            $('#subCategoryId').select2('destroy');
            $('#subCategoryId option').remove();
            $.ajax({
                type: 'GET',
                url: '/Exam/GetSubCategories',
                data: { id: id },
                success: function (data) {
                    $('#subCategoryId').empty();
                    $.each(data, function (i, w) {
                        $.each(w, function (j, e) {
                            firstValue = j === 0 ? e.Item1 : firstValue;
                            console.log(e.Item1 + '  ' + e.Item2);
                            $('#subCategoryId').append('<option value="' + e.Item1 + '">' + e.Item2 + '</option>');
                        });
                    });
                    $('#subCategoryId').val(firstValue);
                    $(document).trigger("sub");
                }
            });
            console.log(firstValue);
        }
    });
}
function CreateDataTable() {
    var responsiveHelper;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480
    };
    var tableContainer;

    jQuery(document).ready(function ($) {
        tableContainer = $("#question-table");

        dataTable = tableContainer.DataTable({
            "dom": 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ],
            "sPaginationType": "bootstrap",

            "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "aoColumns": [
                {
                    "bSortable": false,
                    "sWidth": "3%"
                },
                { "sWidth": "5%" },
                null,
                null,
                null,
                null,
                { "bSortable": false },
                {
                    "bSortable": false,
                    "sWidth": "13%"
                }
            ],
            //Responsive Settings
            bAutoWidth: false,
            fnPreDrawCallback: function () {
                // Initialize the responsive datatables helper once.
                if (!responsiveHelper) {
                    responsiveHelper = new ResponsiveDatatablesHelper(tableContainer, breakpointDefinition);
                }
            },
            fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                responsiveHelper.createExpandIcon(nRow);
            },
            fnDrawCallback: function (oSettings) {
                responsiveHelper.respond();
            }
        });
        dataTable.columnFilter({
            "sPlaceHolder": "head:after"
        });
        $(".dataTables_wrapper select").select2({
            minimumResultsForSearch: -1
        });

        $(".dataTables_wrapper select").select2({
            minimumResultsForSearch: -1
        });
        $('.text_filter').addClass('form-control');
        $('.text_filter').first().remove();
        $('.text_filter').last().remove();
        $('.text_filter').eq(5).remove();
        //$('.text_filter').eq(0).css({
        //    "width": "6%",
        //    "vertical-al"
        //});
    });
}

function Preview() {
    $('#btn_preview').click(function () {
        $('#prev_header').html('Ön izləmə');
        $('#ques_text').html($('#QuestionText').val());
        $('#Afield').html('<label style="font-weight:bold;"><input type="radio" name="prewVaraiant" /> A)</label> ' + $('#AnswerTextA').val());
        $('#Bfield').html(' <label style="font-weight:bold;"><input type="radio" name="prewVaraiant" /> B)</label> ' + $('#AnswerTextB').val());
        $('#Cfield').html(' <label style="font-weight:bold;"><input type="radio" name="prewVaraiant" /> C)</label> ' + $('#AnswerTextC').val());
        $('#Dfield').html(' <label style="font-weight:bold;"><input type="radio" name="prewVaraiant" /> D)</label> ' + $('#AnswerTextD').val());
        $('#Efield').html(' <label style="font-weight:bold;"><input type="radio" name="prewVaraiant" /> E)</label> ' + $('#AnswerTextE').val());

        if ($('#QuestionImage').get(0).files.length === 0) {
            $('#qi').attr('src', '#');
        }
        if ($('#AnswerImageA').get(0).files.length === 0) {
            $('#v_a').attr('src', '#');
        }
        if ($('#AnswerImageB').get(0).files.length === 0) {
            $('#vb').attr('src', '#');
        }
        if ($('#AnswerImageC').get(0).files.length === 0) {
            $('#vc').attr('src', '#');
        }
        if ($('#AnswerImageD').get(0).files.length === 0) {
            $('#vd').attr('src', '#');
        }
        if ($('#AnswerImageE').get(0).files.length === 0) {
            $('#ve').attr('src', '#');
        }
    });

    $("#QuestionImage").change(function () {
        readURL(this, 'qi');
    });
    $("#AnswerImageA").change(function () {
        readURL(this, 'v_a');
    });
    $("#AnswerImageB").change(function () {
        readURL(this, 'vb');
    });
    $("#AnswerImageC").change(function () {
        readURL(this, 'vc');
    });
    $("#AnswerImageD").change(function () {
        readURL(this, 'vd');
    });
    $("#AnswerImageE").change(function () {
        readURL(this, 've');
    });
}

function readURL(input, id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + id).attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function View() {
    $('#question-table').on('click', 'a.view', function (e) {
        e.preventDefault();
        console.log($(this).attr('href'));
        $.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                console.log(response);
                $('#qi').removeAttr('src');
                $('#v_a').removeAttr('src');
                $('#vb').removeAttr('src');
                $('#vc').removeAttr('src');
                $('#vd').removeAttr('src');
                $('#ve').removeAttr('src');
                $('#ques_text').html('');
                $.each(response.question, function (i, w) {
                    console.log(w);
                    if (w.QuestionText.length > 0 && i === 0) {
                        $('#ques_text').html(w.QuestionText);
                        $('#prev_header').html('Sual № ' + w.ID + ' || Kateqoriya: ' + w.Category);
                    }
                    if (w.QuestionImageUrl.length > 0 && i === 0) {
                        $('#qi').attr('src', w.QuestionImageUrl);
                    }
                    if (w.Variant === 'A') {
                        $('#Afield').html('<label style="font-weight:bold;"><input type="radio" ' + (w.IsCorrectAnswer === true ? 'checked' : '') + ' "name="prewVaraiant" /> A)</label> ' + w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            console.log(w.AnswerImageUrl);
                            $('#v_a').attr('src', w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'B') {
                        $('#Bfield').html('<label style="font-weight:bold;"><input type="radio" ' + (w.IsCorrectAnswer === true ? 'checked' : '') + ' name="prewVaraiant" /> B)</label> ' + w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#vb').attr('src', w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'C') {
                        $('#Cfield').html('<label style="font-weight:bold;"><input type="radio" ' + (w.IsCorrectAnswer === true ? 'checked' : '') + ' name="prewVaraiant" /> C)</label> ' + w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#vc').attr('src', w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'D') {
                        $('#Dfield').html('<label style="font-weight:   bold;"><input type="radio" ' + (w.IsCorrectAnswer === true ? 'checked' : '') + '  name="prewVaraiant" /> D)</label> ' + w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#vd').attr('src', w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'E') {
                        $('#Efield').html('<label style="font-weight:bold;"><input type="radio" ' + (w.IsCorrectAnswer === true ? 'checked' : '') + ' name="prewVaraiant" /> E)</label> ' + w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#ve').attr('src', w.AnswerImageUrl);
                        }
                    }
                });
                $('#preview input:radio').prop('disabled', true);
                $('#preview').modal('show').appendTo('body');
                //$('body').css('overflow', 'scroll');
                console.log($('#question-table').scrollTop());
            },
            error: function () {
                showErrorNotification('Xəta baş verdi, yenidən cəhd edin');
            }
        });
    });
}

function ApproveQuestions() {
    var ids = [];
    $('#appr_btn').click(function (e) {
        ids = [];
        $('input[name="ques_chk[]"]:checked').each(function () {
            ids.push($(this).val());
        });
        console.log(ids);
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            data: { ids: ids },
            success: function (response) {
                if (response === null) {
                    showInfoNotification("Sual dəyişdirilmədi.");
                } else {
                    $('#ques_container').html(response);
                    CreateDataTable();
                    View();
                }
            }
        });
    });
}

function Edit() {

    $(document).on('click', '#question-table a.edit', function (e) {
        var correctVariant = "";
        e.preventDefault();
        //$('.rmv-v').each(function () {
        //    $(this).click();
        //});
        $('.fileinput-exists .thumbnail img').each(function () {
            $(this).attr('src', "http://placehold.it/200x150");
        });

        $('.fileinput-exists .fileinput-new .thumbnail img').each(function () {
            $(this).attr('src', "http://placehold.it/200x150");
        });

        $.ajax({
            type: 'GET',
            url: $(this).attr('href'),
            success: function (response) {
                console.log(response);
                $('#insert-ques input:not(:radio)').val('');

                $.each(response.question, function (i, w) {
                    if (w.IsCorrectAnswer) {
                        correctVariant = w.Variant;
                    }
                    if (i === 0) {
                        $('#ID').val(w.ID);
                        SubId = w.SubId;
                        $('#Status').val(w.Status);
                    }
                    if (w.QuestionText.length > 0 && i === 0) {
                        $('#QuestionText').val(w.QuestionText);
                        console.log(w.ParentId + 'Parent id');
                        $('#parentCategoryId').val(w.ParentId).change();
                        $('#quesLabelText').html('Sual №' + w.ID + ' || Kateqoriya: ' + w.Category);
                    }
                    if (w.QuestionImageUrl.length > 0 && i === 0) {
                        $('#iq').attr('src', w.QuestionImageUrl);
                        $('#qi').attr('src', w.QuestionImageUrl);
                        $('#QuestionImageUrl').val(w.QuestionImageUrl);
                    }
                    if (w.Variant === 'A') {
                        $('#AnswerTextA').val(w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#ia').attr('src', w.AnswerImageUrl);
                            $('#v_a').attr('src', w.AnswerImageUrl);
                            $('#AnswerImageUrlA').val(w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'B') {
                        $('#AnswerTextB').val(w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#AnswerImageUrlB').val(w.AnswerImageUrl);
                            $('#ib').attr('src', w.AnswerImageUrl);
                            $('#vb').attr('src', w.AnswerImageUrl);
                            console.log(w.AnswerText);
                        }
                    }
                    if (w.Variant === 'C') {
                        $('#AnswerTextC').val(w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#ic').attr('src', w.AnswerImageUrl);
                            $('#vc').attr('src', w.AnswerImageUrl);
                            $('#AnswerImageUrlC').val(w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'D') {
                        $('#AnswerTextD').val(w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#id').attr('src', w.AnswerImageUrl);
                            $('#vd').attr('src', w.AnswerImageUrl);
                            $('#AnswerImageUrlD').val(w.AnswerImageUrl);
                        }
                    }
                    if (w.Variant === 'E') {
                        $('#AnswerTextE').val(w.AnswerText);
                        if (w.AnswerImageUrl.length > 0) {
                            $('#ie').attr('src', w.AnswerImageUrl);
                            $('#ve').attr('src', w.AnswerImageUrl);
                            $('#AnswerImageUrlE').val(w.AnswerImageUrl);
                        }
                    }
                });
                $("input[name='Variants']").each(function () {
                    if ($(this).val() === correctVariant) {
                        console.log($(this).val());
                        $(this).prop('checked', true);
                    }
                });
                //window.scrollTo(0, 0);
                $('html, body').animate({ scrollTop: 0 }, 1000);
            }
        });
    });
    return SubId;
}

function displayOperationResult() {
    result = window.location.hash;
    if (result === '#successI') {
        showSuccessNotification('Sual əlavə edildi.');
    }
    else if (result === '#successE') {
        showSuccessNotification('Sual dəyişdirildi.');
    } else if (result === 'success') {
        showSuccessNotification('Əməliyyat uğurla yerinə yetirildi.');
    }
    else if (result === '#error') {
        showErrorNotification('Xəta baş verdi, yenidən cəhd edin.');
    }
    window.location.hash = '';
}

function ValidateQuestion() {
    var textarea, state = true;


    $('#appr_form').submit(function (e) {
        var questionImageSource = $('#iq').attr('src');
        console.log(questionImageSource);
        state = $('#QuestionText').val().length > 0 || $('#QuestionImage').get(0).files.length > 0 || questionImageSource.indexOf('images') > 0;
        console.log(state);
        if (!state) {
            e.preventDefault();
            $('#QuestionText').addClass('input-validation-error');
            //$(window).scrollTop(0);
            $('html, body').animate({ scrollTop: 10 }, 500);
            showErrorNotification('Sualın mətni və ya şəkili mütləq daxil edilməlidir.');
        }
        else {
            $('textarea.variant').each(function (i) {

                textarea = $(this);

                $('input[type="file"].vti').each(function (j) {

                    if (i === j) {
                        var fileLength = $(this).get(0).files.length;
                        var textAreaLength = textarea.val().length;

                        if (parseInt(textAreaLength) === 0 && (parseInt(fileLength) === 0)) {
                            showErrorNotification('Cavablarda mətn və ya şəkildən biri daxil edilməlidir.');
                            state = false;
                            e.preventDefault();
                        }
                    }
                });

                if (!state) {
                    return false;
                }
                state = true;
            });
        }
        $('.variant').each(function (i) {
            var variant = $(this);
            $('.vti').each(function (j) {
                if (i === j) {
                    var variantImage = $(this);
                    if (variant.val().length === 0 && variantImage.get(0).files.length === 0) {
                        variant.addClass('input-validation-error');
                    }
                    else {
                        variant.removeClass('input-validation-error');
                    }
                }
            });
        });
    });

    $('#QuestionText').keypress(function () {
        var questionImageSource = $('#iq').attr('src');
        if ($('#QuestionText').val().length + 1 > 0 || $('#QuestionImage').get(0).files.length > 0
            || questionImageSource.indexOf('images') > 0) {
            $('#QuestionText').removeClass('input-validation-error');
        } else {
            $('#QuestionText').addClass('input-validation-error');
        }
    });

    $('#QuestionText').focusout(function () {
        var questionImageSource = $('#iq').attr('src');
        if ($('#QuestionImage').get(0).files.length > 0 || questionImageSource.indexOf('images') > 0) {
            $('#QuestionText').removeClass('input-validation-error');
        } else {
            if ($('#QuestionText').val().length === 0) {
                $('#QuestionText').addClass('input-validation-error');
            }
        }
    });

    $('#QuestionImage').change(function () {
        var questionImageSource = $('#iq').attr('src');
        if ($('#QuestionImage').get(0).files.length > 0 || questionImageSource.indexOf('images') > 0) {
            $('#QuestionText').removeClass('input-validation-error');
        } else {
            if ($('#QuestionText').val().length <= 0) {
                $('#QuestionText').addClass('input-validation-error');
            }
        }
    });

    $('#rmv').click(function () {
        console.log($('#QuestionText').val());
        if ($('#QuestionText').val().length === 0) {
            $('#QuestionText').addClass('input-validation-error');
        }
    });

    $('.variant').each(function (i) {
        var variant = $(this);
        variant.change(function () {
            $('.vti').each(function (j) {
                if (i === j) {

                    var variantImage = $(this);
                    var variantImagePreview = $(this).closest('div').parent().find('img').attr('src');
                    console.log();
                    if (variant.val().length === 0 && variantImage.get(0).files.length === 0 && variantImagePreview.indexOf('images') < 0) {
                        variant.addClass('input-validation-error');
                    }
                    else {
                        variant.removeClass('input-validation-error');
                    }
                }
            });
        });
        variant.focusout(function () {
            $('.vti').each(function (j) {
                if (i === j) {
                    var variantImage = $(this);
                    var variantImagePreview = $(this).closest('div').parent().find('img').attr('src');
                    if (variant.val().length === 0 && variantImage.get(0).files.length === 0 && variantImagePreview.indexOf('images') < 0) {
                        variant.addClass('input-validation-error');
                    }
                    else {
                        variant.removeClass('input-validation-error');
                    }
                }
            });
        });
        variant.keyup(function () {
            $('.vti').each(function (j) {
                if (i === j) {
                    var variantImage = $(this);
                    var variantImagePreview = $(this).closest('div').parent().find('img').attr('src');
                    console.log(variantImagePreview.indexOf('images') > 0);
                    if (variant.val().length === 0 && variantImage.get(0).files.length === 0 && variantImagePreview.indexOf('images') < 0) {
                        variant.addClass('input-validation-error');
                    }
                    else {
                        variant.removeClass('input-validation-error');
                    }
                }
            });
        });
    });

    $('.vti').each(function (i) {
        var variantImage = $(this);
        var variantImagePreview = $(this).closest('div').parent().find('img').attr('src');
        variantImage.change(function () {
            $('.variant').each(function (j) {
                if (i === j) {
                    console.log($(this).val());
                    if ($(this).val().length === 0 && variantImage.get(0).files.length === 0 && variantImagePreview.indexOf('images') < 0) {
                        $(this).addClass('input-validation-error');
                    } else $(this).removeClass('input-validation-error');
                }
            });
        });
    });
}

function CreateEventHandler() {

    $('#chkAll').click(function () {
        $('input.chk:checkbox').prop('checked', this.checked);
        if ($('input.chk:checkbox').prop('checked')) {
            $('#question-table tr').addClass('highlight');
        } else
            $('#question-table tr').removeClass('highlight');
    });

    $(document).on('change', 'input.chk:checkbox', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass("highlight");
        } else {
            $(this).closest('tr').removeClass("highlight");
        }
    });

    $('#question-table').on('click', '.tr', function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });
}