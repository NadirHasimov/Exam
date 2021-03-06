﻿using Exam.DomainModels;
using Exam.Models;
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
                    cmd.Parameters.AddWithValue("@parent_category_id", model.ParentCategoryId);

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
                                CreateDate = DateTime.Parse(reader["CREATE_DATE"].ToString())
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
                                Status = bool.Parse(reader["ACTIVE"].ToString()) ? 1 : 0,
                                Category = reader["CATEGORY"].ToString()
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

        public static List<Tuple<string, string, string, string>> GetResult(int ticketId)
        {
            List<Tuple<string, string, string, string>> result = new List<Tuple<string, string, string, string>>();
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
                            result.Add(new Tuple<string, string, string, string>(
                                reader["CATEGORY"].ToString(), reader["CORRECT"].ToString(), reader["WRONG"].ToString(), reader["BLANKED"].ToString()
                            ));
                        }
                    }
                }
            }
            return result;
        }

        public static List<Tuple<int, string, int, string>> GetProfs(int parent = 0)
        {
            var profs = new List<Tuple<int, string, int, string>>();
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
                            profs.Add(new Tuple<int, string, int, string>
                                (int.Parse(reader["ID"].ToString()),
                                reader["NAME"].ToString(),
                                int.Parse(reader["PARENT_ID"].ToString()),
                                reader["PARENT_NAME"].ToString()
                                ));
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

        public static Tuple<bool, string> AddQuesLimit(int count, int limit, string subId, string parentId, array[] array)
        {
            string message = "";
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("sp_add_ques_limit", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@username", HttpContext.Current.User.Identity.Name);
                    cmd.Parameters.AddWithValue("@count", count);
                    cmd.Parameters.AddWithValue("@limit", limit);
                    cmd.Parameters.AddWithValue("@subCategoryId", parentId == "14" ? parentId : string.IsNullOrEmpty(subId) ? "0" : subId);
                    cmd.Parameters.AddWithValue("@parentCategoryId", parentId);//--
                    cmd.Parameters.AddWithValue_Parent_Child("@departs", array.ToList());
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        message = reader["message"].ToString();
                        message = message.Contains("'UNIQUE_PARENT_NAME'") ? "Bu məlumat bazada mövcuddur." : message;
                    }
                    return new Tuple<bool, string>(message.Equals("Ok"), message);
                }
            }
        }

        public static Tuple<int, int> GetCounts(int profId, int subId)
        {
            Tuple<int, int> counts = new Tuple<int, int>(0, 0);
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.getCounts, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@prof_id", profId);
                    cmd.Parameters.AddWithValue("@sub_id", subId);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        if (reader.Read())
                        {
                            counts = new Tuple<int, int>(
                                int.Parse(reader["QUES_COUNT"].ToString()),
                                int.Parse(reader["MIN_QUES_COUNT"].ToString()));
                        }
                    }
                }
            }
            return counts;
        }

        public static bool UpdateDepart(int id, string text)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.updateDepart, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@text", text);
                    cmd.Parameters.AddWithValue("@id", id);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public static bool UpdateCategory(int id, string text)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.updateCategory, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@text", text);
                    cmd.Parameters.AddWithValue("@id", id);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }


        public static bool DeleteDepart(int id)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.deleteDepart, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@id", id);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public static bool DeleteCategory(int id)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.deleteCategory, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@id", id);
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public static void SetVariant(string ticketDetailId, string variant)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Exam.setVariant, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@ticket_detail_id", ticketDetailId);
                    cmd.Parameters.AddWithValue("@variant", variant);
                    cmd.ExecuteNonQuery();
                }
            }

        }
    }
}