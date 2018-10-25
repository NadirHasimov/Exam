
$(document).ready(function () {
    var windowheight = $(window).height();
    $("#divisionbox").css("min-height", windowheight - 50);

    function updatedatetime() {
        $("#lblToday").text(moment().format('MMM D YYYY'));
        $("#clock").text(moment().format('hh:mm:ss A'));
    }
    setInterval(updatedatetime, 1000);

    var isPaused = false;
    $("#start").hide();
    var max_time = 6;
    var cinterval;
    function countdown_timer() {
        if (!isPaused) {
            max_time--;
            document.getElementById('countdown').innerHTML = max_time;
            if (max_time == 0) {
                clearInterval(cinterval);
                var totalcount = $("#totalcount").text();
                if (totalcount < 20) {
                    loadnewitem();
                }
                else {
                    $(".finish_main_popup").show();
                    $(".finish_popup").show();
                    $(".finish_alert").hide();
                }
                max_time = 6;
                startcountdown();
            }
        }
    }

    function startcountdown() {
        cinterval = setInterval(countdown_timer, 1000);
    }
    startcountdown();
    $(".restart_demo").click(function () {
        $(".finish_main_popup").hide();
        loaditem();
        emplog();
    });

    $("#loadpagesize input, #examtype input").click(function () {
        $(".finish_main_popup").show();
        $(".finish_popup").hide();
        $(".finish_alert").show();
    });
    $(".close_popup").click(function () {
        $(".finish_main_popup").hide();
        $(".finish_alert").hide();
    });


    function addattempcount() {
        //totalattemp
        $(".running").find(".totalattemp").each(function () {
            var attempcount = $(this).text();
            var totalque = $(this).parents(".progress_box").find(".totalque").text();
            var attempcount = parseInt(attempcount);
            var addcount = attempcount + 2;
            if (addcount > totalque) {
                $(this).text("0");
                $(this).parents(".progress_box").find(".innerprogressmore").css("width", '0%');
            }
            else {
                $(this).text(addcount);
                $(this).parents(".progress_box").find(".innerprogressmore").css("width", addcount + '%');
            }

        });
    }

    var number = 0;
    function loadnewitem() {
        addattempcount();
        var name = 'Daniel Miller, Helen King, Paul Nelson, Margaret Carter, Donald Parker, Lisa Edwards, Kenneth Miller, Nancy Roberts, George Moore, Sandra Parker, Edward Clark, Donna Hall, Ronald Collins, Michelle Johnson, Kevin Walker';
        name = name.split(", ");
        var examname = 'Driver Licensing Exam, Sales Professional Exam, Technical Support Test, Java Programmer Exam, Summer Intern Test, Driver Licensing Exam, Sales Professional Exam, Technical Support Test, Java Programmer Exam, Summer Intern Test, Driver Licensing Exam, Sales Professional Exam, Technical Support Test, Java Programmer Exam, Summer Intern Test';
        examname = examname.split(", ");
        var status = '1, 2, 3, 1, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 4';
        status = status.split(", ");
        var attempcount = '0, 97, 11, 0, 99, 0, 97, 11, 0, 99, 0, 97, 11, 0, 99';
        attempcount = attempcount.split(", ");
        var percentege = '0, 48, 0, 0, 98, 0, 97, 11, 0, 99, 0, 97, 11, 0, 99';
        percentege = percentege.split(", ");
        var location = 'Seattle, WA, USA|Mountain View, CA, USA|Shenzhen, China|Sunnyvale, CA, USA|Moscow, Russia|Seattle, WA, USA|Mountain View, CA, USA|Shenzhen, China|Sunnyvale, CA, USA|Moscow, Russia|Seattle, WA, USA|Mountain View, CA, USA|Shenzhen, China|Sunnyvale, CA, USA|Moscow, Russia';
        location = location.split("|");
        var ipaddress = '37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94, 37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94, 37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94, 37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94';
        ipaddress = ipaddress.split(", ");

        // var date = '03 Dec 2014, 03 Dec 2014, 03 Dec 2014, 03 Dec 2014, 03 Dec 2014';
        //date = date.split(", ");
        var currentdate = moment().format('MMM D YYYY');
        var currenttime = moment().format('h:mmA');
        //        var time = '11:00AM, 11:44AM, 12:02PM, 12:36PM, 2:30PM';
        //        var time = time.split(", ");

        var divisionbox = '<div class="divisionbox col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px; border:solid 0px red;">';
        var datetimebox = '';
        var division = '<div class="division col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px; border:solid 0px black;">';

        var examstatus = '';
        if (status[number] == 1) {
            examstatus = '<span class="examstatus taking">Taking</span><span class="divvalue hidden">0</span>';
            division += '<div  class="showdiv running highlighttaking col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #fccb5f;  border-top:none; border-bottom:none;">';

            division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
            division += '<span class="takearrow"></span>';
            division += '<div class="circle" style="border-color:#fccb5f"><img src="../images/714.GIF" alt="Loading" /></div>';
            $('#takingcount').html(function (i, val) { return val * 1 + 1 });
        }
        if ((status[number] == 2) || (status[number] == 4)) {
            examstatus = '<span class="examstatus complete">Completed</span><span class="divvalue hidden">0</span>';
            division += '<div class="showdiv highlightcomplete col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #8dbf67;  border-top:none; border-bottom:none;">';
            division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
            division += '<span class="completearrow"></span>';
            division += '<div class="circle" style="border-color:#8dbf67"><span style="color:#8dbf67;" class="fa"></span></div>';
            $('#completecount').html(function (i, val) { return val * 1 + 1 });
        }
        if (status[number] == 3) {
            examstatus = '<span class="examstatus">Dropped</span><span class="divvalue hidden">0</span>';
            division += '<div  class="showdiv highlightdropped col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #fc6e59;  border-top:none; border-bottom:none;">';
            division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
            division += '<span class="droptedarrow"></span>';
            division += '<div class="circle" style="border-color:#fc6e59"><span style="color:#fc6e59;" class="fa"></span></div>';
            $('#dropptedcount').html(function (i, val) { return val * 1 + 1 });
        }
        $('#totalcount').html(function (i, val) { return val * 1 + 1 });


        division += '<div class="datetime hidden-xs">'
            + '<span class="date">' + currentdate + '</span>'
            + '<span class="time">' + currenttime + '</span>'
            + '</div>';
        division += '<span class="location hidden">' + location[number] + '</span>';
        division += '<span class="result hidden">' + percentege[number] + '</span>';
        division += '<span class="ipaddress hidden">' + ipaddress[number] + '</span>';

        division += '<div class="infobox col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px;">';
        division += '<span class="student_info col-lg-7 col-md-7 col-sm-7 col-xs-7"><span class="candidatename">' + name[number] + '</span><span class="examname">' + examname[number] + '</span></span>';

        division += '<span class="hidden">' + examstatus + '</span>';
        division += '<span class="progress_box text-right col-lg-5 col-md-5 col-sm-5 col-xs-5 attemp pull-right" ><span class="pull-left">Attempts</span><span class="pull-right"><span class="totalattemp">' + attempcount[number] + '</span> / <span class="totalque">100</span></span><span style="margin-top:2px;" class="progressmore"><span style="width:' + attempcount[number] + '%;" class="innerprogressmore"></span></span></span>';
        division += '</div>';
        division += '</div>';
        division += '<div class="moreinfobox col-lg-12 col-md-12 col-sm-12 col-xs-12 moreclose" style="padding:0px;"><span class="moreloading"><img src="../images/159.gif" alt="Loading" /> </span><span id="moreinfobox"></span></div>';
        division += '</div>';
        division += '</div>';
        divisionbox += division;
        divisionbox += '</div>';


        $(divisionbox).insertBefore("#divisionbox .divisionbox:first");

        $('.highlightcomplete').animate({ marginTop: '0px' }, 1000);
        $('.highlighttaking').animate({ marginTop: '0px' }, 1000);
        $('.highlightdropped').animate({ marginTop: '0px' }, 1000);


        var tr = '<tr class="highlight">';
        var icon = '<span style="color:green;" class="fa fa-long-arrow-up"></span>';
        tr += '<td>' + icon + ' <b>' + name[number] + '</b><td>Sign in</td><td>Just now</td>';
        $("#logtable .logtable tr:last").remove();
        $(tr).insertBefore("#logtable .logtable tr:first");

        setTimeout(function () {
            $("#logtable table tr").removeClass('highlight');
        }, 1000);
        //        number = number + 1;
        if (number < 14) {
            number = number + 1;
        }
        else {
            number = 0;
        }

        setTimeout(function () {
            $(".showdiv").removeClass("highlightcomplete highlighttaking highlightdropped");
        }, 1500);
    }


    function loaditem() {
        //alert("0");
        var datalength = 5;
        var divisionbox = '<div class="divisionbox col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px; border:solid 0px red;">';
        var datetimebox = '';

        var name = 'Steven Campbell, Mary Martinez, Michael Thompson, Barbara Scott, David Robinson, Elizabeth Adams, Joseph Nelson, Elizabeth Allen, Richard Thomas, Susan Scott';
        name = name.split(", ");
        var examname = 'Driver Licensing Exam, Sales Professional Exam, Technical Support Test, Java Programmer Exam, Summer Intern Test, Driver Licensing Exam, Sales Professional Exam, Technical Support Test, Java Programmer Exam, Summer Intern Test';
        examname = examname.split(", ");
        var status = '1, 2, 3, 1, 4, 1, 2, 3, 1, 4';
        status = status.split(", ");
        var attempcount = '77, 98, 11, 96, 100, 77, 98, 11, 96, 100';
        attempcount = attempcount.split(", ");
        var percentege = '0, 48, 0, 0, 98, 0, 67, 0, 0, 78';
        percentege = percentege.split(", ");
        var location = 'Seattle, WA, USA|Mountain View, CA, USA|Shenzhen, China|Sunnyvale, CA, USA|Moscow, Russia|Seattle, WA, USA|Mountain View, CA, USA|Shenzhen, China|Sunnyvale, CA, USA|Moscow, Russia';
        location = location.split("|");
        var ipaddress = '37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94, 37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94, 37.228.107.105, 106.216.41.27, 70.39.185.232, 141.0.9.154, 106.76.127.94';
        ipaddress = ipaddress.split(", ");
        var timeminus = 20;
        for (var i = 0; i < datalength; i++) {
            var division = '<div class="division col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px; border:solid 0px black;">';
            var stardate = moment().subtract('minutes', timeminus).format('MMM D YYYY');
            var starttime = moment().subtract('minutes', timeminus).format('h:mmA');
            var examstatus = '';
            if (status[i] == 1) {
                examstatus = '<span class="examstatus taking">Taking</span><span class="divvalue hidden">0</span>';
                division += '<div  class="showdiv running col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #fccb5f;  border-top:none; border-bottom:none;">';

                division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
                division += '<span class="takearrow"></span>';
                division += '<div class="circle" style="border-color:#fccb5f"><img src="../images/714.GIF" alt="Loading" /></div>';
            }
            if ((status[i] == 2) || (status[i] == 4)) {
                examstatus = '<span class="examstatus complete">Completed</span><span class="divvalue hidden">0</span>';
                division += '<div class="showdiv col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #8dbf67;  border-top:none; border-bottom:none;">';
                division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
                division += '<span class="completearrow"></span>';
                division += '<div class="circle" style="border-color:#8dbf67"><span style="color:#8dbf67;" class="fa"></span></div>';
            }
            if (status[i] == 3) {
                examstatus = '<span class="examstatus">Dropped</span><span class="divvalue hidden">0</span>';
                division += '<div  class="showdiv col-lg-7 col-md-7 col-sm-10 col-xs-11" style="padding:0px; border-left:solid 4px #fc6e59;  border-top:none; border-bottom:none;">';
                division += '<div class="inner-div col-lg-12 col-md-12 col-sm-12 col-xs-12">';
                division += '<span class="droptedarrow"></span>';
                division += '<div class="circle" style="border-color:#fc6e59"><span style="color:#fc6e59;" class="fa"></span></div>';
            }

            division += '<div class="datetime hidden-xs">'
                + '<span class="date">' + stardate + '</span>'
                + '<span class="time">' + starttime + '</span>'
                + '</div>';
            division += '<span class="location hidden">' + location[i] + '</span>';
            division += '<span class="result hidden">' + percentege[i] + '</span>';
            division += '<span class="ipaddress hidden">' + ipaddress[i] + '</span>';

            timeminus = timeminus + 20;

            division += '<div class="infobox col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding:0px;">';
            division += '<span class="student_info col-lg-7 col-md-7 col-sm-7 col-xs-7"><span class="candidatename">' + name[i] + '</span><span class="examname">' + examname[i] + '</span></span>';
            division += '<span class="hidden">' + examstatus + '</span>';
            division += '<span class="progress_box text-right col-lg-5 col-md-5 col-sm-5 col-xs-5 attemp pull-right" ><span class="pull-left">Attempts</span><span class="pull-right"><span class="totalattemp">' + attempcount[i] + '</span> / <span class="totalque">100</span></span><span style="margin-top:2px;" class="progressmore"><span style="width:' + attempcount[i] + '%;" class="innerprogressmore"></span></span></span>';
            division += '</div>';
            division += '</div>';
            division += '<div class="moreinfobox col-lg-12 col-md-12 col-sm-12 col-xs-12 moreclose" style="padding:0px;"><span class="moreloading"><img src="../images/159.gif" alt="Loading" /> </span><span id="moreinfobox"></span></div>';
            division += '</div>';
            division += '</div>';
            divisionbox += division;
        }

        divisionbox += '</div>';
        $("#divisionbox").html(divisionbox).show();
        $("#leftdatetimebox").html(datetimebox);

        $("#takingcount").text("2");
        $("#completecount").text("2");
        $("#dropptedcount").text("1");
        $("#totalcount").text("5");
    }
    loaditem();


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

            if (day > 0) {
                timediff = "<b>" + day + "</b> days <b>" + hour + "</b> hour <b>" + minute + "</b> minute ago";
            }
            else {
                if (hour > 0) {
                    if (minute > 1) {
                        timediff = "<b>" + hour + "</b> hour <b>" + minute + "</b> minutes ago";
                    }
                    else {
                        timediff = "<b>" + hour + "</b> hour <b>" + minute + "</b> minute ago";
                    }
                }
                else {
                    if (minute > 1) {
                        timediff = "<b>" + minute + "</b> minutes ago";
                    }
                    else {
                        timediff = "<b>" + minute + "</b> minute ago";
                    }
                }
            }
            var examstatus = $(this).parents(".showdiv").find(".examstatus").text();
            var locations = $(this).parents(".showdiv").find(".location").text();
            var percentage = $(this).parents(".showdiv").find(".result").text();
            var ipaddress = $(this).parents(".showdiv").find(".ipaddress").text();


            var moreinfo = '<div>';
            var result = '';

            if (examstatus == "Completed") {
                moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa  fa-clock-o"></span> Finished: </span><span class="more_righttext">' + timediff + '</span></span>';

                if (percentage < 50) {
                    result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Result: </span><span class="more_righttext"  style="line-height:normal;"><span style="display:block;">Fail (' + percentage + '%) </span><span class="progressmore"><span style="width:' + percentage + '%; background-color:red;" class="innerprogressmore"></span></span></span></span>';
                }
                else {
                    result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Result: </span><span class="more_righttext" style="line-height:normal;"><span style="display:block;">Pass (' + percentage + '%) </span><span class="progressmore"><span style="width:' + percentage + '%; background-color:green;" class="innerprogressmore"></span></span></span></span>';
                }
            }
            else {
                moreinfo += '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa  fa-clock-o"></span> Started: </span><span class="more_righttext">' + timediff + '</span></span>';
                result = '<span class="more_info col-lg-12 col-md-12 col-sm-12 col-xs-12"><span class="more_lefttext"><span class="fa fa-pie-chart"></span> Result: </span><span class="more_righttext"><span style="display:block; color:#999;">Not Genrated</span></span></span>';
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

    $("#start").click(function (e) {
        $(".inner-div").find(".divvalue").text("0");
        $(".inner-div").parents(".showdiv").find(".moreinfobox").addClass("moreclose").removeClass("moreopen");
        $(".inner-div").parents(".showdiv").find(".circle .fa").removeClass("fa-check");
        $(".inner-div").parents(".showdiv").removeClass("box_shadow");
        e.preventDefault();
        isPaused = false;
        $("#start").hide();
    });



    emplog();
    function emplog() {
        var name = 'Steven Campbell, Mary Martinez, Michael Thompson, Barbara Scott, David Robinson, Elizabeth Adams, Joseph Nelson, Elizabeth Allen, Richard Thomas, Susan Scott';
        name = name.split(", ");
        var logstatus = 'Sign in, Sign out, Sign in, Sign out, Sign in, Sign out, Sign in, Sign out, Sign in, Sign out';
        logstatus = logstatus.split(", ");
        var table = '<table  cellpadding="0" cellspacing="0" class="logtable">';

        var timeminus = 20;
        for (var i = 0; i < 10; i++) {
            var currenttime = moment();
            var starttime = moment().subtract('minutes', timeminus);

            var ms = moment(currenttime, "MMM D YYYY h:mmA").diff(moment(starttime, "MMM D YYYY h:mmA"));
            var d = moment.duration(ms);
            var hour = Math.floor(d.asHours());
            var minute = Math.floor(d.minutes());
            if (hour > 0) {
                var difftime = hour + " hour " + minute + " minutes ago";
                //  var tr = '<tr>';
            }
            else {
                if (minute > 0) {
                    if (minute == 1) {
                        var difftime = minute + " minute ago";
                        // var tr = '<tr>';
                    }
                    else {
                        var difftime = minute + " minutes ago";
                        //var tr = '<tr>';
                    }
                }
                else {
                    var difftime = "Just now";
                    //var tr = '<tr class="highlight">';
                }
            }

            var tr = '<tr>';
            if (logstatus[i] == "Sign in") {
                var icon = '<span style="color:green;" class="fa fa-long-arrow-up"></span>';
            }
            else {
                var icon = '<span style="color:red;" class="fa fa-long-arrow-down"></span>';
            }
            tr += '<td>' + icon + ' <b>' + name[i] + '</b><td>' + logstatus[i] + '</td><td>' + difftime + '</td>';
            tr += '</tr>';
            table += tr;
            timeminus = timeminus + 20;
        }
        table += '</table>';
        $("#logtable").html(table);

    }
});