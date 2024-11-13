namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Comentario
    {
        public int IDComentario { get; set; }

        public int IDUsuario { get; set; }

        public string ComentarioTexto { get; set; } = null!;

        public DateTime FechaCreacion { get; set; }

        public DateTime FechaModificacion { get; set; }

        public bool Aprobada { get; set; }

        public virtual Usuario IDUsuarioNavigation { get; set; } = null!;
    }
}
