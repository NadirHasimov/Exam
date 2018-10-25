var timing = 3000;

$(document).ready(function () {
    var input = $('#single-input').clockpicker({
        placement: 'bottom',
        align: 'left',
        autoclose: true,
        default: '00:00'
    });

    // Manually toggle to the minutes view
    $('#check-minutes').click(function (e) {
        // Have to stop propagation here
        e.stopPropagation();
        $('#single-input').val('0:' + $('#single-input').val());
        input.clockpicker('show')
            .clockpicker('toggleView', 'minutes');
    });

    $('#refresh').on('click', function () {
        Refresh();
    });

    $('#single-input').change(function () {
        minute = $(this).val();
        $(this).val(minute.split(':')[1]);
        console.log($(this).val());
    });
    loop();
    setInterval(updatedatetime, 1000);
});
var minute = 1;
function loop() {
    Refresh();
    window.setTimeout(loop, timing);
    if ($('#single-input').val() && parseInt($('#single-input').val()) !== 0) {
        minute = parseInt($('#single-input').val());
    }
    else {
        minute = 3;
    }
    timing = minute * 1000;
}
function updatedatetime() {
    $("#lblToday").text(moment().format('MMM D YYYY'));
    $("#clock").text(moment().format('hh:mm:ss A'));
}

$(document).on('click', '.inner-div', function (e) {
    $(".moreloading").show();
    $(this).parents("#divisionbox").find(".showdiv").removeClass("box_shadow");
    $(this).parents("#divisionbox").find(".circle .fa").removeClass("fa-check");
    $(this).parents("#divisionbox").find(".moreinfobox").addClass("moreclose").removeClass("moreopen");
    var value = $(this).find(".divvalue").text();
    $(this).parents("#divisionbox").find(".divvalue").text("0");

    if (value == 1) {
        $(this).find(".divvalue").text("0");
        $(this).parents(".showdiv").find(".moreinfobox").addClass("moreclose").removeClass("moreopen");
        $(this).parents(".showdiv").find(".circle .fa").removeClass("fa-check");
        $(this).parents(".showdiv").removeClass("box_shadow");
        e.preventDefault();
        isPaused = false;
        $("#start").hide();
    }
    else {
        $(this).find(".divvalue").text("1");
        $(this).parents(".showdiv").find(".moreinfobox").addClass("moreopen").removeClass("moreclose");
        $(this).parents(".showdiv").find(".circle .fa").addClass("fa-check");
        $(this).parents(".showdiv").addClass("box_shadow");
        e.preventDefault();
        isPaused = true;
        $("#start").show();

        var timediff = '';
        var startdate = $(this).parents(".showdiv").find(".date").text();
        var starttime = $(this).parents(".showdiv").find(".time").text();

        var startdatetime = startdate + " " + starttime;
        var currentdatetime = moment().format('MMM D YYYY h:mmA');

        var ms = moment(currentdatetime, "MMM D YYYY h:mmA").diff(moment(startdatetime, "MMM D YYYY h:mmA"));
        var d = moment.duration(ms);
        var day = Math.floor(d.asDays());
        var hour = Math.floor(d.hours());
        var minute = Math.floor(d.minutes());

        //if (day > 0) {
        //    timediff = "<b>" + day + "</b> days <b>" + hour + "</b> hour <b>" + minute + "</b> minute ago";
        //}
        //else {
        //    if (hour > 0) {
        //        if (minute > 1) {
        //            timediff = "<b>" + hour + "</b> hour <b>" + minute + "</b> minutes ago";
        //        }
        //        else {
        //            timediff = "<b>" + hour + "</b> hour <b>" + minute + "</b> minute ago";
        //        }
        //    }
        //    else {
        //        if (minute > 1) {
        //            timediff = "<b>" + minute + "</b> minutes ago";
        //        }
        //        else {
        //            timediff = "<b>" + minute + "</b> minute ago";
        //        }
        //    }
        //}
        var examstatus = $(this).parents(".showdiv").find(".examstatus").text();
        var locations = $(this).parents(".showdiv").find(".location").text();
        var percentage = $(this).parents(".showdiv").find(".result").text();
        var ipaddress = $(this).parents(".showdiv").find(".ipaddress").text();


        var moreinfo = '<div>';
        var result = '';

        if (examstatus == "Completed") {
            moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa  fa-clock-o"></span> Bitib: </span><span class="more_righttext">' + startdate + ' / ' + starttime + '</span></span>';

            if (percentage < 50) {
                result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Nəticə: </span><span class="more_righttext"  style="line-height:normal;"><span style="display:block;">Kəsilib (' + percentage + '%) </span><span class="progressmore"><span style="width:' + percentage + '%; background-color:red;" class="innerprogressmore"></span></span></span></span>';
            }
            else {
                result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Nəticə: </span><span class="more_righttext" style="line-height:normal;"><span style="display:block;">Keçib (' + percentage + '%) </span><span class="progressmore"><span style="width:' + percentage + '%; background-color:green;" class="innerprogressmore"></span></span></span></span>';
            }
        }
        else {
            moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa  fa-clock-o"></span> Başlama vaxtı: </span><span class="more_righttext">' + startdate + ' / ' + starttime + '</span></span>';
            result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Nəticə: </span><span class="more_righttext"><span style="display:block; color:#999;">Not Genrated</span></span></span>';
        }
        moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12" ><span class="more_lefttext"><span class="fa fa-map-marker"></span> IP Address: </span><span class="more_righttext" style="line-height:normal;"><span style="display:block;">' + ipaddress + '</span><span class="right-small">' + locations + '</span></span></span>';
        moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12" ><span class="more_lefttext"><span class="fa fa-square-o"></span> Platform: </span><span class="more_righttext" style="line-height:normal;"><span style="display:block;">Windows</span><span class="right-small"> Firefox (33.0)</span></span></span>';
        moreinfo += result;


        moreinfo += '</div>';
        $(".moreopen").parents(".showdiv").find("#moreinfobox").html(moreinfo);
        setTimeout(function () {
            $(".moreloading").hide();
        }, 500);
    }
});

function Refresh() {
    clearInterval();
    //$('#refresh').on('click', function () {
    $.ajax({
        type: 'GET',
        url: '/Exam/_Monitor',
        data: { dateRange: $('#reportrange span').html() },
        success: function (response) {
            $('#divisionbox').html(response);
            console.log(response);
        }
    });
    //console.log($('#reportrange span').html());
    //});

}