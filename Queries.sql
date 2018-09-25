WITH CTE AS (
                                                       SELECT ID,PARENT_ID, [NAME], CAST([NAME] AS nvarchar(255))[Path] FROM DEPARTMENT
                                                       WHERE PARENT_ID=0
                                                       UNION ALL
                                                       SELECT 
                                                        d.ID,d.PARENT_ID,d.NAME,CAST(C.[Path]+' >> '+D.NAME AS NVARCHAR(255))[Path]
                                                        FROM DEPARTMENT d
                                                        INNER JOIN CTE C ON C.ID=d.PARENT_ID 
                                                   )
                                                   SELECT CTE.*,QUES_COUNT,MIN_QUES_COUNT,CA.NAME,CB.NAME  FROM CTE
                                                   INNER JOIN QUES_PROFESSION_LIMIT q on  CTE.ID=q.PROFESSION_ID
                                                   INNER JOIN CATEGORY CA on CA.ID=q.SUB_CATEGORY_ID
                                                   INNER JOIN CATEGORY CB on( CA.PARENT_ID=CB.ID or (CA.PARENT_ID=0 and CA.ID=CB.ID))
                                                   WHERE CTE.ID NOT IN (SELECT PARENT_ID FROM DEPARTMENT)

WITH CTE AS (
                                                       SELECT ID,PARENT_ID, [NAME], CAST([NAME] AS NVARCHAR(255))[Path] FROM DEPARTMENT
                                                       WHERE PARENT_ID=0
                                                       UNION ALL
                                                       SELECT 
                                                        d.ID,d.PARENT_ID,d.NAME,CAST(C.[Path]+' >> '+D.NAME AS NVARCHAR(255))[Path]
                                                        FROM DEPARTMENT d
                                                        INNER JOIN CTE C ON C.ID=d.PARENT_ID 
                                                   )
                                                 SELECT * FROM  
												 (
												   SELECT CTE.ID,CTE.Path,CA.NAME,QUES_COUNT,MIN_QUES_COUNT FROM CTE
                                                   INNER JOIN QUES_PROFESSION_LIMIT q on  CTE.ID=q.PROFESSION_ID
                                                   INNER JOIN CATEGORY CA on CA.ID=q.SUB_CATEGORY_ID
                                                   INNER JOIN CATEGORY CB on( CA.PARENT_ID=CB.ID OR (CA.PARENT_ID=0 AND CA.ID=CB.ID))
                                                   WHERE CTE.ID NOT IN (SELECT PARENT_ID FROM DEPARTMENT)
												 ) AS SOURCE_TABLE
												 PIVOT
												 (
													MAX(QUES_COUNT)  FOR SOURCE_TABLE.NAME IN(ŞİFAHİ ,RİYAZİ,İXTİSAS,DÜNYAGÖRÜŞ,MƏNTİQ )
												 )  AS PivotTable
												