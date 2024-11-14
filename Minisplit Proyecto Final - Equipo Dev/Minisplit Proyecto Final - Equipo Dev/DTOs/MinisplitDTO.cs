namespace Minisplit_Proyecto_Final___Equipo_Dev.DTOs
{
    public class MinisplitDTO
    {
        public int IDMarca { get; set; }
        public int IDModelo { get; set; }
        public string NombreModelo { get; set; } = null!;
        public string NombreMarca { get; set; } = null!;
        public string NombreMinisplit { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public string ImagenRuta { get; set; } = null!;
    }
}
