namespace Minisplit_Proyecto_Final___Equipo_Dev.DTOs
{
    public class MantenimientoDTO
    {
        public int IDMantenimiento { get; set; }
        public int IDUsuario { get; set; }
        public int IDMarca { get; set; }
        public int IDModelo { get; set; }
        public string Direccion { get; set; }
        public string ProblemaDescripcion { get; set; }
        public DateTime FechaReservacion { get; set; }
        public bool Aprobada { get; set; }

        // Relaciones
        public string NombreUsuario { get; set; }
        public string NombreMarca { get; set; }
        public string NombreModelo { get; set; }
        public string ImagenRuta { get; set; }
    }

}
