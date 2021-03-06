﻿using Exam.DALC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.DirectoryServices;

namespace Exam.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult SignIn()
        {
            string urlReferer;
            if (Request.UrlReferrer != null)
            {
                urlReferer = Request.UrlReferrer.LocalPath;
                if (urlReferer.Contains("/Exam/Agreement"))
                {
                    string finCode = HttpUtility.ParseQueryString(Request.UrlReferrer.Query)["finCode"];
                    UserDALC.AddLog(HttpContext, true, "Razı deyiləm", finCode);
                }
            }
            FormsAuthentication.SignOut();
            return View();
        }

        [HttpPost]
        public ActionResult SignIn(string username, string password, string ReturnUrl)
        {
            username = username.Contains("@") ? username : username + "@ady.az";
            bool result = false;
            string login_status = "invalid";

            if (!ModelState.IsValid)
            {
                return View();
            }
            ReturnUrl = String.IsNullOrEmpty(ReturnUrl) ? Url.Action("Index", "Candidate") : ReturnUrl;
            int userType = UserDALC.GetUserType(username, password);

            if (userType == 1) //Active Directory
            {
                result = UserDALC.SigInActiveDirectory(username, password);
            }
            else if (userType == 3) // local user (valid) 
            {
                result = true;
            }
            if (result)
            {
                FormsAuthentication.SetAuthCookie(username, false);
                login_status = "success";
            }
            UserDALC.AddLog(HttpContext, result, result ? "Success" : "Error");
            return Json(new { login_status = login_status, redirect_url = ReturnUrl }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogInExam(string finCode)
        {
            string login_status = "invalid";
            bool result = UserDALC.CheckFinCode(finCode);
            if (result)
            {
                login_status = "success";
                FormsAuthentication.SetAuthCookie(finCode, false);
            }
            UserDALC.AddLog(HttpContext, result, result ? "Success" : "Error");
            return Json(new { login_status = login_status, redirect_url = Url.Action("Agreement", "Exam", new { finCode = finCode }), JsonRequestBehavior.AllowGet });
        }

        public ActionResult test()
        {
            return View();
        }
    }
}