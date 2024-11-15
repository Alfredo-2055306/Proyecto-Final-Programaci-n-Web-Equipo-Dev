﻿using Microsoft.AspNetCore.Cors;
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
        public IActionResult Autenticar([FromBody] Usuario loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Correo) || string.IsNullOrEmpty(loginData.Contraseña))
            {
                return BadRequest("Correo o contraseña no proporcionados.");
            }
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("SELECT * FROM Usuario WHERE Correo = @Correo", conexion);
                    cmd.Parameters.AddWithValue("@Correo", loginData.Correo);

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var contraseñaGuardada = reader["Contraseña"].ToString();
                            // Verifica que las contraseñas coincidan. Si está encriptada, compara con bcrypt.
                            if (loginData.Contraseña == contraseñaGuardada)
                            {
                                return StatusCode(StatusCodes.Status200OK, new { mensaje = "Autenticado", response = reader["IDUsuario"] });
                            }
                            else
                            {
                                return StatusCode(StatusCodes.Status401Unauthorized, new { mensaje = "Correo o contraseña incorrectos" });
                            }
                        }
                        else
                        {
                            return StatusCode(StatusCodes.Status404NotFound, new { mensaje = "Usuario no encontrado" });
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
        public IActionResult Guardar([FromBody] Usuario objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_registrar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Nombre", objeto.Nombre);
                    cmd.Parameters.AddWithValue("@Correo", objeto.Correo);
                    cmd.Parameters.AddWithValue("@Contraseña", objeto.Contraseña);
                    cmd.Parameters.AddWithValue("@IDRol", objeto.IDRol);

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
        public IActionResult Editar([FromBody] Usuario objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(cadenaSQL))
                {
                    conexion.Open();
                    var cmd = new SqlCommand("usp_modificar_usuario", conexion);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IDUsuario", objeto.IDUsuario);
                    cmd.Parameters.AddWithValue("@Nombre", objeto.Nombre);
                    cmd.Parameters.AddWithValue("@Correo", objeto.Correo);
                    cmd.Parameters.AddWithValue("@Contraseña", objeto.Contraseña);
                    cmd.Parameters.AddWithValue("@IDRol", objeto.IDRol);

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
