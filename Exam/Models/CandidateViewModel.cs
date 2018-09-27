using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Exam.Models
{
    public class CandidateViewModel
    {
        public int ID { get; set; }

        public string FinCode { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public DateTime Birthdate { get; set; }

        public string Mail { get; set; }

        public string Profession { get; set; }

        public int ExamProfessionId { get; set; }

        public int ProfessionId { get; set; }

        public int GenderId { get; set; }

        public int FamilyStatusId { get; set; }

        public DateTime ExamDate { get; set; }

        public string ExamTime { get; set; }

        public string Mobile { get; set; }

        public string Status { get; set; }

        public string Description { get; set; }

        public List<CandidateViewModel> Candidates { get; set; }

        public bool Finish { get; set; }
    }
}