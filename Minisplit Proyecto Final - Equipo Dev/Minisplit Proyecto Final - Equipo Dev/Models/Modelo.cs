namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Modelo
    {
        public int IDModelo { get; set; }

        public string NombreModelo { get; set; } = null!;

        public virtual ICollection<Minisplit> Minisplits { get; set; } = new List<Minisplit>();
    }
}
