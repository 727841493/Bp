namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_Cal_BlastsDynamiteSet_Detail
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        public int? preId { get; set; }

        [StringLength(30)]
        public string preName { get; set; }

        [StringLength(8)]
        public string lname { get; set; }

        public double? x1 { get; set; }

        public double? y1 { get; set; }

        public double? z1 { get; set; }

        public double? x2 { get; set; }

        public double? y2 { get; set; }

        public double? z2 { get; set; }

        public double? length { get; set; }

        public double? Depth { get; set; }

        public double? addDepth { get; set; }

        public int? diameter { get; set; }

        public double? angle { get; set; }

        public double? SeiTa { get; set; }

        public int? delay { get; set; }

        [StringLength(20)]
        public string type { get; set; }

        public double? l1 { get; set; }

        [StringLength(20)]
        public string b1name { get; set; }

        public double? l2 { get; set; }

        [StringLength(20)]
        public string b2name { get; set; }

        public double? l3 { get; set; }

        [StringLength(20)]
        public string b3name { get; set; }

        public double? l4 { get; set; }

        [StringLength(20)]
        public string b4name { get; set; }

        public double? l5 { get; set; }

        [StringLength(20)]
        public string b5name { get; set; }

        public double? l6 { get; set; }

        [StringLength(20)]
        public string b6name { get; set; }

        public double? l7 { get; set; }

        [StringLength(20)]
        public string b7name { get; set; }

        public double? l8 { get; set; }

        [StringLength(20)]
        public string b8name { get; set; }

        public double? l9 { get; set; }

        [StringLength(20)]
        public string b9name { get; set; }

        public double? l10 { get; set; }

        [StringLength(20)]
        public string b10name { get; set; }

        public int? n1 { get; set; }

        [StringLength(20)]
        public string n1name { get; set; }

        [StringLength(8)]
        public string n1where { get; set; }

        public int? n2 { get; set; }

        [StringLength(20)]
        public string n2name { get; set; }

        [StringLength(8)]
        public string n2where { get; set; }

        public int? n3 { get; set; }

        [StringLength(20)]
        public string n3name { get; set; }

        [StringLength(8)]
        public string n3where { get; set; }

        public int? n4 { get; set; }

        [StringLength(20)]
        public string n4name { get; set; }

        [StringLength(8)]
        public string n4where { get; set; }

        public int? myorder_HL { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
