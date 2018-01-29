namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_lbastpreset
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int lbastpreset_id { get; set; }

        [StringLength(50)]
        public string lbastpresetname { get; set; }

        public double? X1 { get; set; }

        public double? Y1 { get; set; }

        public double? Z1 { get; set; }

        public double? X2 { get; set; }

        public double? Y2 { get; set; }

        public double? Z2 { get; set; }

        public double? X3 { get; set; }

        public double? Y3 { get; set; }

        public double? Z3 { get; set; }

        public double? X4 { get; set; }

        public double? Y4 { get; set; }

        public double? Z4 { get; set; }

        public double? depth { get; set; }

        public double? averagecompression { get; set; }

        public int? tools_top { get; set; }

        public int? tools_bootom { get; set; }

        public double? BootomZ { get; set; }

        public double? xyD { get; set; }

        public double? angle { get; set; }

        public double? E1 { get; set; }

        public double? E2 { get; set; }

        public double? E3 { get; set; }

        public double? E4 { get; set; }

        public int? R1id { get; set; }

        public int? R2id { get; set; }

        public int? R3id { get; set; }

        public double? Rh1 { get; set; }

        public double? Rh2 { get; set; }

        public double? Rh3 { get; set; }

        public int? topInter { get; set; }

        public int? bootomInter { get; set; }

        public string sdset { get; set; }

        public string ylset { get; set; }

        public string pzset { get; set; }

        public string hcset { get; set; }

        public string stset { get; set; }

        public string fqsdset { get; set; }

        public double? preDanhao { get; set; }

        public string preFenQv { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
