namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_Cal_BlastsDynamiteSet_Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id { get; set; }

        public int? preId { get; set; }

        [StringLength(30)]
        public string preName { get; set; }

        public int? countVols { get; set; }

        public int? countYLVols { get; set; }

        public int? countPZVols { get; set; }

        public int? countSDVols { get; set; }

        public int? countSTVols { get; set; }

        public int? countHCVols { get; set; }

        public int? countBlast { get; set; }

        public int? countYLBlast { get; set; }

        public int? countPZBlast { get; set; }

        public int? countSDBlast { get; set; }

        public int? countSTBlast { get; set; }

        public int? countHCBlast { get; set; }

        public double? countlg { get; set; }

        public double? countYLlg { get; set; }

        public double? countPZlg { get; set; }

        public double? countSDlg { get; set; }

        public double? countSTlg { get; set; }

        public double? countHClg { get; set; }

        public double? YLDanHao { get; set; }

        public double? PZDanHao { get; set; }

        public double? SDDanHao { get; set; }

        public double? STDanHao { get; set; }

        public double? HCDanHao { get; set; }

        public double? preV { get; set; }

        public double? LbastDepth { get; set; }

        public double? preHeight { get; set; }

        public double? preS { get; set; }

        public double? preLength { get; set; }

        public double? preWidth { get; set; }

        public int? Blast_8MS_time { get; set; }

        public double? Blast_8MS { get; set; }

        public double? lbastsMaxDnyL { get; set; }

        public double? lbastsMaxDnyG { get; set; }

        public double? lbastLeft { get; set; }

        public double? lbastRight { get; set; }

        public int? AllDelay { get; set; }

        public double? avgCompress { get; set; }

        public double? minCompress { get; set; }

        public double? maxCompress { get; set; }

        [StringLength(10)]
        public string mainRock { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
