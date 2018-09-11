using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Exam
{
    public class AppConfig
    {
        public static string ConnectionString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["LOCAL_DB_EXAM"].ConnectionString;
            }
        }

        public static string Path
        {
            get
            {
                return ConfigurationManager.AppSettings["Path"].ToString();
            }
        }
        public static string ImagePath
        {
            get
            {
                return ConfigurationManager.AppSettings["imageUrl"].ToString();
            }
        }
    }
}