using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Exam.DomainModels
{
    public class ExamMonitor
    {
        public int TicketId { get; set; }
        public string IP { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Fin_code { get; set; }
        public string BeginTime { get; set; }
        public string EndTime { get; set; }
        public string Profession { get; set; }
        public int Finish { get; set; }
        public int ApprStatus { get; set; }
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
        public int QuestionCount { get; set; }
        public int AnsweredQuestionCount { get; set; }
    }
}