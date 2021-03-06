﻿using DevExpress.Web.Mvc;
using Exam.DALC;
using Exam.DomainModels;
using Exam.Models;
using Exam.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Exam.Controllers
{
    [Log]
    public class ExamController : Controller
    {
        [AuthorizeExam]
        public ActionResult Index()
        {
            var referer = Request.ServerVariables["http_referer"];
            if (!User.Identity.IsAuthenticated)
            {
                return View("SignIn", "Home");
            }
            var questions = TicketDALC.GetCandQuestions(User.Identity.Name).Select(row => MapToQuestionViewModel(row)).ToList();
            TicketDALC.UpdateTicketFinish(questions.FirstOrDefault().TicketId);
            if (questions.Count == 0)
            {
                FormsAuthentication.SignOut();
                return new RedirectResult(Url.Action("SignIn", "User"));
            }
            return View(questions);
        }

        //todo finish authorize
        [HttpPost]
        public ActionResult Finish(Answer[] answers, int TicketId, string Time)
        {
            var time = Time.Split(':');
            int minute = int.Parse(time[0]);
            bool status = TicketDALC.Finish(answers, minute, TicketId);
            if (status)
            {
                var result = ExamDALC.GetResult(TicketId);

                return Json(new
                {
                    result
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        [AuthorizeExam]
        public ActionResult GetResult(int TicketId)
        {
            var result = ExamDALC.GetResult(TicketId);


            return Json(new
            {
                result
            }, JsonRequestBehavior.AllowGet);
        }

        [AuthorizeController]
        public ActionResult Insert()
        {
            var referer = Request.ServerVariables["http_referer"];
            var categoreis = ExamDALC.GetCategories();
            ViewBag.parentCategories = categoreis.Where(row => row.Item3 == 0).OrderBy(row => row.Item1).ToList();
            ViewBag.subCategories = categoreis.Where(row => row.Item3 == 1).ToList();
            ViewBag.questions = ExamDALC.GetQuestions();
            return View();
        }

        [HttpPost]
        [AuthorizeController]
        public ActionResult Insert(ExamViewModel model)
        {
            var categoreis = ExamDALC.GetCategories();
            if (!ModelState.IsValid)
            {
                ViewBag.parentCategories = categoreis.Where(row => row.Item3 == 0).ToList();
                ViewBag.subCategories = categoreis.Where(row => row.Item3 == 1).ToList();
                ViewBag.questions = ExamDALC.GetQuestions();
                return View();
            }
            bool result = false;
            string message = "";

            result = ExamDALC.InsertQuestion(MaptoExamDomainModel(model));
            message = result ? model.ID > 0 ? "#successE" : "#successI" : "#error";
            //var categoreis = ExamDALC.GetCategories();
            ViewBag.parentCategories = categoreis.Where(row => row.Item3 == 0).ToList();
            ViewBag.subCategories = categoreis.Where(row => row.Item3 == 1).ToList();
            ViewBag.questions = ExamDALC.GetQuestions();
            return new RedirectResult(Url.Action("Insert", "Exam") + message);
        }

        [HttpPost]
        public JsonResult Feedback(string text, int id) => Json(ExamDALC.Feedback(text, id), JsonRequestBehavior.AllowGet);

        public JsonResult GetFeedback(int id) => Json(ExamDALC.GetFeedback(id), JsonRequestBehavior.AllowGet);

        [AuthorizeController]
        public ActionResult QuestionLimit()
        {
            TempData["Prof"] = "";
            ViewBag.Departments = ExamDALC.GetProfs();
            ViewBag.ParentCategories = ExamDALC.GetCategories().Where(r => r.Item3 == 0).ToList();
            return View();
        }

        [HttpPost]
        public JsonResult GetProfs(string parent)
        {
            int id = 0;
            List<Tuple<int, string, int, string>> profs;
            try
            {
                id = int.Parse(parent);
                profs = ExamDALC.GetProfs(id);
            }
            catch
            {
                profs = new List<Tuple<int, string, int, string>>();
            }
            return Json(new { profs = profs, JsonRequestBehavior.AllowGet });
        }

        [HttpPost]
        public JsonResult AddQuesLimit(int count, int limit, string subId, string parentId, array[] array)
            => Json(ExamDALC.AddQuesLimit(count, limit, subId, parentId, array), JsonRequestBehavior.AllowGet);

        public ActionResult GetProfLimits()
        {

            return View();
        }

        [AuthorizeController]
        public ActionResult GetQuestion(int id)
        {
            var question = ExamDALC.GetQuestion(id).Select(row => MapToQuestionViewModel(row)).ToList();
            return Json(new { question = question }, JsonRequestBehavior.AllowGet);
        }

        [AuthorizeExam]
        public ActionResult Agreement(string finCode)
        {
            var candidate = CandidateDALC.GetCandidateByFin(finCode, 0);

            var candidateViewModel = new CandidateViewModel();
            candidateViewModel.FirstName = candidate.FirstName;
            candidateViewModel.LastName = candidate.LastName;
            candidateViewModel.MiddleName = candidate.MiddleName;
            candidateViewModel.FinCode = candidate.FinCode;
            candidateViewModel.TicketId = candidate.TicketID;
            return View(candidateViewModel);
        }

        [AuthorizeController]
        public ActionResult Monitor()
        {
            var exams = TicketDALC.GetExams();
            return View(exams);
        }

        [AuthorizeController]
        public ActionResult _Monitor(string dateRange)
        {
            return View("_Monitor", TicketDALC.GetExams(dateRange));
        }

        [HttpPost]
        public JsonResult UpdateDepart(int id, string text) => Json(ExamDALC.UpdateDepart(id, text), JsonRequestBehavior.AllowGet);

        [HttpPost]
        public JsonResult UpdateCategory(int id, string text) => Json(ExamDALC.UpdateCategory(id, text), JsonRequestBehavior.AllowGet);

        [HttpPost]
        public JsonResult DeleteDepart(int id) => Json(ExamDALC.DeleteDepart(id), JsonRequestBehavior.AllowGet);

        [HttpPost]
        public JsonResult DeleteCategory(int id) => Json(ExamDALC.DeleteCategory(id), JsonRequestBehavior.AllowGet);

        public JsonResult GetCounts(int profId, int subId) => Json(ExamDALC.GetCounts(profId, subId), JsonRequestBehavior.AllowGet);

        [HttpPost]
        [AuthorizeController]
        public ActionResult _ApproveQuestions(int[] ids)
        {
            bool result = ExamDALC.ApproveQuestion(ids);
            if (result)
            {
                ViewBag.questions = ExamDALC.GetQuestions();
                return PartialView("_QuestionTable");
            }
            else
            {
                return null;
            }
        }

        [AuthorizeController]
        public JsonResult GetSubCategories(int id)
        {
            var subCategories = ExamDALC.GetCategories().Where(row => row.Item3 == id).ToList();
            return Json(new { data = subCategories }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public void SetVariant(string ticketDetailId, string variant) => ExamDALC.SetVariant(ticketDetailId, variant);

        private ExamDomainModel MaptoExamDomainModel(ExamViewModel viewModel)
        {
            string quesUrl = "", answUrlA = "", answUrlB = "", answUrlC = "", answUrlD = "", answUrlE = "";
            string fileName = "";
            if (viewModel.QuestionImage != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.QuestionImage.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.QuestionImage.FileName);

                viewModel.QuestionImageUrl = System.IO.Path.Combine(Server.MapPath("~/images/question"), fileName);
                viewModel.QuestionImage.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/question"), fileName));
            }
            if (viewModel.AnswerImageA != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.AnswerImageA.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.AnswerImageA.FileName);

                viewModel.AnswerImageUrlA = System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName);
                viewModel.AnswerImageA.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName));
            }
            if (viewModel.AnswerImageB != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.AnswerImageB.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.AnswerImageB.FileName);

                viewModel.AnswerImageUrlB = System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName);
                viewModel.AnswerImageB.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName));
            }
            if (viewModel.AnswerImageC != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.AnswerImageC.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.AnswerImageC.FileName);

                viewModel.AnswerImageUrlC = System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName);
                viewModel.AnswerImageC.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName));
            }
            if (viewModel.AnswerImageD != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.AnswerImageD.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.AnswerImageD.FileName);

                viewModel.AnswerImageUrlD = System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName);
                viewModel.AnswerImageD.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName));
            }
            if (viewModel.AnswerImageE != null)
            {
                fileName = System.IO.Path.GetFileNameWithoutExtension(viewModel.AnswerImageE.FileName)
                + DateTime.Now.ToFileTime() + System.IO.Path.GetExtension(viewModel.AnswerImageE.FileName);

                viewModel.AnswerImageUrlE = System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName);
                viewModel.AnswerImageE.SaveAs(System.IO.Path.Combine(Server.MapPath("~/images/answer"), fileName));
            }
            return new ExamDomainModel()
            {
                ID = viewModel.ID,
                ParentCategoryId = viewModel.ParentCategoryId,
                SubCategoryId = viewModel.SubCategoryId,
                QuestionText = viewModel.QuestionText,
                Variants = viewModel.Variants,
                QuestionImageUrl = viewModel.QuestionImageUrl,
                AnswerImageUrlA = viewModel.AnswerImageUrlA,
                AnswerImageUrlB = viewModel.AnswerImageUrlB,
                AnswerImageUrlC = viewModel.AnswerImageUrlC,
                AnswerImageUrlD = viewModel.AnswerImageUrlD,
                AnswerImageUrlE = viewModel.AnswerImageUrlE,
                AnswerTextA = viewModel.AnswerTextA,
                AnswerTextB = viewModel.AnswerTextB,
                AnswerTextC = viewModel.AnswerTextC,
                AnswerTextD = viewModel.AnswerTextD,
                AnswerTextE = viewModel.AnswerTextE,
                Status = viewModel.Status
            };
        }

        private ExamViewModel MaptoExamViewModel(ExamDomainModel domainModel)
        {
            return new ExamViewModel()
            {
                ID = domainModel.ID,
                ParentCategoryId = domainModel.ParentCategoryId,
                SubCategoryId = domainModel.SubCategoryId,
                QuestionText = domainModel.QuestionText,
                Variants = domainModel.Variants,
                AnswerTextA = domainModel.AnswerTextA,
                AnswerTextB = domainModel.AnswerTextB,
                AnswerTextC = domainModel.AnswerTextC,
                AnswerTextD = domainModel.AnswerTextD,
                AnswerTextE = domainModel.AnswerTextE,
                Status = domainModel.Status,
                CreateDate = domainModel.CreateDate,
                Creator = domainModel.Creator
            };
        }

        private QuestionModel MapToQuestionModel(QuestionViewModel model)
        {
            return new QuestionModel
            {
                ID = model.ID,
                AnswerImageUrlA = model.AnswerImageUrlA,
                AnswerImageUrlB = model.AnswerImageUrlB,
                AnswerImageUrlC = model.AnswerImageUrlC,
                AnswerImageUrlD = model.AnswerImageUrlD,
                AnswerImageUrlE = model.AnswerImageUrlE,
                AnswerTextA = model.AnswerTextA,
                AnswerTextB = model.AnswerTextB,
                AnswerTextC = model.AnswerTextC,
                AnswerTextD = model.AnswerTextD,
                AnswerTextE = model.AnswerTextE,
                AnswerImageUrl = model.AnswerImageUrl,
                AnswerText = model.AnswerText,
                QuestionImageUrl = model.QuestionImageUrl,
                QuestionText = model.QuestionText,
                Variant = model.Variant,
                IsCorrectAnswer = model.IsCorrectAnswer,
                ParentId = model.ParentId,
                SubId = model.SubId,
                Status = model.Status,
                TicketDetailId = model.TicketDetailId,
                OrderNumber = model.OrderNumber,
                TicketId = model.TicketId,
                Category = model.Category
            };
        }

        private QuestionViewModel MapToQuestionViewModel(QuestionModel model)
        {
            return new QuestionViewModel
            {
                ID = model.ID,
                AnswerImageUrlA = model.AnswerImageUrlA,
                AnswerImageUrlB = model.AnswerImageUrlB,
                AnswerImageUrlC = model.AnswerImageUrlC,
                AnswerImageUrlD = model.AnswerImageUrlD,
                AnswerImageUrlE = model.AnswerImageUrlE,
                AnswerTextA = model.AnswerTextA,
                AnswerTextB = model.AnswerTextB,
                AnswerTextC = model.AnswerTextC,
                AnswerTextD = model.AnswerTextD,
                AnswerTextE = model.AnswerTextE,
                AnswerImageUrl = model.AnswerImageUrl.Replace(AppConfig.ImagePath, ""),
                AnswerText = model.AnswerText,
                QuestionImageUrl = model.QuestionImageUrl.Replace(AppConfig.ImagePath, ""),
                QuestionText = model.QuestionText,
                Variant = model.Variant,
                IsCorrectAnswer = model.IsCorrectAnswer,
                ParentId = model.ParentId,
                SubId = model.SubId,
                Status = model.Status,
                TicketDetailId = model.TicketDetailId,
                OrderNumber = model.OrderNumber,
                TicketId = model.TicketId,
                Category = model.Category,
                Time = String.IsNullOrEmpty(model.Time) ? "0" : model.Time.Length == 1 ? "0" + model.Time : model.Time + ":00"
            };
        }

        Exam.ProfQuesCount db = new Exam.ProfQuesCount();

        [ValidateInput(false)]
        public ActionResult PivotGridPartial()
        {
            var model = db.V_GET_PROF_LIMITS.ToList();
            string prof;
            if (TempData["Prof"] != null)
            {
                prof = TempData["Prof"].ToString() ?? "";
                model = model.Where(m => m.Path.Contains(prof)).ToList();
                TempData["Prof"] = prof;
            }
            return PartialView("_PivotGridPartial", model);
        }

        public ActionResult GridPartial(string path)
        {
            var model = new Exam.ProfQuesCount().V_GET_PROF_LIMITS.Where(m => m.Path.Contains(path)).ToList();
            TempData["Prof"] = path;
            //var model = db.V_GET_PROF_LIMITS.Where(m => m.PARENT_ID == profId).ToList();
            return PartialView("_PivotGridPartial", model);
        }
    }
}