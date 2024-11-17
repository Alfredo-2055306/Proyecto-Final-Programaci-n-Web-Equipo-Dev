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
    public class UsuarioController : ControllerBase
    {
        private readonly string cadenaSQL;

        public UsuarioController(IConfiguration config)
        {
            cadenaSQL = config.GetConnectionString("CadenaSQL");
        }

        [HttpGet]
        [Route("Lista")]
        public IActionResult Lista()
        {
            List<Usuario> Lista = new List<Usuario>();

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_listar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Lista.Add(new Usuario()
                            {
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                Nombre = reader["Nombre"].ToString(),
                                Correo = reader["Correo"].ToString(),
                                Contraseña = reader["Contraseña"].ToString(),
                                IDRol = Convert.ToInt32(reader["IDRol"])
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
        [Route("Obtener/{IDUsuario:int}")]
        public IActionResult Obtener(int IDUsuario)
        {
            Usuario usuario = null;

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_obtener_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDUsuario", IDUsuario);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            usuario = new Usuario()
                            {
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                Nombre = reader["Nombre"].ToString(),
                                Correo = reader["Correo"].ToString(),
                                Contraseña = reader["Contraseña"].ToString(),
                                IDRol = Convert.ToInt32(reader["IDRol"])
                            };
                        }
                    }
                }

                if (usuario != null)
                {
                    return StatusCode(StatusCodes.Status200OK, new { mensaje = "ok", response = usuario });
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Usuario no encontrado" });
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }

        [HttpPost]
        [Route("Autenticar")]
        public IActionResult Autenticar([FromBody] UsuarioLoginDTO loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Correo) || string.IsNullOrEmpty(loginData.Contraseña))
            {
                return BadRequest(new { mensaje = "Correo o contraseña no proporcionados." });
            }

            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();

                    var cmd = new SqlCommand("usp_autenticar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Correo", loginData.Correo);
                    cmd.Parameters.AddWithValue("@Contraseña", loginData.Contraseña);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var usuario = new
                            {
                                IDUsuario = Convert.ToInt32(reader["IDUsuario"]),
                                Nombre = reader["Nombre"].ToString(),
                                Correo = reader["Correo"].ToString(),
                                IDRol = Convert.ToInt32(reader["IDRol"]),
                                NombreRol = reader["NombreRol"].ToString()
                            };

                            return StatusCode(StatusCodes.Status200OK, new { mensaje = "Autenticado", response = usuario });
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Correo o contraseña incorrectos." });
                        }
                    }
                }
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPost]
        [Route("Guardar")]
        public IActionResult Guardar([FromBody] UsuarioCrearDTO usuarioDTO)
        {
            try
            {
                // Validación básica
                if (usuarioDTO == null)
                {
                    return BadRequest(new { mensaje = "Los datos del usuario son inválidos." });
                }

                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_registrar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Nombre", usuarioDTO.Nombre);
                    cmd.Parameters.AddWithValue("@Correo", usuarioDTO.Correo);
                    cmd.Parameters.AddWithValue("@Contraseña", usuarioDTO.Contraseña);
                    cmd.Parameters.AddWithValue("@IDRol", usuarioDTO.IDRol);

                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Usuario registrado correctamente." });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpPut]
        [Route("Editar")]
        public IActionResult Editar([FromBody] UsuarioEditarRolDTO objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_modificar_rol_usuario", conexion); // Nombre del procedimiento
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("@IDRol", objeto.IDRol);

                    cmd.ExecuteNonQuery();
                }

                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Rol actualizado correctamente" });
            }
            catch (Exception error)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = error.Message });
            }
        }


        [HttpDelete]
        [Route("Eliminar/{IDUsuario:int}")]
        public IActionResult Eliminar(int IDUsuario)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_eliminar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDUsuario", IDUsuario);

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
