namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class AcercaDe
    {
        public int IDAcercaDe { get; set; }

        public int IDUsuario { get; set; }

        public string Contenido { get; set; } = null!;

        public virtual Usuario IDUsuarioNavigation { get; set; } = null!;
    }
}
