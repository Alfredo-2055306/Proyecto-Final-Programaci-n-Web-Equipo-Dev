using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minisplit_Proyecto_Final___Equipo_Dev.Models;
using System.Data;
using System.Data.SqlClient;

namespace Minisplit_Proyecto_Final___Equipo_Dev.Controllers
{
    [EnableCors("ReglasCors")]
    [Route("api/[controller]")]
    [ApiController]
    public class MantenimientoController : ControllerBase
    {
        private readonly string cadenaSQL;

        public MantenimientoController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<Mantenimiento> Lista = new List<Mantenimiento>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_listar_mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Lista.Add(new Mantenimiento()
                            {
                                IDMantenimiento = Convert.ToInt32(reader["IDMantenimiento"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                Direccion = reader["Direccion"].ToString(),
                                ProblemaDescripcion = reader["ProblemaDescripcion"].ToString(),
                                FechaReservacion = Convert.ToDateTime(reader["FechaReservacion"]),
                                Aprobada = Convert.ToBoolean(reader["Aprobada"])
                            });
                        }
                    }
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = Lista });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message, response = Lista });
            }
        }

        [HttpGet]
        [Route("Obtener/{IDMantenimiento:int}")]
        public IActionResult Obtener(int IDMantenimiento)
        {
            Mantenimiento mantenimiento = null;

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_obtener_mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDMantenimiento", IDMantenimiento);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            mantenimiento = new Mantenimiento()
                            {
                                IDMantenimiento = Convert.ToInt32(reader["IDMantenimiento"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                Direccion = reader["Direccion"].ToString(),
                                ProblemaDescripcion = reader["ProblemaDescripcion"].ToString(),
                                FechaReservacion = Convert.ToDateTime(reader["FechaReservacion"]),
                                Aprobada = Convert.ToBoolean(reader["Aprobada"])
                            };
                        }
                    }
                }

                if (mantenimiento != null)
                {
                    return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = mantenimiento });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Mantenimiento no encontrado" });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] Mantenimiento objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_guardar_mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("@IDMarca", objeto.IDMarca);
                    cmd.Parameters.AddWithValue("@IDModelo", objeto.IDModelo);
                    cmd.Parameters.AddWithValue("@Direccion", objeto.Direccion);
                    cmd.Parameters.AddWithValue("@ProblemaDescripcion", objeto.ProblemaDescripcion);
                    cmd.Parameters.AddWithValue("@FechaReservacion", objeto.FechaReservacion);
                    cmd.Parameters.AddWithValue("@Aprobada", objeto.Aprobada);

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
        public IActionResult Editar([FromBody] Mantenimiento objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_editar_mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDMantenimiento", objeto.IDMantenimiento);
                    cmd.Parameters.AddWithValue("@IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("@IDMarca", objeto.IDMarca);
                    cmd.Parameters.AddWithValue("@IDModelo", objeto.IDModelo);
                    cmd.Parameters.AddWithValue("@Direccion", objeto.Direccion);
                    cmd.Parameters.AddWithValue("@ProblemaDescripcion", objeto.ProblemaDescripcion);
                    cmd.Parameters.AddWithValue("@FechaReservacion", objeto.FechaReservacion);
                    cmd.Parameters.AddWithValue("@Aprobada", objeto.Aprobada);

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
        [Route("Eliminar/{IDMantenimiento:int}")]
        public IActionResult Eliminar(int IDMantenimiento)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_eliminar_mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDMantenimiento", IDMantenimiento);

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
