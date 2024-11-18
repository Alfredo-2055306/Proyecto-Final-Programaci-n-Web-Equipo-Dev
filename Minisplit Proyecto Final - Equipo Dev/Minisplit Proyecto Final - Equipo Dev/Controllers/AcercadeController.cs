using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minisplit_Proyecto_Final___Equipo_Dev.DTOs;
using Minisplit_Proyecto_Final___Equipo_Dev.Models;
using System.Data;
using System.Data.SqlClient;

namespace Minisplit_Proyecto_Final___Equipo_Dev.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class AcercaDeController : ControllerBase
    {
        private readonly string cadenaSQL;

        public AcercaDeController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<AcercaDe> lista = new List<AcercaDe>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_AcercaDe", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(new AcercaDe()
                            {
                                IDAcercaDe = Convert.ToInt32(reader["IDAcercaDe"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                Contenido = reader["Contenido"].ToString()
                            });
                        }
                    }
                }
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = lista });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message, response = lista });
            }
        }

    [HttpGet]
    [Route("Obtener/{IDAcercaDe:int}")]
    public IActionResult Obtener(int IDAcercaDe)
    {
        AcercaDe acercaDe = null;

        try
        {
            using (var conexion = new SqlConnection(cadenaSQL))
            {
                conexion.Open();
                var cmd = new SqlCommand("sp_obtener_AcercaDe", conexion);
                cmd.Parameters.AddWithValue("IDAcercaDe", IDAcercaDe);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        acercaDe = new AcercaDe()
                        {
                            IDAcercaDe = Convert.ToInt32(reader["IDAcercaDe"]),
                            IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                            Contenido = reader["Contenido"].ToString()
                        };
                    }
                }
            }

            if (acercaDe != null)
            {
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = acercaDe });
            }
            else
            {
                return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Registro no encontrado" });
            }
        }
        catch (Exception error)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
        }
    }


        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] AcercaDeDTO objeto)
        {
            if (objeto == null || string.IsNullOrWhiteSpace(objeto.Contenido))
            {
                return BadRequest(new { mensaje = "Datos inválidos o incompletos." });
            }

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_guardar_AcercaDe", conexion);
                    cmd.Parameters.AddWithValue("IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("Contenido", objeto.Contenido);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Guardado con éxito" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPut]
        [Route("Editar/{IDAcercaDe:int}")]
        public IActionResult Editar(int IDAcercaDe, [FromBody] AcercaDeUpdateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Contenido))
            {
                return BadRequest(new { mensaje = "El contenido no puede estar vacío o es inválido." });
            }

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_editar_AcercaDe", conexion);

                    cmd.Parameters.AddWithValue("IDAcercaDe", IDAcercaDe);
                    cmd.Parameters.AddWithValue("Contenido", dto.Contenido);

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Editado con éxito" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpDelete]
        [Route("Eliminar/{IDAcercaDe:int}")]
        public IActionResult Eliminar(int IDAcercaDe)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_eliminar_AcercaDe", conexion);
                    cmd.Parameters.AddWithValue("IDAcercaDe", IDAcercaDe);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }
                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Eliminado" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }
    }
}
