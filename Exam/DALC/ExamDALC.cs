using Exam.DomainModels;
using Exam.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Exam.DALC
{
    public static class ExamDALC
    {
        public static List<Tuple<int, string, int>> GetCategories()
        {
            List<Tuple<int, string, int>> categories = new List<Tuple<int, string, int>>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getCategories, con))
                {
                    cmd.CommandType = CommandType.Text;
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            categories.Add(new Tuple<int, string, int>(
                                int.Parse(reader["ID"].ToString()),
                                reader["NAME"].ToString(),
                                int.Parse(reader["PARENT_ID"].ToString())));
                        }
                    }
                }
            }
            return categories;
        }

        public static bool InsertQuestion(ExamDomainModel model)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_insert_question", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", model.ID);
                    cmd.Parameters.AddWithValue("@ques_text", model.QuestionText ?? "");
                    cmd.Parameters.AddWithValue("@ques_image_url", model.QuestionImageUrl ?? "");
                    cmd.Parameters.AddWithValue("@sub_category_id", model.SubCategoryId);
                    cmd.Parameters.AddWithValue("@answer_img_urlA", model.AnswerImageUrlA ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlB", model.AnswerImageUrlB ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlC", model.AnswerImageUrlC ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlD", model.AnswerImageUrlD ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlE", model.AnswerImageUrlE ?? "");
                    cmd.Parameters.AddWithValue("@answer_textA", model.AnswerTextA ?? "");
                    cmd.Parameters.AddWithValue("@answer_textB", model.AnswerTextB ?? "");
                    cmd.Parameters.AddWithValue("@answer_textC", model.AnswerTextC ?? "");
                    cmd.Parameters.AddWithValue("@answer_textD", model.AnswerTextD ?? "");
                    cmd.Parameters.AddWithValue("@answer_textE", model.AnswerTextE ?? "");
                    cmd.Parameters.AddWithValue("@variant", model.Variants);
                    cmd.Parameters.AddWithValue("@username", HttpContext.Current.User.Identity.Name.Contains("@") ? HttpContext.Current.User.Identity.Name
                                        : HttpContext.Current.User.Identity.Name + "@ady.az");
                    cmd.Parameters.AddWithValue("@lang_id", 2);
                    cmd.Parameters.AddWithValue("@status", model.Status);

                    int affectedRows = cmd.ExecuteNonQuery();
                    return affectedRows == 6;
                }
            }
        }

        public static List<ExamDomainModel> GetQuestions()
        {
            List<ExamDomainModel> list = new List<ExamDomainModel>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getQuestions, con))
                {
                    cmd.CommandType = CommandType.Text;
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            list.Add(new ExamDomainModel
                            {
                                ID = int.Parse(reader["ID"].ToString()),
                                Parent = reader["PARENT"].ToString(),
                                Sub = reader["Sub"].ToString(),
                                Status = Boolean.Parse(reader["ACTIVE"].ToString()) ? 1 : 0,
                                Creator = reader["USERNAME"].ToString(),
                                CreateDate = DateTime.Parse(reader["CREATE_DATE"].ToString()).ToString("dd/mm/yyyy")
                            });
                        }
                    }
                }
            }
            return list;
        }

        public static List<QuestionModel> GetQuestion(int ID)
        {
            List<QuestionModel> model = new List<QuestionModel>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getQuestion, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@ID", ID);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            model.Add(new QuestionModel
                            {
                                ID = int.Parse(reader["ID"].ToString()),
                                QuestionImageUrl = reader["QUES_IMAGE_URL"].ToString(),
                                QuestionText = reader["QUES_TEXT"].ToString(),
                                AnswerImageUrl = reader["ANSWER_IMAGE"].ToString(),
                                AnswerText = reader["ANSWER_TEXT"].ToString(),
                                Variant = char.Parse(reader["QUES_VARIANT"].ToString()),
                                IsCorrectAnswer = bool.Parse(reader["TRUE_ANSWER"].ToString()),
                                ParentId = int.Parse(reader["PARENT_ID"].ToString()),
                                SubId = int.Parse(reader["SUB_CATEGORY_ID"].ToString()),
                                Status = bool.Parse(reader["ACTIVE"].ToString()) ? 1 : 0
                            });
                        }

                    }
                }
            }
            return model;
        }

        public static bool ApproveQuestion(int[] ids)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.approveQuestions, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue_Tvp_Int("@ids", ids.ToList());
                    return ids.Length == cmd.ExecuteNonQuery();
                }
            }
        }

        public static bool EditQuestion(ExamDomainModel model)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_insert_question", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", model.ID);
                    cmd.Parameters.AddWithValue("@ques_text", model.QuestionText ?? "");
                    cmd.Parameters.AddWithValue("@ques_image_url", model.QuestionImageUrl ?? "");
                    cmd.Parameters.AddWithValue("@sub_category_id", model.SubCategoryId);
                    cmd.Parameters.AddWithValue("@answer_img_urlA", model.AnswerImageUrlA ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlB", model.AnswerImageUrlB ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlC", model.AnswerImageUrlC ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlD", model.AnswerImageUrlD ?? "");
                    cmd.Parameters.AddWithValue("@answer_img_urlE", model.AnswerImageUrlE ?? "");
                    cmd.Parameters.AddWithValue("@answer_textA", model.AnswerTextA ?? "");
                    cmd.Parameters.AddWithValue("@answer_textB", model.AnswerTextB ?? "");
                    cmd.Parameters.AddWithValue("@answer_textC", model.AnswerTextC ?? "");
                    cmd.Parameters.AddWithValue("@answer_textD", model.AnswerTextD ?? "");
                    cmd.Parameters.AddWithValue("@answer_textE", model.AnswerTextE ?? "");
                    cmd.Parameters.AddWithValue("@variant", model.Variants);
                    cmd.Parameters.AddWithValue("@username", HttpContext.Current.User.Identity.Name.Contains("@") ? HttpContext.Current.User.Identity.Name
                                        : HttpContext.Current.User.Identity.Name + "@ady.az");
                    cmd.Parameters.AddWithValue("@lang_id", 2);
                    cmd.Parameters.AddWithValue("@status", model.Status);

                    int affectedRows = cmd.ExecuteNonQuery();
                    return affectedRows == 6;
                }
            }
        }

        public static List<Tuple<int, int>> GetResult(int ticketId)
        {
            List<Tuple<int, int>> result = new List<Tuple<int, int>>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Candidate.getResult, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@ticket_id", ticketId);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new Tuple<int, int>(
                                int.Parse(reader["QUES_ID"].ToString()),
                                int.Parse(reader["STATUS"].ToString())
                            ));
                        }
                    }
                }
            }
            return result;
        }

        public static List<Tuple<int, string>> GetProfs(int parent = 0)
        {
            var profs = new List<Tuple<int, string>>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getProfsByParent, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("parent_id", parent);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            profs.Add(new Tuple<int, string>
                                (int.Parse(reader["ID"].ToString()),
                                reader["NAME"].ToString()));
                        }
                    }
                }
            }
            return profs;
        }

        public static bool Feedback(string text, int id)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.feedback, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@text", text);
                    cmd.Parameters.AddWithValue("@id", id);
                    return cmd.ExecuteNonQuery() == 1;
                }
            }
        }

        public static string GetFeedback(int id)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getFeedback, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@id", id);
                    string text = cmd.ExecuteScalar().ToString();
                    return text;
                }
            }
        }
    }
}