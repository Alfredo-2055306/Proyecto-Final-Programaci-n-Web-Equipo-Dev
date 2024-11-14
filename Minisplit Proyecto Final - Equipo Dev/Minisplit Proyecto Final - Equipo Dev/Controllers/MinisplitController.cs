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
    public class MinisplitController : ControllerBase
    {
        private readonly string cadenaSQL;

        public MinisplitController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<MinisplitDTO> lista = new List<MinisplitDTO>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_Minisplit", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(new MinisplitDTO()
                            {
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                NombreMinisplit = reader["NombreMinisplit"]?.ToString(),
                                Descripcion = reader["Descripcion"]?.ToString(),
                                ImagenRuta = reader["ImagenRuta"]?.ToString(),
                                NombreMarca = reader["NombreMarca"]?.ToString(),
                                NombreModelo = reader["NombreModelo"]?.ToString()
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
        [Route("Obtener/{IDMarca:int}/{IDModelo:int}")]
        public IActionResult Obtener(int IDMarca, int IDModelo)
        {
            Minisplit minisplit = null;

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_obtener_minisplit", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDMarca", IDMarca);
                    cmd.Parameters.AddWithValue("@IDModelo", IDModelo);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            minisplit = new Minisplit()
                            {
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                NombreMinisplit = reader["NombreMinisplit"].ToString(),
                                Descripcion = reader["Descripcion"].ToString(),
                                ImagenRuta = reader["ImagenRuta"].ToString()
                            };
                        }
                    }
                }

                if (minisplit != null)
                {
                    return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = minisplit });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Minisplit no encontrado" });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] Minisplit objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_guardar_Minisplit", conexion);
                    cmd.Parameters.AddWithValue("IDMarca", objeto.IDMarca);
                    cmd.Parameters.AddWithValue("IDModelo", objeto.IDModelo);
                    cmd.Parameters.AddWithValue("NombreMinisplit", objeto.NombreMinisplit);
                    cmd.Parameters.AddWithValue("Descripcion", objeto.Descripcion);
                    cmd.Parameters.AddWithValue("ImagenRuta", objeto.ImagenRuta);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        [HttpPut]
        [Route("Editar")]
        public IActionResult Editar([FromBody] Minisplit objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_editar_Minisplit", conexion);
                    cmd.Parameters.AddWithValue("IDMarca", objeto.IDMarca);
                    cmd.Parameters.AddWithValue("IDModelo", objeto.IDModelo);
                    cmd.Parameters.AddWithValue("NombreMinisplit", objeto.NombreMinisplit);
                    cmd.Parameters.AddWithValue("Descripcion", objeto.Descripcion);
                    cmd.Parameters.AddWithValue("ImagenRuta", objeto.ImagenRuta);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Editado" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        [HttpDelete]
        [Route("Eliminar/{IDMarca:int}/{IDModelo:int}")]
        public IActionResult Eliminar(int IDMarca, int IDModelo)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_eliminar_Minisplit", conexion);
                    cmd.Parameters.AddWithValue("IDMarca", IDMarca);
                    cmd.Parameters.AddWithValue("IDModelo", IDModelo);
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
