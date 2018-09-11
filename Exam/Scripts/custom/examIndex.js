var table;
$(document).ready(function () {
    CreateDataTable();
    Finish();
    ViewList();
    GoToQuestion();
    CreateTimer();
    ViewPicture();
});

//function CallbackFunction(event) {
//    if (window.event) {
//        if (window.event.clientX < 40 && window.event.clientY < 0) {
//            alert("back button is clicked");
//        } else {
//            alert($('#timer').html());
//        }
//    } else {
//        if (event.currentTarget.performance.navigation.type == 2) {
//            alert("back button is clicked");
//        }
//        if (event.currentTarget.performance.navigation.type == 1) {
//            alert($('#timer').html());
//        }
//    }
//}

function CreateDataTable() {
    table = $('#question').DataTable({
        "aLengthMenu": [[5], [5]],
        "ordering": false,
        "bLengthChange": false,
        "bFilter": false,
        "bInfo": false
    });
}
function ViewPicture() {
    $('.ap').click(function () {
        var src = $(this).attr('src');
        $('#picture').attr('src', src);
        $('#pic').modal('show').appendTo('body');
    });
    $('.qp').click(function () {
        var src = $(this).attr('src');
        $('#picture').attr('src', src);
        $('#pic').modal('show').appendTo('body');
    });
}
function Finish() {
    var answer = {
        id: "",
        variant: ""
    }
    var counter = 0, ticketId;
    var answers = [];
    console.log($('#confirm').html());

    $('#confirm').on('click', function () {
        console.log(0);
        answers = [];
        table.$('td').each(function () {
            counter++;
            if (counter === 1) {
                answer.id = $(this).find('input[name="TicketDetailId"]').val();
            }
            answer.variant = $(this).find('input[name = "variant"]:checked').val();
            if (answer.variant != null) {
                answers.push(answer);
                answer = {};
            }
            if (counter === 5) {
                counter = 0;
            }
        });
        $.each(answers, function (i, w) {
            console.log(w.id + '  ' + w.variant);
        });
        ticketId = $('#TicketId').val();
        console.log(ticketId);
        $.ajax({
            type: 'POST',
            url: '/Exam/Finish',
            data: { answers: answers, TicketId: ticketId, Time: $('#timer').html() },
            success: function (response) {
                console.log(1);
                if (response) { 
                    $('#tbl_result tbody tr').append('<td>' + response.trueAnswerCount + '</td>');
                    $('#tbl_result tbody tr').append('<td>' + response.falseAnswerCount + '</td>');
                    $('#tbl_result tbody tr').append('<td>' + response.blankedAnswerCount + '</td>');
                    $('#resultModal').modal('show').appendTo('body');
                } else {
                    showInfoNotification('Error');
                }
            },
            error: function () {
                showErrorNotification('Error!');
            }
        });
    });
    $('#ok').click(function () {
        //$.cookie('.ASPXAUTH', null, { path: '/' });
        $.removeCookie('.ASPXAUTH', { path: '/' });
        window.location.replace('../User/SignIn');
    });
}
var question = {
    index: '',
    variant: ''
};
var questions = [];
//todo
function ViewList() {
    var answer = {
        id: "",
        variant: ""
    }
    var counter = 0, index, inner = 0;
    var answers = [];
    var a = 0, b = 0;
    var s = null, v = null, t = null, o = null, lt = null, l = null;
    $('#viewList').click(function () {
        a = 0;
        b = 0;
        questions = [];
        table.$('td').each(function (i) {

            v = $(this).find('input[name = "variant"]').val();
            t = $(this).find('input[name = "variant"]:checked').val();
            s = t == null ? s : t;

            lt = $(this).find('label.order').html();
            l = lt == null ? l : lt;
            //console.log(lt + '  ' + l);
            if (v === 'E') {
                o = $(this).find('input[name="order"]').val();
                s = s != null ? s : '-';
                //console.log(s + '  ' + l);
                question.index = l;
                question.variant = s;
                questions.push(question);
                question = {};
                s = null;
                lt = null;
            }
        });
        $.each(questions, function (i, w) {
            //console.log(w.variant + '  ' + w.index);
        });
        if (parseInt($('#tblState').val()) === 0) {

            $('.list td').each(function (i) {
                ht = $(this);
                index = parseInt($(this).html());

                $.each(questions, function (i, w) {
                    if (index === parseInt(w.index)) {
                        $(ht).html('<a href="#" class="ques">' + w.index + ' ' + w.variant + '</a>');
                        console.log(w.index + ' ' + w.variant + ' ' + index);
                    }
                });

                if (index > 10 && 21 > index) {
                    a++;
                    $('.list tr:nth-child(' + a + ')').append($(this));
                }
                else if (index > 20 && 31 > index) {
                    a++;
                    $('.list tr:nth-child(' + (a % 10 === 0 ? 10 : a % 10) + ')').append($(this));
                } else if (index > 30 && 41 > index) {
                    a++;
                    $('.list tr:nth-child(' + (a % 10 === 0 ? 10 : a % 10) + ')').append($(this));
                } else if (index > 40 && 51 > index) {
                    a++;
                    $('.list tr:nth-child(' + (a % 10 === 0 ? 10 : a % 10) + ')').append($(this));
                } else if (index > 50 && 61 > index) {
                    a++;
                    $('.list tr:nth-child(' + (a % 10 === 0 ? 10 : a % 10) + ')').append($(this));
                }
            });
        } else {
            $('.list td').each(function (i) {
                ht = $(this);
                index = parseInt($(this).find('a').html());
                console.log(index);
                $.each(questions, function (i, w) {
                    if (index === parseInt(w.index)) {
                        $(ht).html('<a href="#" class="ques">' + w.index + ' ' + w.variant + '</a>');
                        console.log(w.index + ' ' + w.variant + ' ' + index);
                    }
                });
            });
        }
        $('#tblState').val(1);
        //console.log(questions);
    });
}

function GoToQuestion() {
    $('.list').on('click', 'a.ques', function () {
        $('#quesList').modal('hide');
        table.page(parseInt($(this).html()) - 1).draw('page');
    });
}

function CreateTimer() {
    var timer = $('#timer').html();
    timer = timer.split(':');
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    var interval = setInterval(function () {
        seconds -= 1;
        if (parseInt(minutes) < 5) {
            $('#timer').toggleClass('last-minute');
        }
        if (minutes < 0) return clearInterval(interval);
        if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
        if (seconds < 0 && minutes != 0) {
            minutes -= 1;
            seconds = 59;
        }
        else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
        $('#timer').html(minutes + ':' + seconds);

        if (minutes == 0 && seconds == 0) {
            $('#confirm').click();
            clearInterval(interval);
        }
    }, 1000);
    $('#stop').click(function () {
        clearInterval(interval);
    });
    $('#start').click(function () {
        clearInterval(interval);
        interval = setInterval(function () {
            var timer = $('#timer').html();
            timer = timer.split(':');
            var minutes = parseInt(timer[0], 10);
            var seconds = parseInt(timer[1], 10);
            seconds -= 1;
            if (parseInt(minutes) < 5) {
                $('#timer').toggleClass('last-minute');
            }
            console.log(minutes);
            if (minutes < 0) return clearInterval(interval);
            if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
            if (seconds < 0 && minutes != 0) {
                minutes -= 1;
                seconds = 59;
            }
            else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
            $('#timer').html(minutes + ':' + seconds);

            if (minutes == 0 && seconds == 0)
                clearInterval(interval);
        }, 1000);
    });

    $('#show').click(function () {
        $('#timer').show();
    });

    $('#hide').click(function () {
        $('#timer').hide();
    });

    $('#timer').click(function () {
        $("#timer").toggleClass('color');
    });

    $('#confirm').click(function () {
        clearInterval(interval);
    });
}
