namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_Cal_BlastsDynamiteSet_VolBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        public int? preId { get; set; }

        [StringLength(30)]
        public string preName { get; set; }

        [StringLength(50)]
        public string VolNo { get; set; }

        public int? LCount { get; set; }

        public double? VolLength { get; set; }

        public double? VolDikang { get; set; }

        public double? VolLength_Simple { get; set; }

        public double? ColLength { get; set; }

        public double? angle { get; set; }

        public double? BlastLength { get; set; }

        public double? BlastAllDepth { get; set; }

        public double? BlastDepth { get; set; }

        public double? BlastAddDepth { get; set; }

        public double? averDnyL { get; set; }

        public double? averDnyG { get; set; }

        public double? averRV { get; set; }

        public double? averDanhao { get; set; }

        public double? AG { get; set; }

        public double? ARV { get; set; }

        public double? l1 { get; set; }

        public double? l2 { get; set; }

        public double? l3 { get; set; }

        public double? l4 { get; set; }

        public double? l5 { get; set; }

        public double? l6 { get; set; }

        public double? l7 { get; set; }

        public double? l8 { get; set; }

        public double? l9 { get; set; }

        public double? l10 { get; set; }

        public double? LbastMaxDnyl { get; set; }

        public double? LbastMaxDnyg { get; set; }

        public int? diameter { get; set; }

        [StringLength(8)]
        public string HLname { get; set; }

        public int? id_object { get; set; }

        [StringLength(20)]
        public string LbastType { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
