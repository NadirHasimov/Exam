using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Exam.DALC
{
    public static class SqlQueries
    {
        public static class User
        {
            public const string checkFinCode = @"SELECT t.ID FROM TICKET t
                                                INNER JOIN CANDIDATE c ON t.CAND_ID=c.ID
                                                WHERE c.FIN_CODE=@fin_code AND APPR_STATUS=1 AND t.FINISH=0 
                                                	  AND [DATE] =CAST(GETDATE() AS NVARCHAR)";

        }
        public static class Role
        {
            public const string getAllRoles = "SELECT name FROM ROLE";

            public const string getRolesForUser = @"SELECT [name] FROM USER_ROLE_MAPPING 
                                                    INNER JOIN[USER] ON USER_ROLE_MAPPING.USER_ID=[USER].ID
                                                    INNER JOIN[ROLE] ON USER_ROLE_MAPPING.ROLE_ID=[ROLE].ID
                                                    WHERE USERNAME = @username";

            public const string getRolesForController = @"SELECT [NAME] FROM MENU INNER JOIN
                                                          MENU_ROLE_MAPPING ON MENU.ID=MENU_ROLE_MAPPING.MENU_ID
                                                          INNER JOIN ROLE ON MENU_ROLE_MAPPING.ROLE_ID=ROLE.ID
                                                          WHERE MENU.MNU_CONTROLLER_NAME= @controller_name";

        }

        public static class Candidate
        {
            public const string getCandidateByFin = @"SELECT c.*,d.NAME PROFESSION FROM CANDIDATE c
                                                      INNER JOIN DEPARTMENT d
                                                      ON c.PROFESSION_ID=d.ID
                                                      WHERE c.ACTIVE=1 AND c.FIN_CODE=@fin_code";
            public const string getProfessions = @"WITH CTE AS (
                                                   	SELECT ID,PARENT_ID, [NAME], CAST([NAME] AS nvarchar(255))[Path] FROM DEPARTMENT
                                                   	WHERE PARENT_ID=0
                                                   	UNION ALL
                                                   	SELECT 
                                                   	 d.ID,d.PARENT_ID,d.NAME,CAST(C.[Path]+' >> '+D.NAME AS NVARCHAR(255))[Path]
                                                   	 FROM DEPARTMENT d
                                                   	 INNER JOIN CTE C ON C.ID=d.PARENT_ID 
                                                   )
                                                   SELECT * FROM CTE WHERE ID NOT IN (SELECT PARENT_ID FROM DEPARTMENT)";

            public const string add = @"
                DECLARE @CAND_ID INT=0, @COUNT INT, @user_id int;
                SELECT @CAND_ID=ID FROM CANDIDATE WHERE FIN_CODE=@fin_Code
                SELECT @user_id=ID FROM [USER] WHERE USERNAME=@username
                
                IF(@CAND_ID=0)
                BEGIN
                	INSERT INTO CANDIDATE 
                	(FIN_CODE,[NAME],SURNAME,FATHER_NAME,EMAIL,B_DATE,GENDER,MARITAL_STATUS,PROFESSION_ID,MOBILE,USER_ID,DATA_STATUS,ACTIVE)
                	VALUES 
                	(@fin_code,@first_name,@last_name,@middle_name,@mail,@b_date,@gender,@family_st,@prof_id,@mobile,@user_id,1,1)
                	SELECT @CAND_ID=SCOPE_IDENTITY() 
                END
                
                INSERT INTO TICKET 
                (CAND_ID,PROFESSION_ID,DATE,TIME,REMAINDER_TIME,USER_ID,FINISH,APPR_STATUS)
                VALUES
                (@CAND_ID,@exam_prof_id,@date,@time,60,@user_id,0,0)";

            public const string getList = @"SELECT ID,FIN_CODE,[NAME],SURNAME,FATHER_NAME,B_DATE 
                                            FROM CANDIDATE WHERE ACTIVE=1";

            public const string getResult = @"SELECT a.QUES_ID ,
                                              CASE
                                              	  WHEN T.TICKET_ANSWER IS NULL THEN '2'
                                              	  WHEN t.TICKET_ANSWER=a.QUES_VARIANT THEN '1'
                                              	  ELSE 0 
                                              END [STATUS]
                                              FROM TICKET_DETAIL t
                                              INNER JOIN QUES_ANSWER a
                                              ON t.QUES_ID=a.QUES_ID
                                              WHERE t.TICKET_ID=@ticket_id and a.TRUE_ANSWER=1
                                              ORDER BY t.QUES_ID";

        }

        public static class Ticket
        {
            public const string get = @"SELECT t.ID,c.FIN_CODE,c.NAME,c.SURNAME,
                                        c.FATHER_NAME,d.NAME profession, t.DATE, t.TIME,t.APPR_STATUS,t.FINISH
                                        FROM TICKET t
                                        INNER JOIN CANDIDATE c ON t.CAND_ID=c.ID
                                        INNER JOIN DEPARTMENT d ON t.PROFESSION_ID=d.ID
                                        --WHERE t.APPR_STATUS";

            public const string approve = @"UPDATE TICKET SET APPR_STATUS=@type
                                            WHERE ID IN (SELECT [Value] FROM @ids) and FINISH=0";

            public const string getCandQuestions = @"SELECT d.ID,t.ID TICKET_ID,t.REMAINDER_TIME,d.QUES_ID, d.QUES_ORDER_NO,q.QUES_TEXT,q.QUES_IMAGE_URL,a.QUES_VARIANT,a.ANSWER_TEXT,a.ANSWER_IMAGE 
                                                     FROM TICKET t 
                                                     INNER JOIN TICKET_DETAIL d ON t.ID = d.TICKET_ID 
                                                     INNER JOIN QUESTION q ON q.ID=d.QUES_ID
                                                     INNER JOIN QUES_ANSWER a ON a.QUES_ID=q.ID
                                                     INNER JOIN CANDIDATE c ON c.ID = t.CAND_ID
                                                     WHERE C.FIN_CODE=@fin_code AND T.APPR_STATUS=1 AND T.FINISH=0
                                                     AND t.[DATE]=CAST(GETDATE() AS NVARCHAR)
                                                     ORDER BY d.ID";

            public const string finish = @"DECLARE @COUNT INT
                                           UPDATE t SET TICKET_ANSWER=src.VARIANT
                                           FROM TICKET_DETAIL t
                                           INNER JOIN (
                                           	SELECT ID,VARIANT FROM @answers
                                           ) AS src (ID,VARIANT)
                                           ON t.ID=src.ID

                                           SELECT @COUNT=COUNT(*) FROM @answers

                                          -- IF (@@ROWCOUNT=@COUNT)
                                           -- BEGIN 
                                           	    UPDATE TICKET SET FINISH=1,REMAINDER_TIME=@minute
                                           	    WHERE ID=@ticket_id
                                            --END";

            public const string updateFinish = @"UPDATE t set FINISH=1
                                                 from TICKET t
                                                 where t.ID=@ticket_id";
        }
        public static class Exam
        {
            public const string getCategories = @"SELECT ID,NAME,PARENT_ID FROM CATEGORY WHERE ACTIVE=1";

            public const string getQuestions = @"SELECT q.ID,c.NAME SUB,c1.NAME PARENT,q.ACTIVE, REPLACE(u.USERNAME,'@ady.az','') USERNAME,q.CREATE_DATE FROM QUESTION q
                                                 INNER JOIN CATEGORY c
                                                 ON q.SUB_CATEGORY_ID=c.ID
                                                 INNER JOIN CATEGORY c1
                                                 ON c1.ID=c.PARENT_ID
												 INNER JOIN [USER] u
												 ON q.USER_ID=u.ID";

            public const string getQuestion = @"SELECT q.ID,q.ACTIVE, q.SUB_CATEGORY_ID,c.PARENT_ID,q.QUES_TEXT,q.QUES_IMAGE_URL,a.ANSWER_TEXT,
                                                a.ANSWER_IMAGE,a.QUES_VARIANT,a.TRUE_ANSWER 
                                                FROM QUESTION q 
                                                INNER JOIN QUES_ANSWER a
                                                ON q.ID=a.QUES_ID
												INNER JOIN CATEGORY c ON c.ID=q.SUB_CATEGORY_ID
                                                WHERE q.ID=@ID";

            public const string approveQuestions = @"UPDATE QUESTION SET ACTIVE=1 WHERE ID IN (SELECT [Value] FROM @ids)";

            public const string updateQuestion = @"";


            public const string getProfsByParent = @"SELECT ID,NAME FROM DEPARTMENT WHERE PARENT_ID=@parent_id and ACTIVE=1";

            public const string feedback = @"UPDATE TICKET_DETAIL SET FEED_BACK=@text WHERE ID=@id";

            public const string getFeedback = @"SELECT FEED_BACK FROM TICKET_DETAIL WHERE ID=@id";

            public const string addQuesLimit = @"DECLARE @parent nvarchar(100),@child nvarchar(100),
			                                    @parent_id int,@child_id int, @user_id int
	                                            SELECT @user_id=ID FROM [USER] WHERE USERNAME=@username
	                                            DECLARE CUR_INSERT_QUES_LIMIT CURSOR FOR
	                                            	SELECT Parent,Child FROM @departs
	                                              OPEN CUR_INSERT_QUES_LIMIT
	                                              FETCH NEXT FROM CUR_INSERT_QUES_LIMIT INTO @parent,@child
	                                            WHILE @@FETCH_STATUS=0
	                                            BEGIN
	                                            	IF (ISNUMERIC(@parent)=1)
	                                            	BEGIN
	                                            		SET @parent_id=@parent
	                                            		IF(ISNUMERIC(@child)=1)
	                                            		BEGIN
	                                            			SET @child_id=@child
	                                            			UPDATE DEPARTMENT SET PARENT_ID=@parent_id WHERE ID=@child_id
	                                            		END
	                                            		ELSE
	                                            		BEGIN	
	                                            			INSERT INTO DEPARTMENT(NAME,PARENT_ID) VALUES (@child,@parent_id)
	                                            			SET @child_id=SCOPE_IDENTITY()
	                                            		END
	                                            	END
	                                            	ELSE
	                                            		INSERT INTO DEPARTMENT(NAME,PARENT_ID)  VALUES(@parent,0)
	                                            		SET @parent_id=SCOPE_IDENTITY()
	                                            		INSERT INTO DEPARTMENT(NAME,PARENT_ID) VALUES(@child,@parent_id)
	                                            		SET @child_id=SCOPE_IDENTITY()
	                                            	BEGIN
	                                            		INSERT INTO QUES_PROFESSION_LIMIT
	                                            		(PROFESSION_ID,MIN_QUES_COUNT,QUES_COUNT,SUB_CATEGORY_ID,USER_ID)
	                                            		VALUES
	                                            		(@child_id,@limit,@count,@subCategoryId,@user_id)
	                                            	END
	                                            END";


        }
    }
}