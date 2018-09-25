namespace Exam
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ProfQuesCount : DbContext
    {
        public ProfQuesCount()
            : base("name=ProfQuesCount")
        {
        }

        public virtual DbSet<V_GET_PROF_LIMITS> V_GET_PROF_LIMITS { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
