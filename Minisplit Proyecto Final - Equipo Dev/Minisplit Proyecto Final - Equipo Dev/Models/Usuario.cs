namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Usuario
    {
        public int IDUsuario { get; set; }

        public string Nombre { get; set; } = null!;

        public string Correo { get; set; } = null!;

        public string Contraseña { get; set; } = null!;

        public int IDRol { get; set; }

        public virtual Rol IDRolNavigation { get; set; } = null!;
    }
}
