namespace Minisplit_Proyecto_Final___Equipo_Dev.Models
{
    public class Marca
    {
        public int IDMarca { get; set; }

        public string NombreMarca { get; set; } = null!;

        public virtual ICollection<Minisplit> Minisplits { get; set; } = new List<Minisplit>();
    }
}
