using Exam.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Exam.Utils
{
    public static class Util
    {
        public static void AddWithValue_Tvp_Int(this SqlParameterCollection paramCollection, string parameterName, List<int> data)
        {
            if (paramCollection != null)
            {
                var p = paramCollection.Add(parameterName, SqlDbType.Structured);
                p.TypeName = "dbo.tvp_Int";
                DataTable _dt = new DataTable() { Columns = { "Value" } };
                data.ForEach(value => _dt.Rows.Add(value));
                p.Value = _dt;
            }
        }

        public static void AddWithValue_Answer_Key_Value(this SqlParameterCollection paramCollection, string parameterName, List<Answer> data)
        {
            if (paramCollection != null)
            {
                var p = paramCollection.Add(parameterName, SqlDbType.Structured);
                p.TypeName = "dbo.ANSWERS";
                DataTable _dt = new DataTable() { Columns = { "ID", "VARIANT" } };
                data.ForEach(value => _dt.Rows.Add(value.id, value.variant));
                p.Value = _dt;
            }
        }
    }
}