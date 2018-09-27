using Exam.DALC;
using Exam.DomainModels;
using Exam.Models;
using Exam.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Exam.Controllers
{
    [AuthorizeController]
    [OutputCache(NoStore = true, Duration = 0)]
    public class CandidateController : Controller
    {
        // GET: Candidate
        public ActionResult Index(string dt_range)
        {
            CandidateViewModel tickets = new CandidateViewModel();
            string[] dates = { };
            tickets.Candidates = TicketDALC.GetTickets().Select(row => MapToCandidateViewModel(row)).ToList();
            if (!string.IsNullOrEmpty(dt_range))
            {
                dates = dt_range.Split('-');
                tickets.Candidates = tickets.Candidates.Where(c =>
                              (c.ExamDate > DateTime.Parse(dates[0]) && c.ExamDate < DateTime.Parse(dates[1])) || dates.Length == 0).ToList();
            }
            return View(tickets);
        }

        public ActionResult GetCandidate(string finCode)
        {
            var candidate = CandidateDALC.GetCandidateByFin(finCode);
            return Json(new { candidate = candidate }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult AddCandidate(CandidateViewModel viewModel)
        {
            var result = CandidateDALC.Add(MapToCandidateDomainModel(viewModel));
            return Json(new { result = result.Item1, message = result.Item2, ID = result.Item3 }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProfessions() => Json(CandidateDALC.GetProfessions(), JsonRequestBehavior.AllowGet);

        public ActionResult ApproveTickets(int[] ids, int type)
        {
            bool result = TicketDALC.ApproveTickets(ids, type);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public ActionResult List()
        {
            CandidateViewModel model = new CandidateViewModel();
            model.Candidates = CandidateDALC.GetList().Select(row => MapToCandidateViewModel(row)).ToList();
            return View(model);
        }

        private CandidateModel MapToCandidateDomainModel(CandidateViewModel viewModel)
        {
            return new CandidateModel
            {
                ID = viewModel.ID,
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                MiddleName = viewModel.MiddleName,
                FinCode = viewModel.FinCode,
                Mail = viewModel.Mail,
                Birthdate = viewModel.Birthdate,
                FamilyStatusId = viewModel.FamilyStatusId,
                GenderId = viewModel.GenderId,
                Profession = viewModel.Profession,
                ExamDate = viewModel.ExamDate,
                ExamTime = viewModel.ExamTime,
                ProfessionId = viewModel.ProfessionId,
                ExamProfessionId = viewModel.ExamProfessionId,
                Mobile = viewModel.Mobile,
                Status = viewModel.Status,
                Finish = viewModel.Finish
            };
        }

        private CandidateViewModel MapToCandidateViewModel(CandidateModel domainModel)
        {
            return new CandidateViewModel
            {
                ID = domainModel.ID,
                FirstName = domainModel.FirstName,
                LastName = domainModel.LastName,
                MiddleName = domainModel.MiddleName,
                FinCode = domainModel.FinCode,
                Mail = domainModel.Mail,
                Birthdate = domainModel.Birthdate,
                ExamDate = domainModel.ExamDate,
                ExamTime = domainModel.ExamTime,
                FamilyStatusId = domainModel.FamilyStatusId,
                GenderId = domainModel.GenderId,
                Profession = domainModel.Profession,
                ProfessionId = domainModel.ProfessionId,
                ExamProfessionId = domainModel.ExamProfessionId,
                Mobile = domainModel.Mobile,
                Status = domainModel.Status,
                Finish = domainModel.Finish
            };
        }
    }
}