using Exam.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Exam.Controllers
{
    [AuthorizeController]
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            // Index is default action 
            //var action = (Request.UrlReferrer.Segments.Skip(2).Take(1).SingleOrDefault() ?? "Index").Trim('/');
            return View();
        }

        public ActionResult Test()
        {
            return View();
        }

        public ActionResult GetCandidate(string finCode)
        {
            return Json(new { response = true }, JsonRequestBehavior.AllowGet);
        }
    }
}