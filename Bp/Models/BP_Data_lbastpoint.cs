namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_lbastpoint
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_blast { get; set; }

        public int? id_object { get; set; }

        public int? my_id { get; set; }

        public int? diameter { get; set; }

        public double? depth { get; set; }

        public double? add_depth { get; set; }

        public double? length { get; set; }

        public double? angle { get; set; }

        public double? l1 { get; set; }

        public int? b1dynamite_id { get; set; }

        public double? l2 { get; set; }

        public int? b2dynamite_id { get; set; }

        public double? l3 { get; set; }

        public int? b3dynamite_id { get; set; }

        public double? l4 { get; set; }

        public int? b4dynamite_id { get; set; }

        public double? l5 { get; set; }

        public int? b5dynamite_id { get; set; }

        public double? l6 { get; set; }

        public int? b6dynamite_id { get; set; }

        public double? l7 { get; set; }

        public int? b7dynamite_id { get; set; }

        public double? l8 { get; set; }

        public int? b8dynamite_id { get; set; }

        public double? l9 { get; set; }

        public int? b9dynamite_id { get; set; }

        public double? l10 { get; set; }

        public int? b10dynamite_id { get; set; }

        public int? n1 { get; set; }

        public int? n1dynamite_id { get; set; }

        [StringLength(8)]
        public string n1where { get; set; }

        public int? n2 { get; set; }

        public int? n2dynamite_id { get; set; }

        [StringLength(8)]
        public string n2where { get; set; }

        public int? n3 { get; set; }

        public int? n3dynamite_id { get; set; }

        [StringLength(8)]
        public string n3where { get; set; }

        public int? n4 { get; set; }

        public int? n4dynamite_id { get; set; }

        [StringLength(8)]
        public string n4where { get; set; }

        public int? delay { get; set; }

        [StringLength(8)]
        public string HLname { get; set; }

        [Key]
        [Column(Order = 1)]
        public bool Detonation { get; set; }

        public int? type { get; set; }

        public double? SeiTa { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
