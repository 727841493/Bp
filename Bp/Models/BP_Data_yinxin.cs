namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_yinxin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_yinxin { get; set; }

        public int? id_object { get; set; }

        public int? my_id { get; set; }

        public int? id_object1_id { get; set; }

        public int? id_object2_id { get; set; }

        public int? delay { get; set; }

        public int? n1 { get; set; }

        public int? n1dynamite_id { get; set; }

        public int? n2 { get; set; }

        public int? n2dynamite_id { get; set; }

        public int? n3 { get; set; }

        public int? n3dynamite_id { get; set; }

        public int? n4 { get; set; }

        public int? n4dynamite_id { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
