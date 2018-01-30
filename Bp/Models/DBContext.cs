namespace Bp.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class DBContext : DbContext
    {
        public DBContext()
            : base("name=DBContext")
        {
        }

        public virtual DbSet<Bp_Data_comment> Bp_Data_comment { get; set; }
        public virtual DbSet<Bp_项目> Bp_项目 { get; set; }
        public virtual DbSet<Bp_项目权限> Bp_项目权限 { get; set; }
        public virtual DbSet<Bp_项目资料> Bp_项目资料 { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<BP_Data_allobject> BP_Data_allobject { get; set; }
        public virtual DbSet<BP_Data_Cal_BlastsDynamiteSet_Base> BP_Data_Cal_BlastsDynamiteSet_Base { get; set; }
        public virtual DbSet<BP_Data_Cal_BlastsDynamiteSet_Detail> BP_Data_Cal_BlastsDynamiteSet_Detail { get; set; }
        public virtual DbSet<BP_Data_Cal_BlastsDynamiteSet_DyClass> BP_Data_Cal_BlastsDynamiteSet_DyClass { get; set; }
        public virtual DbSet<BP_Data_Cal_BlastsDynamiteSet_VolBase> BP_Data_Cal_BlastsDynamiteSet_VolBase { get; set; }
        public virtual DbSet<BP_Data_geologicalinf> BP_Data_geologicalinf { get; set; }
        public virtual DbSet<BP_Data_geologicalinfsm> BP_Data_geologicalinfsm { get; set; }
        public virtual DbSet<BP_Data_geologicalyear> BP_Data_geologicalyear { get; set; }
        public virtual DbSet<BP_Data_lbastpoint> BP_Data_lbastpoint { get; set; }
        public virtual DbSet<BP_Data_lbastpreset> BP_Data_lbastpreset { get; set; }
        public virtual DbSet<BP_Data_mytext> BP_Data_mytext { get; set; }
        public virtual DbSet<BP_Data_point> BP_Data_point { get; set; }
        public virtual DbSet<BP_Data_yinxin> BP_Data_yinxin { get; set; }
        public virtual DbSet<Bp_通知> Bp_通知 { get; set; }
        public virtual DbSet<Bp_项目数据> Bp_项目数据 { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bp_Data_comment>()
                .Property(e => e.ID)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_Data_comment>()
                .Property(e => e.项目编码)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目>()
                .Property(e => e.ID)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目>()
                .Property(e => e.上级)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目>()
                .Property(e => e.类别)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目>()
                .Property(e => e.科目)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目权限>()
                .Property(e => e.登录名)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目权限>()
                .Property(e => e.项目编码)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目权限>()
                .Property(e => e.备注)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目资料>()
                .Property(e => e.项目编码)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.登录名)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.用户姓名)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.拼音)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.密码)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.用户类别)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.隶属部门)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.业务科室)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.职工)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.强制密码周期性过期_N)
                .HasPrecision(18, 6);

            modelBuilder.Entity<Users>()
                .Property(e => e.强制密码周期性过期_单位)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.邮箱)
                .IsUnicode(false);

            modelBuilder.Entity<Users>()
                .Property(e => e.手机)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_通知>()
                .Property(e => e.ID)
                .IsUnicode(false);

            modelBuilder.Entity<Bp_项目数据>()
                .Property(e => e.项目编码)
                .IsUnicode(false);
        }
    }
}
