var table;
$(document).ready(function () {
    getUserData();
    $('.profession').select2();
    var d = new Date();
    $('#Date').val(d.toShortFormat());

    //add class listener----
    var $div = $("#tab4");
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                if (attributeValue === 'tab-pane active') {
                    $('#FirstNameClone').val($('#FirstName').val());
                    $('#FinCodeClone').val($('#FinCode').val());
                    $('#LastNameClone').val($('#LastName').val());
                    $('#MiddleNameClone').val($('#MiddleName').val());
                    $('#BirthdateClone').val($('#Birthdate').val());
                    $('#GenderClone' + $('input[name=Gender]:checked').val() + '').prop('checked', true);
                    $('#MailClone').val($('#Mail').val());
                    $('#FamilyStatusIdClone').val($('#FamilyStatusId').val());
                    $('#DateClone').val($('#Date').val());
                    $('#clockClone').val($('#clock').val());
                    $('#MobileClone').val($('#Mobile').val());
                    $('[name=professionClone]').select2('val', $('#profession').find(':selected').val());
                    $('[name=ProfessionIdClone]').select2('val', $('#ProfessionId').find(':selected').val());
                    $("#tab4 input, #tab4 select").prop('disabled', true);
                    console.log($('input[name=Gender]:checked').val());
                }
                console.log("Class attribute changed to:", attributeValue);
            }
        });
    });
    observer.observe($div[0], {
        attributes: true
    });
    //----add class listener
    saveCandidate();
    ApproveTickets();
    CreateDataTable();
    CreateEventHandler();
    FilterDate();
    window.location.url = '';
    displayOperationResult();
});

var candidateData = {
    ID: "",
    FinCode: "",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    BirthDate: "",
    Mail: "",
    Mobile: "",
    ProfessionId: "",
    Gender: "",
    FamilyStatus: ""
};

var candidateModel = {
    ID: "",
    FinCode: "",
    FirstName: "",
    LastName: "",
    MiddleName: "",
    Birthdate: "",
    ProfessionId: "",
    GenderId: "",
    FamilyStatusId: "",
    ExamDate: "",
    ExamTime: "",
    ExamProfessionId: "",
    Mail: "",
    Mobile: "",
    Profession: ""
};
function getUserData() {
    var counter = 0,
        finFocusIn = '',
        finFocusOut = '',
        finPrev = '',
        finCur = '',
        status = true;

    $('#finCode').focusout(function () {
        finFocusOut = $(this).val();
    });
    $('#finCode').focusin(function () {
        finFocusIn = $(this).val();
    });
    $('#prevBtn').click(function () {
        finPrev = $('#finCode').val();
        if (finPrev !== finCur) {
            counter--;
        }
    });
    var $div2 = $("#tab2");
    var observer2 = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.attributeName === "class") {
                var attributeValue = $(mutation.target).prop(mutation.attributeName);
                if (attributeValue === 'tab-pane active') {
                    finCur = $('#finCode').val();
                    //console.log(finCur + ' ' + finFocusIn);
                    if (((counter === 0) || (finCur !== finPrev)) && finCur.length === 7) {
                        $.ajax({
                            type: 'GET',
                            url: '/Candidate/GetCandidate',
                            data: { finCode: finCur },
                            success: function (response) {
                                console.log(response);
                                candidateData = response.candidateData;
                                setData(response);
                                response = null;
                            }
                        });
                        status = false;
                        counter++;
                        //console.log('counter: ' + counter);
                    }
                }
            }
        });
    });
    observer2.observe($div2[0], {
        attributes: true
    });
}

function setData(data) {
    candidateData = data.candidate;
    //console.log(candidateData);
    if (candidateData.FirstName !== null) {
        var date = new Date(parseFloat(candidateData.Birthdate.substr(6)));
        var birth = new Date(candidateData.Birthdate.substr(6));
        //console.log(date.toLocaleDateString());
        $('#FirstName').val(candidateData.LastName);
        $('#FinCode').val(candidateData.FinCode);
        $('#LastName').val(candidateData.FirstName);
        $('#MiddleName').val(candidateData.MiddleName);
        //console.log(date.toShortFormat());
        $('#Birthdate').val(date.toShortFormat());
        $('[name=ProfessionId]').select2('val', candidateData.ProfessionId);
        $('#Gender' + candidateData.GenderId + '').prop('checked', true);
        $('#Mail').val(candidateData.Mail);
        $('#Mobile').val(candidateData.Mobile);
        $('#ID').val(candidateData.ID);
        $('#FamilyStatusId').val(candidateData.FamilyStatusId);
        $("#tab2 input, #tab2 select,#tab2 a").prop('disabled', true);
        $('#tab2 a').addClass('disabled');
    } else {
        $('#Gender0').prop('checked', true);
        $("#tab2 input, #tab2 select").prop('disabled', false);
        $('#FinCode').prop('disabled', true);
        $('#tab2 input:not(:radio)').val('');
        $('#FinCode').val($('#finCode').val());
        $('.select2-choice').removeClass('disabled');
        //console.log($('#finCode').val());
    }
}

Date.prototype.toShortFormat = function () {
    var day = this.getDate() < 10 ? '0' + this.getDate() : this.getDate();
    var month = this.getMonth() + 1;
    var month_index = month < 10 ? '0' + month : month;
    var year = this.getFullYear();
    return "" + day + "/" + month_index + "/" + year;
};

function saveCandidate() {
    $('#saveCandidate').click(function () {
        var data = getData();
        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/Candidate/AddCandidate',
            data: { viewModel: data },
            success: function (response) {
                if (response.result) {
                    //table.row.add([
                    //'<input name="ids[]" class="chk" type="checkbox" value="' + response.ID + '" />',
                    //data.FinCode,
                    //data.FirstName,
                    //data.LastName,
                    //data.MiddleName,
                    //data.Profession,
                    //data.ExamDate,
                    //data.ExamTime,
                    //'Təsdiqlənmədi'
                    //]).draw();
                    jQuery('#tbl_ticket').dataTable().fnAddData(['<input name="ids[]" class="chk" type="checkbox" value="' + response.ID + '" />',
                    data.FinCode,
                    data.FirstName,
                    data.LastName,
                    data.MiddleName,
                    data.Profession,
                    data.ExamDate,
                    data.ExamTime,
                        'Təsdiqlənmədi']);

                    $('#tab2 input:not(:radio)').val('');
                    $('#finCode').val('');
                    $('#href1').click();
                    //$('#modal').modal('toggle');
                    showSuccessNotification('Operation successfully executed.');
                } else {
                    showErrorNotification(response.message);
                }
            },
            error: function () { showErrorNotification('Error occured!'); }
        });
    });

}
function getData() {
    candidateModel.FirstName = $('#FirstName').val();
    candidateModel.LastName = $('#LastName').val();
    candidateModel.MiddleName = $('#MiddleName').val();
    candidateModel.FinCode = $('#FinCode').val();
    candidateModel.ProfessionId = $('#ProfessionId').val();
    candidateModel.ExamProfessionId = $('#profession').find(':selected').val();
    candidateModel.GenderId = $('input[name=Gender]:checked').val();
    candidateModel.FamilyStatusId = $('#FamilyStatusId').val();
    candidateModel.Birthdate = $('#Birthdate').val();
    candidateModel.Mail = $('#Mail').val();
    candidateModel.ID = $('#ID').val();
    candidateModel.ExamDate = $('#Date').val();
    candidateModel.ExamTime = $('#clock').val();
    candidateModel.Mobile = $('#Mobile').val();
    candidateModel.Profession = $('#profession').find(':selected').text();
    return candidateModel;
}
function CreateDataTable() {
    var responsiveHelper;
    var breakpointDefinition = {
        tablet: 1024,
        phone: 480
    };
    var tableContainer;

    jQuery(document).ready(function ($) {
        tableContainer = $("#tbl_ticket");

        table = tableContainer.dataTable({
            //"sDom": "tip",

            "bStateSave": true,
            "sPaginationType": "bootstrap",
            "sDom": "<'row'<'col-xs-6 col-left'l><'col-xs-6 col-right'<'export-data'T>f>r>t<'row'<'col-xs-6 col-left'i><'col-xs-6 col-right'p>>",
            "oTableTools": {
            },
            "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "aoColumns": [
                {
                    "bSortable": false,
                    "bWidth": "10%"
                },
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                { "bSortable": false }
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
        table.columnFilter({
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
    });

    $('#srch').change(function () {
        console.log($(this).val());
        table.page(parseInt($(this).val())).draw('page');
    });
}
function ApproveTickets() {
    $('#btn_approve,#btn_disable').click(function (e) {
        e.preventDefault();
        var count = $('.chk:checkbox:checked').length;
        if (count === 0) {
            showInfoNotification("Heç bir hesab seçilməyib!");
            return false;
        }
        var chk_array = [];
        $('input[type="checkbox"].chk:checked').each(function () {
            chk_array.push($(this).val());
        });
        var ids = [];
        for (i = 0; i < chk_array.length; i++) {
            var splitted = chk_array[i].split(',');
            ids.push(splitted[0]);
        }

        $.ajax({
            type: 'POST',
            url: '/Candidate/ApproveTickets',
            data: JSON.stringify({ ids: ids, type: $(this).text().trim() === 'Disable' ? '2' : '1' }),
            contentType: 'application/json',
            success: function (response) {
                if (response) {
                    window.location.replace('/Candidate/Index#success');
                    location.reload();
                } else {
                    showErrorNotification('Error occured.');
                }
            }
        });
    });
}


function FilterDate() {
    $('.daterange span').on('change', function () {
        $('#dt_range').val($('.daterange span').text());
        console.log($('#dt_range').val());
    });
}

function CreateEventHandler() {

    $('#chkAll').click(function () {
        $('input.chk:checkbox').prop('checked', this.checked);
        if ($('input.chk:checkbox').prop('checked')) {
            $('#tbl_ticket tr').addClass('highlight');
        } else
            $('#tbl_ticket tr').removeClass('highlight');
    });

    $(document).on('change', 'input.chk:checkbox', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass("highlight");
        } else {
            $(this).closest('tr').removeClass("highlight");
        }
    });

    $('#tbl_ticket').on('click', 'tbody tr', function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });
}

function displayOperationResult() {
    result = window.location.hash;
    if (result === '#success') {
        showSuccessNotification('Operation successfully executed.');
    }
    else if (result === '#error') {
        showErrorNotification('Error occured. Try again.');
    }
    window.location.hash = '';
}