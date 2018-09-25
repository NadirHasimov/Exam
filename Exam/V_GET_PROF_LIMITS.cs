namespace Exam
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class V_GET_PROF_LIMITS
    {

        public int PID { get; set; }

        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int? ID { get; set; }

        public int? PARENT_ID { get; set; }

        [StringLength(1000)]
        public string Path { get; set; }

        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int QUES_COUNT { get; set; }

        [Column(Order = 2)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int MIN_QUES_COUNT { get; set; }

        [Column(Order = 3)]
        [StringLength(30)]
        public string SUB_CATEGORY { get; set; }

        [Column(Order = 4)]
        [StringLength(30)]
        public string CATEGORY { get; set; }
    }
}
