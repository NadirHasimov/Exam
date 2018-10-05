using Exam.Utils;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Exam.Models
{
    //[ValidateTextAndImage(new string[] { "QuestionText", "QuestionImage" })]
    public class ExamViewModel : IValidatableObject
    {
        public int ID { get; set; }

        public string QuestionText { get; set; }

        //[Required]
        public HttpPostedFileBase QuestionImage { get; set; }

        public HttpPostedFileBase AnswerImageA { get; set; }

        public HttpPostedFileBase AnswerImageB { get; set; }

        public HttpPostedFileBase AnswerImageC { get; set; }

        public HttpPostedFileBase AnswerImageD { get; set; }

        public HttpPostedFileBase AnswerImageE { get; set; }

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

        public int Status { get; set; }

        public int HdnUpdateStatus { get; set; }

        public string Creator { get; set; }

        public DateTime CreateDate { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (String.IsNullOrEmpty(QuestionText) && QuestionImage == null)
            {
                yield return new ValidationResult("You must enter all " +
                       "three parts of the number.");
            }

        }
    }
    public class array
    {
        public string parent { get; set; }
        public string child { get; set; }
    }
}
