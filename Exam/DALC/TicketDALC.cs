using Exam.DomainModels;
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
    public static class TicketDALC
    {
        public static List<CandidateModel> GetTickets()
        {
            List<CandidateModel> candidates = new List<CandidateModel>();
            using (var con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (var cmd = new SqlCommand(SqlQueries.Ticket.get, con))
                {
                    cmd.CommandType = CommandType.Text;
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
                                Profession = reader["profession"].ToString(),
                                ExamDate = DateTime.Parse(reader["DATE"].ToString()),
                                ExamTime = DateTime.Parse(reader["TIME"].ToString()).ToString("hh:mm"),
                                Status = reader["APPR_STATUS"].ToString(),
                                Finish = reader["FINISH"].ToString().Equals("0") ? false : true,
                                Description=reader["DESCRIPTION"].ToString()
                            });
                        }
                    }
                }
            }
            return candidates;
        }

        public static bool ApproveTickets(int[] ids, int type, string desc)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (var cmd = new SqlCommand(SqlQueries.Ticket.approve, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue_Tvp_Int("@ids", ids.ToList());
                    cmd.Parameters.AddWithValue("@type", type);
                    cmd.Parameters.AddWithValue("@desc", desc);
                    int affectedRows = cmd.ExecuteNonQuery();
                    return affectedRows == ids.Count();
                }
            }
        }

        public static List<QuestionModel> GetCandQuestions(string finCode)
        {
            List<QuestionModel> questions = new List<QuestionModel>();
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Ticket.getCandQuestions, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@fin_code", finCode);
                    var reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            questions.Add(new QuestionModel
                            {
                                TicketDetailId = int.Parse(reader["ID"].ToString()),
                                OrderNumber = int.Parse(reader["QUES_ORDER_NO"].ToString()),
                                QuestionText = reader["QUES_TEXT"].ToString(),
                                QuestionImageUrl = reader["QUES_IMAGE_URL"].ToString(),
                                Variant = char.Parse(reader["QUES_VARIANT"].ToString()),
                                AnswerText = reader["ANSWER_TEXT"].ToString(),
                                AnswerImageUrl = reader["ANSWER_IMAGE"].ToString(),
                                TicketId = int.Parse(reader["TICKET_ID"].ToString()),
                                Time = reader["REMAINDER_TIME"].ToString()
                            });
                        }
                    }
                }
            }
            return questions;
        }

        public static void UpdateTicketFinish(int ticketId)
        {
            using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(SqlQueries.Ticket.updateFinish, con))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.AddWithValue("@ticket_id", ticketId);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public static bool Finish(Answer[] answers, int minute, int ticketId)
        {
            if (answers != null)
            {
                using (SqlConnection con = new SqlConnection(AppConfig.ConnectionString))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand(SqlQueries.Ticket.finish, con))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.Parameters.AddWithValue_Answer_Key_Value("@answers", answers.ToList());
                        cmd.Parameters.AddWithValue("@ticket_id", ticketId);
                        cmd.Parameters.AddWithValue("@minute", minute);
                        int affectedRows = cmd.ExecuteNonQuery();
                        return affectedRows == answers.Length + 1;
                    }
                }
            }
            else return true;
        }
    }
}