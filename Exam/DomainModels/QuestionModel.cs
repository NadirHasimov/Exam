using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Exam.DomainModels
{
    public class QuestionModel
    {
        public int ID { get; set; }

        public string QuestionText { get; set; }

        public string AnswerTextA { get; set; }

        public string AnswerText { get; set; }

        public string AnswerTextB { get; set; }

        public string AnswerTextC { get; set; }

        public string AnswerTextD { get; set; }

        public string AnswerTextE { get; set; }

        public string QuestionImageUrl { get; set; }

        public string AnswerImageUrl { get; set; }

        public string AnswerImageUrlA { get; set; }

        public string AnswerImageUrlB { get; set; }

        public string AnswerImageUrlC { get; set; }

        public string AnswerImageUrlD { get; set; }

        public string AnswerImageUrlE { get; set; }

        public char Variant { get; set; }

        public bool IsCorrectAnswer { get; set; }

        public int ParentId { get; set; }

        public int SubId { get; set; }

        public int Status { get; set; }

        public int TicketDetailId { get; set; }

        public int OrderNumber { get; set; }

        public int TicketId { get; set; }

        public string Time { get; set; }

        public string Category { get; set; }

    }
}