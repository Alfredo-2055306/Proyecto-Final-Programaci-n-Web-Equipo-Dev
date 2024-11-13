namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Mantenimiento
    {
        public int IDMantenimiento { get; set; }

        public int IDUsuario { get; set; }

        public int IDMarca { get; set; }

        public int IDModelo { get; set; }

        public string Direccion { get; set; } = null!;

        public string ProblemaDescripcion { get; set; } = null!;

        public DateTime FechaReservacion { get; set; }

        public bool Aprobada { get; set; }

        public virtual Usuario IDUsuarioNavigation { get; set; } = null!;

        public virtual Minisplit IDMinisplitNavigation { get; set; } = null!;
    }
}
