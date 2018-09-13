using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Exam.DomainModels
{
    public class ExamDomainModel
    {
        public int ID { get; set; }

        public string QuestionText { get; set; }

        public string QuestionImage { get; set; }

        public string QuestionImageUrl { get; set; }

        public string AnswerImageUrl { get; set; }

        public string AnswerImageUrlA { get; set; }

        public string AnswerImageUrlB { get; set; }

        public string AnswerImageUrlC { get; set; }

        public string AnswerImageUrlD { get; set; }

        public string AnswerImageUrlE { get; set; }

        public string AnswerTextA { get; set; }

        public string AnswerTextB { get; set; }

        public string AnswerTextC { get; set; }

        public string AnswerTextD { get; set; }

        public string AnswerTextE { get; set; }

        public int SubCategoryId { get; set; }

        public int ParentCategoryId { get; set; }

        public string Variants { get; set; }

        public string Parent { get; set; }

        public string Sub { get; set; }

        public int Status { get; set; }

        public string Creator { get; set; }

        public string CreateDate { get; set; }
    }
}