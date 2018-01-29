namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Users
    {
        [Key]
        [StringLength(20)]
        public string 登录名 { get; set; }

        [StringLength(50)]
        public string 用户姓名 { get; set; }

        [StringLength(50)]
        public string 拼音 { get; set; }

        [StringLength(20)]
        public string 密码 { get; set; }

        [StringLength(20)]
        public string 用户类别 { get; set; }

        public byte? 级别 { get; set; }

        public byte? 禁用 { get; set; }

        [Required]
        [StringLength(50)]
        public string 隶属部门 { get; set; }

        [Required]
        [StringLength(20)]
        public string 业务科室 { get; set; }

        [StringLength(20)]
        public string 职工 { get; set; }

        public bool? 强制密码策略 { get; set; }

        public bool? 强制密码策略_不允许空密码 { get; set; }

        public bool? 强制密码策略_密码长度大于等于6位 { get; set; }

        public bool? 强制密码策略_必须包含数字 { get; set; }

        public bool? 强制密码策略_必须包含小写字母 { get; set; }

        public bool? 强制密码策略_必须包含大写字母 { get; set; }

        public bool? 强制密码策略_必须包含特殊字符 { get; set; }

        public bool? 强制密码策略_修改密码必须与原密码不同 { get; set; }

        public bool? 强制密码周期性过期 { get; set; }

        public decimal? 强制密码周期性过期_N { get; set; }

        [StringLength(50)]
        public string 强制密码周期性过期_单位 { get; set; }

        public DateTime? 强制密码周期性过期_开始时间 { get; set; }

        public DateTime? 强制密码周期性过期_结束时间 { get; set; }

        public bool? 强制密码周期性过期_仅提醒 { get; set; }

        public bool? 强制修改密码 { get; set; }

        public bool? 强制修改密码_仅提醒 { get; set; }

        [StringLength(200)]
        public string 邮箱 { get; set; }

        [StringLength(200)]
        public string 手机 { get; set; }

        public bool? 是否首次登录 { get; set; }
    }
}
