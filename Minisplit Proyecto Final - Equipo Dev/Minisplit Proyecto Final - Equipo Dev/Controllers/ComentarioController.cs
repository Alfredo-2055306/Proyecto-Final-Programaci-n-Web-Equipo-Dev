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

        [HttpGet]
        [Route("ListaPorUsuario/{IDUsuario:int}")]
        public IActionResult ListaPorUsuario(int IDUsuario)
        {
            List<ComentarioDTO> comentariosAprobados = new List<ComentarioDTO>();
            List<ComentarioDTO> comentariosPendientes = new List<ComentarioDTO>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_ComentarioPorUsuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDUsuario", IDUsuario);

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
        public IActionResult Guardar([FromBody] GuardarComentarioDTO objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_guardar_Comentario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("Comentario", objeto.ComentarioTexto);
                    cmd.Parameters.AddWithValue("FechaCreacion", objeto.FechaCreacion);
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Comentario guardado correctamente" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        [HttpPut]
        [Route("Editar")]
        public IActionResult Editar([FromBody] ComentarioDTO objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_editar_Comentario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDComentario", objeto.IDComentario);
                    cmd.Parameters.AddWithValue("Comentario", (object)objeto.ComentarioTexto ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("FechaModificacion", DateTime.Now);
                    cmd.Parameters.AddWithValue("Aprobada", (object)objeto.Aprobada ?? DBNull.Value);
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Comentario editado correctamente" });
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
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDComentario", IDComentario);
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Comentario eliminado correctamente" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }
    }
}
