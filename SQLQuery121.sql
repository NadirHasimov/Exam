SELECT q.ID,q.ACTIVE,c1.NAME +'/'+c.NAME CATEGORY,CASE  WHEN  Q.SUB_CATEGORY_ID=14 THEN q.PROFESSION_ID ELSE q.SUB_CATEGORY_ID END SUB_CATEGORY_ID,
						                        CASE WHEN c.PARENT_ID=0 THEN q.SUB_CATEGORY_ID
						                        ELSE c.PARENT_ID END PARENT_ID,
						                        q.QUES_TEXT,q.QUES_IMAGE_URL,a.ANSWER_TEXT,
                                                a.ANSWER_IMAGE,a.QUES_VARIANT,a.TRUE_ANSWER 
                                                FROM QUESTION q 
                                                INNER JOIN QUES_ANSWER a
                                                ON q.ID=a.QUES_ID
						                        INNER JOIN CATEGORY c ON c.ID=q.SUB_CATEGORY_ID
												INNER JOIN CATEGORY c1 ON c1.ID=c.PARENT_ID
                                                WHERE q.ID=@ID