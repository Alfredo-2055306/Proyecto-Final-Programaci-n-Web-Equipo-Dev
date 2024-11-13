namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Minisplit
    {
        public int IDMarca { get; set; }

        public int IDModelo { get; set; }

        public string NombreMinisplit { get; set; } = null!;

        public string Descripcion { get; set; } = null!;

        public string ImagenRuta { get; set; } = null!;

        public virtual Marca IDMarcaNavigation { get; set; } = null!;

        public virtual Modelo IDModeloNavigation { get; set; } = null!;
    }
}
