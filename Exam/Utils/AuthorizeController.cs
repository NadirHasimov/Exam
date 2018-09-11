using Exam.DALC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace Exam.Utils
{
    public class AuthorizeController : AuthorizeAttribute
    {
        // This method must be thread-safe since it is called by the thread-safe OnCacheAuthorization() method.
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            base.AuthorizeCore(httpContext);
            // wish base._usersSplit were protected instead of private...
            InitializeSplits(httpContext);

            IPrincipal user = httpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                return false;
            }

            //var userRequired = _usersSplit.Length > 0;
            //var userValid = userRequired
            //    && _usersSplit.Contains(user.Identity.Name, StringComparer.OrdinalIgnoreCase);

            var roleRequired = _rolesSplit.Length > 0;
            var roleValid = (roleRequired)
                && _rolesSplit.Any(user.IsInRole);

            var userOrRoleRequired = roleRequired;

            return roleValid;
        }

        private string[] _rolesSplit = new string[0];
        //private string[] _usersSplit = new string[0];

        private void InitializeSplits(HttpContextBase httpContextBase)
        {
            var rd = httpContextBase.Request.RequestContext.RouteData;
            _rolesSplit = new string[0];
            string currentController = rd.GetRequiredString("controller");
            lock (this)
            {
                if (_rolesSplit.Length == 0)
                {
                    _rolesSplit = UserDALC.GetRolesForController(currentController).Split(',');
                }
            }
        }

    }

    public class AuthorizeExam : AuthorizeAttribute
    {
        // This method must be thread-safe since it is called by the thread-safe OnCacheAuthorization() method.
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            base.AuthorizeCore(httpContext);
            // wish base._usersSplit were protected instead of private...

            IPrincipal user = httpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                return false;
            }
            return UserDALC.CheckFinCode(user.Identity.Name);
        }
    }



}