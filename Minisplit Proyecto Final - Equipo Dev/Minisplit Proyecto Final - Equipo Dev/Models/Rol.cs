namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Rol
    {
        public int IDRol { get; set; }

        public string NombreRol { get; set; } = null!;

        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
