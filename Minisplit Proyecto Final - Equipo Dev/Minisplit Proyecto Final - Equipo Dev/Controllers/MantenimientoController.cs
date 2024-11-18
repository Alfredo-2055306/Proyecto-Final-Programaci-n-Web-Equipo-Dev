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
            List<MantenimientoDTO> Lista = new List<MantenimientoDTO>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_Mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Lista.Add(new MantenimientoDTO()
                            {
                                IDMantenimiento = Convert.ToInt32(reader["IDMantenimiento"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                Direccion = reader["Direccion"].ToString(),
                                ProblemaDescripcion = reader["ProblemaDescripcion"].ToString(),
                                FechaReservacion = Convert.ToDateTime(reader["FechaReservacion"]),
                                Aprobada = Convert.ToBoolean(reader["Aprobada"]),

                                // Relaciones
                                NombreUsuario = reader["NombreUsuario"].ToString(),
                                NombreMarca = reader["NombreMarca"].ToString(),
                                NombreModelo = reader["NombreModelo"].ToString(),
                                ImagenRuta = reader["ImagenRuta"].ToString(),
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
        [Route("ListaPorUsuario/{IDUsuario:int}")]
        public IActionResult ListaPorUsuario(int IDUsuario)
        {
            List<MantenimientoUsuarioDTO> lista = new List<MantenimientoUsuarioDTO>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_lista_Mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (Convert.ToInt32(reader["IDUsuario"]) == IDUsuario)
                            {
                                lista.Add(new MantenimientoUsuarioDTO()
                                {
                                    IDMantenimiento = Convert.ToInt32(reader["IDMantenimiento"]),
                                    NombreMinisplit = $"{reader["NombreMarca"]} - {reader["NombreModelo"]}",
                                    ProblemaDescripcion = $"{reader["ProblemaDescripcion"]}",
                                    FechaReservacion = Convert.ToDateTime(reader["FechaReservacion"]),
                                    Aprobada = Convert.ToBoolean(reader["Aprobada"]),
                                });
                            }
                        }
                    }
                }

                if (lista.Count > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = lista });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "No se encontraron mantenimientos para el usuario." });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpGet]
        [Route("Obtener/{IDMantenimiento:int}")]
        public IActionResult Obtener(int IDMantenimiento)
        {
            MantenimientoDTO mantenimiento = null;

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
                            mantenimiento = new MantenimientoDTO()
                            {
                                IDMantenimiento = Convert.ToInt32(reader["IDMantenimiento"]),
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                IDMarca = Convert.ToInt32(reader["IDMarca"]),
                                IDModelo = Convert.ToInt32(reader["IDModelo"]),
                                Direccion = reader["Direccion"].ToString(),
                                ProblemaDescripcion = reader["ProblemaDescripcion"].ToString(),
                                FechaReservacion = Convert.ToDateTime(reader["FechaReservacion"]),
                                Aprobada = Convert.ToBoolean(reader["Aprobada"]),

                                NombreUsuario = reader["NombreUsuario"].ToString(),
                                NombreMarca = reader["NombreMarca"].ToString(),
                                NombreModelo = reader["NombreModelo"].ToString(),
                                ImagenRuta = reader["ImagenRuta"].ToString(),
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
        public IActionResult Guardar([FromBody] MantenimientoCreateDTO objeto)
        {
            try
            {
                // Validar existencia del Minisplit
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();

                    var validarCmd = new SqlCommand(
                        "SELECT COUNT(1) FROM Minisplit WHERE IDMarca = @IDMarca AND IDModelo = @IDModelo",
                        conexion
                    );
                    validarCmd.Parameters.AddWithValue("@IDMarca", objeto.IDMarca);
                    validarCmd.Parameters.AddWithValue("@IDModelo", objeto.IDModelo);

                    int existeMinisplit = Convert.ToInt32(validarCmd.ExecuteScalar());
                    if (existeMinisplit == 0)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, new { mensaje = "El Minisplit no existe." });
                    }

                    // Guardar el mantenimiento
                    var cmd = new SqlCommand("sp_solicitar_Mantenimiento", conexion)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    cmd.Parameters.AddWithValue("@IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("@IDMarca", objeto.IDMarca);
                    cmd.Parameters.AddWithValue("@IDModelo", objeto.IDModelo);
                    cmd.Parameters.AddWithValue("@Direccion", objeto.Direccion);
                    cmd.Parameters.AddWithValue("@ProblemaDescripcion", objeto.ProblemaDescripcion);
                    cmd.Parameters.AddWithValue("@FechaReservacion", objeto.FechaReservacion);
                    cmd.Parameters.AddWithValue("@Aprobada", 0); // Por defecto no aprobada
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
        [Route("Aprobar/{IDMantenimiento:int}")]
        public IActionResult Aprobar(int IDMantenimiento)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("sp_aprobar_Mantenimiento", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("IDMantenimiento", IDMantenimiento);
                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Solicitud de mantenimiento aprobada correctamente" });
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
                    var cmd = new SqlCommand("sp_eliminar_mantenimiento", conexion);
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
