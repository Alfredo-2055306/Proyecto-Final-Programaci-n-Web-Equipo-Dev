namespace Minisplit_Proyecto_Final___Equipo_Dev.DTOs
{
    public class MantenimientoCreateDTO
    {
        public int IDUsuario { get; set; }
        public int IDMarca { get; set; }
        public int IDModelo { get; set; }
        public string Direccion { get; set; }
        public string ProblemaDescripcion { get; set; }
        public DateTime FechaReservacion { get; set; }
    }

}
