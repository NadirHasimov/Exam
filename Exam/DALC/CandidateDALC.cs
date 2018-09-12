using Exam.DomainModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Exam.DALC
{
    public static class CandidateDALC
    {
        public static CandidateModel GetCandidateByFin(string finCode)
        {
            CandidateModel model = new CandidateModel();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Candidate.getCandidateByFin, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@fin_code", finCode);
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        model.ID = int.Parse(reader["ID"].ToString());
                        model.FirstName = reader["SURNAME"].ToString();
                        model.LastName = reader["NAME"].ToString();
                        model.MiddleName = reader["FATHER_NAME"].ToString();
                        model.Mail = reader["EMAIL"].ToString();
                        model.Profession = reader["PROFESSION"].ToString();
                        model.ProfessionId = int.Parse(reader["PROFESSION_ID"].ToString());
                        model.GenderId = bool.Parse(reader["GENDER"].ToString()) ? 1 : 0;
                        model.FamilyStatusId = int.Parse(reader["MARITAL_STATUS"].ToString());
                        model.Birthdate = DateTime.Parse(reader["B_DATE"].ToString());
                        model.FinCode = reader["FIN_CODE"].ToString();
                        model.Mobile = reader["MOBILE"].ToString();
                    }
                }
            }
            return model;
        }

        public static List<Tuple<int, string>> GetProfessions()
        {
            var list = new List<Tuple<int, string>>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Candidate.getProfessions, con))
                {
                    cmd.CommandType = CommandType.Text;
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            list.Add(new Tuple<int, string>(int.Parse(reader["ID"].ToString()), reader["Path"].ToString()));
                        }
                    }
                }
            }
            return list;
        }

        public static Tuple<bool, string, string> Add(CandidateModel model)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_create_ticket", con))
                {
                    string username = HttpContext.Current.User.Identity.Name;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@username", username.Contains("@") ? username : username + "@ady.az");
                    cmd.Parameters.AddWithValue("@fin_Code", model.FinCode);
                    cmd.Parameters.AddWithValue("@first_name", model.FirstName);
                    cmd.Parameters.AddWithValue("@last_name", model.LastName);
                    cmd.Parameters.AddWithValue("@middle_name", model.MiddleName);
                    cmd.Parameters.AddWithValue("@b_date", model.Birthdate);
                    cmd.Parameters.AddWithValue("@gender", model.GenderId);
                    cmd.Parameters.AddWithValue("@family_st", model.FamilyStatusId);
                    cmd.Parameters.AddWithValue("@prof_id", model.ProfessionId);
                    cmd.Parameters.AddWithValue("@exam_prof_id", model.ExamProfessionId);
                    cmd.Parameters.AddWithValue("@mobile", model.Mobile);
                    cmd.Parameters.AddWithValue("@date", model.ExamDate);
                    cmd.Parameters.AddWithValue("@mail", model.Mail);
                    cmd.Parameters.AddWithValue("@time", model.ExamTime);
                    string message = "", ID = "";
                    bool result = false;
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        if (reader.Read())
                        {
                            message = reader["message"].ToString();
                            result = String.Equals("Ok", message);
                            ID = reader["ticket_id"].ToString();
                        }
                    }
                    return new Tuple<bool, string, string>(result, message, ID);
                }
            }
        }

        public static bool InsertQuestion(ExamDomainModel model)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_insert_question", con))
                {
                    cmd.Parameters.AddWithValue("@ques_text", model.QuestionText);
                    cmd.Parameters.AddWithValue("@ques_image_url", model.QuestionImage);
                    cmd.Parameters.AddWithValue("@sub_category_id", model.SubCategoryId);
                    cmd.Parameters.AddWithValue("@answer_img_urlA", model.AnswerImageUrlA);
                    cmd.Parameters.AddWithValue("@answer_img_urlB", model.AnswerImageUrlB);
                    cmd.Parameters.AddWithValue("@answer_img_urlC", model.AnswerImageUrlC);
                    cmd.Parameters.AddWithValue("@answer_img_urlD", model.AnswerImageUrlD);
                    cmd.Parameters.AddWithValue("@answer_img_urlE", model.AnswerImageUrlE);
                    cmd.Parameters.AddWithValue("@answer_textA", model.AnswerTextA);
                    cmd.Parameters.AddWithValue("@answer_textB", model.AnswerTextB);
                    cmd.Parameters.AddWithValue("@answer_textC", model.AnswerTextC);
                    cmd.Parameters.AddWithValue("@answer_textD", model.AnswerTextD);
                    cmd.Parameters.AddWithValue("@answer_textE", model.AnswerTextE);
                    cmd.Parameters.AddWithValue("@variant", model.Variants);
                    cmd.Parameters.AddWithValue("@username", HttpContext.Current.User.Identity.Name.Contains("@") ? HttpContext.Current.User.Identity.Name
                                        : HttpContext.Current.User.Identity.Name + "@ady.az");
                    cmd.Parameters.AddWithValue("ques_text", model.QuestionText);
                    cmd.Parameters.AddWithValue("@lang_id", 2);

                    int affectedRows = cmd.ExecuteNonQuery();
                    return affectedRows == 6;
                }
            }
        }

        public static List<CandidateModel> GetList()
        {
            List<CandidateModel> candidates = new List<CandidateModel>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Candidate.getList, con))
                {
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            candidates.Add(new CandidateModel
                            {
                                ID = int.Parse(reader["ID"].ToString()),
                                FinCode = reader["FIN_CODE"].ToString(),
                                FirstName = reader["NAME"].ToString(),
                                LastName = reader["SURNAME"].ToString(),
                                MiddleName = reader["FATHER_NAME"].ToString(),
                                Birthdate = DateTime.Parse(reader["B_DATE"].ToString())
                            });
                        }
                    }
                }
            }
            return candidates;
        }
    }
}