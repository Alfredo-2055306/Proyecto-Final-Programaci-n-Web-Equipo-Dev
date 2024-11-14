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
    public class ComentarioController : ControllerBase
    {
        private readonly string cadenaSQL;

        public ComentarioController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }


        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<ComentarioDTO> comentariosAprobados = new List<ComentarioDTO>();
            List<ComentarioDTO> comentariosPendientes = new List<ComentarioDTO>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_Comentario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var comentario = new ComentarioDTO()
                            {
                                IDComentario = Convert.ToInt32(reader["IDComentario"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                NombreUsuario = reader["Nombre"].ToString(),
                                ComentarioTexto = reader["Comentario"].ToString(),
                                FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"]),
                                FechaModificacion = Convert.ToDateTime(reader["FechaModificacion"]),
                                Aprobada = Convert.ToBoolean(reader["Aprobada"])
                            };

                            if (comentario.Aprobada)
                            {
                                comentariosAprobados.Add(comentario);
                            }
                            else
                            {
                                comentariosPendientes.Add(comentario);
                            }
                        }
                    }
                }

                return StatusCode(StatusCodes.Status200OK, new
                {
                    mensaje = "ok",
                    aprobados = comentariosAprobados,
                    pendientes = comentariosPendientes
                });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPut]
        [Route("Aprobar/{IDComentario:int}")]
        public IActionResult Aprobar(int IDComentario)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_aprobar_Comentario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDComentario", IDComentario);
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Comentario aprobado correctamente" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] Comentario objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_guardar_Comentario", conexion);
                    cmd.Parameters.AddWithValue("IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("Comentario", objeto.ComentarioTexto);
                    cmd.Parameters.AddWithValue("FechaCreacion", objeto.FechaCreacion);
                    cmd.Parameters.AddWithValue("FechaModificacion", objeto.FechaModificacion);
                    cmd.Parameters.AddWithValue("Aprobada", objeto.Aprobada);
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
        public IActionResult Editar([FromBody] Comentario objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_editar_Comentario", conexion);
                    cmd.Parameters.AddWithValue("IDComentario", objeto.IDComentario);
                    cmd.Parameters.AddWithValue("IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("Comentario", objeto.ComentarioTexto);
                    cmd.Parameters.AddWithValue("FechaModificacion", objeto.FechaModificacion);
                    cmd.Parameters.AddWithValue("Aprobada", objeto.Aprobada);
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
        [Route("Eliminar/{IDComentario:int}")]
        public IActionResult Eliminar(int IDComentario)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_eliminar_Comentario", conexion);
                    cmd.Parameters.AddWithValue("IDComentario", IDComentario);
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
