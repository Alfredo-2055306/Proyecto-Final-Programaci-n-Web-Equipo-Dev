namespace Minisplit_Proyecto_Final___Equipo_Dev.DTOs
{
    public class ComentarioDTO
    {
        public int IDComentario { get; set; }
        public int IDUsuario { get; set; }
        public string NombreUsuario { get; set; } = null!;
        public string ComentarioTexto { get; set; } = null!;
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaModificacion { get; set; }
        public bool Aprobada { get; set; }
    }
}
