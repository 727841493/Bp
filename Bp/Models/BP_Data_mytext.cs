namespace Bp.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class BP_Data_mytext
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int id_text { get; set; }

        public int? id_object { get; set; }

        public int? my_id { get; set; }

        [StringLength(255)]
        public string mytext { get; set; }

        public int? fontcolor { get; set; }

        public int? fescapement { get; set; }

        public int? fontsize { get; set; }

        public int? fontwidth { get; set; }

        public int? fontheight { get; set; }

        public int? fontWeight { get; set; }

        [Key]
        [Column(Order = 1)]
        public bool fontItalic { get; set; }

        [Key]
        [Column(Order = 2)]
        public bool fontunderline { get; set; }

        [StringLength(50)]
        public string fontname { get; set; }

        [StringLength(50)]
        public string 内部ID { get; set; }

        [StringLength(50)]
        public string 项目ID { get; set; }
    }
}
