using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.DirectoryServices;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Web;
using System.Web.Mvc;

namespace Exam.DALC
{
    public static class UserDALC
    {
        //public static bool SigIn(string username, string password)
        //{
        //    bool result = false;
        //    using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
        //    {
        //        con.Open();
        //        using (SqlCommand cmd = new SqlCommand("sp_sign_in", con))
        //        {
        //            cmd.CommandType = CommandType.StoredProcedure;
        //            cmd.Parameters.AddWithValue("@username", username);
        //            cmd.Parameters.AddWithValue("@password", password);

        //            var reader = cmd.ExecuteReader();
        //            reader.Read();
        //            if (reader.HasRows)
        //            {
        //                result = bool.Parse(reader["result"].ToString());
        //            }
        //            return false;
        //        }
        //    }
        //}

        public static int GetUserType(string username, string password)
        {
            int result = 4;
            /*
             result==1 => user is active directory type 
             result==2 => user is local user but password doesn't match
             result==3 => user is local user and password is valid
             result==4 => user doesn't exist
             */
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_check_ad_user", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@username", username);
                    cmd.Parameters.AddWithValue("@password", password);
                    var reader = cmd.ExecuteReader();
                    reader.Read();
                    if (reader.HasRows)
                    {
                        result = int.Parse(reader["result"].ToString());
                    }
                }
            }
            return result;
        }

        public static bool SigInActiveDirectory(string username, string passowrod)
        {
            string path = AppConfig.Path;
            string description = "";
            using (DirectoryEntry entry = new DirectoryEntry(path, username, passowrod))
            {
                DirectorySearcher searcher = new DirectorySearcher(entry);
                searcher.Filter = "(objectclass=user)";
                try
                {
                    var ent = searcher.FindOne();
                    return true;
                }
                catch (Exception exc)
                {
                    description = exc.Message;
                    return false;
                }
            }
        }

        public static string GetRolesForController(string controllerName)
        {
            string roles = "";
            int counter = 0;
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Role.getRolesForController, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@controller_name", controllerName);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            roles = counter == 0 ? reader["name"].ToString() : "," + reader["name"].ToString();
                            counter++;
                        }
                    }
                }
                return roles;
            }
        }

        public static MvcHtmlString CreateMenuList()
        {
            string role = System.Web.Security.Roles.GetRolesForUser().Single();
            //string lang = HttpContext.Current.Request.Cookies["culture"].Value.ToString();
            //lang = String.IsNullOrEmpty(lang) ? "Az" : lang;
            string url = "";
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_create_menu_list", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@role_name", role);

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        url = url + " " + reader["AZ"].ToString();
                    }
                }
            }
            return MvcHtmlString.Create(url);
        }

        public static bool CheckFinCode(string finCode)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.User.checkFinCode, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@fin_code", finCode);
                    int result = (int)(cmd.ExecuteScalar() ?? 0);
                    return result > 0;
                }
            }
        }

        public static void AddLog(HttpContextBase context, bool status, string description)
        {
            string ip = string.IsNullOrEmpty(HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"])
                    ? HttpContext.Current.Request.UserHostAddress
                    : HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip) || ip.Trim() == "::1")
            { // still can't decide or is LAN
                var lan = Dns.GetHostEntry(Dns.GetHostName()).AddressList.FirstOrDefault(r => r.AddressFamily == AddressFamily.InterNetwork);
                ip = lan == null ? string.Empty : lan.ToString();
            }
            string action = HttpContext.Current.Request.RequestContext.RouteData.Values["controller"].ToString() + "/"
                           + HttpContext.Current.Request.RequestContext.RouteData.Values["action"].ToString();

            if (context.Request.Params["ID"] != null)
            {
                string ID = context.Request.Params["ID"].ToString();
            }
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.User.addLog, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@browser", GetBrowserInfo());
                    cmd.Parameters.AddWithValue("@ip", ip);
                    cmd.Parameters.AddWithValue("@description", string.IsNullOrEmpty(description) ? context.Request.HttpMethod : description);
                    cmd.Parameters.AddWithValue("@success_status", status);
                    cmd.Parameters.AddWithValue("@action", action);
                    cmd.Parameters.AddWithValue("@username", context.User.Identity.Name);
                    cmd.ExecuteNonQuery();
                }
            }
        }
        private static string GetBrowserInfo()
        {
            System.Web.HttpBrowserCapabilities browser = HttpContext.Current.Request.Browser;
            string browserInfo =
                @"Type = " + browser.Type + " , "

                + "Name = " + browser.Browser + " , "

                + "Version = " + browser.Version + " , "

                + "Major Version = " + browser.MajorVersion + " , "

                + "Minor Version = " + browser.MinorVersion + " , "

                + "Platform = " + browser.Platform + " , "

                + "Is Beta = " + browser.Beta + " , "

                + "Is Crawler = " + browser.Crawler + " , "

                + "Is AOL = " + browser.AOL + " , "

                + "Is Win16 = " + browser.Win16 + " , "

                + "Is Win32 = " + browser.Win32 + " , "

                + "Supports Frames = " + browser.Frames + " , "

                + "Supports Tables = " + browser.Tables + " , "

                + "Supports Cookies = " + browser.Cookies + " , "

                + "Supports VBScript = " + browser.VBScript + " , "

                + "Supports JavaScript = " + browser.EcmaScriptVersion + " , "

                + "Supports Java Applets = " + browser.JavaApplets + " , "

                + "Supports ActiveX Controls = " + browser.ActiveXControls + " , "

                + "Supports JavaScript Version = " + browser["JavaScriptVersion"];
            return browserInfo;
        }
    }
}