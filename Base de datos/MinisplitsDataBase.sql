
USE [Danny Server]

GO


CREATE TABLE Rol (
    IDRol INT IDENTITY(1,1) PRIMARY KEY,
    NombreRol VARCHAR(50) NOT NULL
);

CREATE TABLE Marca (
    IDMarca INT IDENTITY(1,1) PRIMARY KEY,
    NombreMarca VARCHAR(50) NOT NULL
);

CREATE TABLE Modelo (
    IDModelo INT IDENTITY(1,1) PRIMARY KEY,
    NombreModelo VARCHAR(50) NOT NULL,
);

CREATE TABLE Usuario (
    IDUsuario INT IDENTITY(1,1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Correo VARCHAR(50) NOT NULL UNIQUE,
    Contraseña VARCHAR(255) NOT NULL,
    IDRol INT NOT NULL,
    FOREIGN KEY (IDRol) REFERENCES Rol(IDRol)
);


CREATE TABLE Minisplit (
	IDMarca INT NOT NULL,
	IDModelo INT NOT NULL,
    NombreMinisplit VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(300) NOT NULL,
    ImagenRuta VARCHAR(250) NOT NULL,
	FOREIGN KEY (IDMarca) REFERENCES Marca(IDMarca),
    FOREIGN KEY (IDModelo) REFERENCES Modelo(IDModelo),
	PRIMARY KEY(IDMarca, IDModelo)
);

CREATE TABLE Mantenimiento (
    IDMantenimiento INT IDENTITY(1, 1) PRIMARY KEY,
	IDUsuario INT NOT NULL,
    IDMarca INT NOT NULL,
	IDModelo INT NOT NULL,
	Direccion VARCHAR(200) NOT NULL,
	ProblemaDescripcion VARCHAR(300) NOT NULL,
	FechaReservacion DATETIME NOT NULL,
	Aprobada BIT NOT NULL,
	FOREIGN KEY (IDUsuario) REFERENCES Usuario(IDUsuario),
	FOREIGN KEY (IDMarca, IDModelo) REFERENCES Minisplit(IDMarca, IDModelo)
);

CREATE TABLE Comentario (
    IDComentario INT IDENTITY(1,1) PRIMARY KEY,
    IDUsuario INT NOT NULL,
    Comentario VARCHAR(500) NOT NULL,
    FechaCreacion DATETIME NOT NULL,
    FechaModificacion DATETIME NOT NULL,
    Aprobada BIT NOT NULL,
    FOREIGN KEY (IDUsuario) REFERENCES Usuario(IDUsuario)
);

CREATE TABLE AcercaDe (
    IDAcercaDe INT IDENTITY(1,1) PRIMARY KEY,
    IDUsuario INT NOT NULL,
    Contenido VARCHAR(1000) NOT NULL,
    FOREIGN KEY (IDUsuario) REFERENCES Usuario(IDUsuario)
);


INSERT INTO Mantenimiento (IDUsuario, IDMarca, IDModelo, Direccion, ProblemaDescripcion, FechaReservacion, Aprobada) VALUES
(35, 1, 1, 'Calle Los Pinos 123, Ciudad A', 'El minisplit no enfría correctamente.', '2024-11-10 14:30:00', 0),
(36, 2, 2, 'Av. Juárez 456, Ciudad B', 'Hace un ruido extraño al encender.', '2024-11-12 09:00:00', 0),
(37, 3, 3, 'Calle Morelos 789, Ciudad C', 'Tiene una fuga de agua.', '2024-11-14 11:00:00', 0),
(38, 4, 4, 'Calle Hidalgo 321, Ciudad D', 'No responde al control remoto.', '2024-11-15 16:00:00', 0),
(39, 35, 35, 'Av. Insurgentes 654, Ciudad E', 'Enciende pero no enfría.', '2024-11-16 10:30:00', 0),
(40, 36, 36, 'Calle Reforma 987, Ciudad F', 'El compresor no funciona.', '2024-11-17 08:00:00', 0),
(41, 37, 37, 'Av. Universidad 111, Ciudad G', 'Huele a quemado al encender.', '2024-11-18 13:30:00', 0),
(42, 38, 38, 'Calle Zaragoza 222, Ciudad H', 'No arranca después de un apagón.', '2024-11-19 15:00:00', 0),
(43, 39, 39, 'Av. Constitución 333, Ciudad I', 'El ventilador no gira.', '2024-11-20 10:00:00', 0),
(35, 40, 40, 'Calle Independencia 444, Ciudad J', 'Problemas con el flujo de aire.', '2024-11-21 12:00:00', 0);



DELETE FROM Usuario;
DELETE FROM Minisplit;
DELETE FROM Mantenimiento;
DELETE FROM Comentario;
DELETE FROM AcercaDe;
DELETE FROM Marca;
DELETE FROM Modelo;
DELETE FROM Rol;

DROP TABLE Usuario;
DROP TABLE Minisplit;
DROP TABLE Mantenimiento;
DROP TABLE Comentario;
DROP TABLE AcercaDe;
DROP TABLE Marca;
DROP TABLE Modelo;
DROP TABLE Rol;




-- Mostrar todos los datos de la tabla Usuario
SELECT * FROM Usuario;

-- Mostrar todos los datos de la tabla Rol
SELECT * FROM Rol;

-- Mostrar todos los datos de la tabla Minisplit
SELECT * FROM Minisplit;

-- Mostrar todos los datos de la tabla Marca
SELECT * FROM Marca;

-- Mostrar todos los datos de la tabla Modelo
SELECT * FROM Modelo;

-- Mostrar todos los datos de la tabla Mantenimiento
SELECT * FROM Mantenimiento;

-- Mostrar todos los datos de la tabla Comentario
SELECT * FROM Comentario;

-- Mostrar todos los datos de la tabla AcercaDe
SELECT * FROM AcercaDe;










USE [Danny Server];
GO

-- Procedimiento para listar roles
CREATE PROC sp_lista_Rol
AS
BEGIN
    SELECT IDRol, NombreRol FROM Rol;
END;
GO

-- Procedimiento para guardar un rol
CREATE PROC sp_guardar_Rol(
    @NombreRol VARCHAR(50)
)
AS
BEGIN
    INSERT INTO Rol (NombreRol) VALUES (@NombreRol);
END;
GO

-- Procedimiento para editar un rol
CREATE PROC sp_editar_Rol(
    @IDRol INT,
    @NombreRol VARCHAR(50) NULL
)
AS
BEGIN
    UPDATE Rol 
    SET NombreRol = ISNULL(@NombreRol, NombreRol)
    WHERE IDRol = @IDRol;
END;
GO

-- Procedimiento para eliminar un rol
CREATE PROC sp_eliminar_Rol(
    @IDRol INT
)
AS
BEGIN
    DELETE FROM Rol WHERE IDRol = @IDRol;
END;
GO


-- Procedimiento para listar marcas
CREATE PROC sp_lista_Marca
AS
BEGIN
    SELECT IDMarca, NombreMarca FROM Marca;
END;
GO

-- Procedimiento para guardar una marca
CREATE PROC sp_guardar_Marca(
    @NombreMarca VARCHAR(50)
)
AS
BEGIN
    INSERT INTO Marca (NombreMarca) VALUES (@NombreMarca);
END;
GO

-- Procedimiento para editar una marca
CREATE PROC sp_editar_Marca(
    @IDMarca INT,
    @NombreMarca VARCHAR(50) NULL
)
AS
BEGIN
    UPDATE Marca 
    SET NombreMarca = ISNULL(@NombreMarca, NombreMarca)
    WHERE IDMarca = @IDMarca;
END;
GO

-- Procedimiento para eliminar una marca
CREATE PROC sp_eliminar_Marca(
    @IDMarca INT
)
AS
BEGIN
    DELETE FROM Marca WHERE IDMarca = @IDMarca;
END;
GO

-- Procedimiento para listar modelos
CREATE PROCEDURE sp_lista_Modelo
AS
BEGIN
    SELECT IDModelo, NombreModelo FROM Modelo;
END;
GO

-- Procedimiento para guardar un modelo
CREATE PROCEDURE sp_guardar_Modelo(
    @NombreModelo VARCHAR(50)
)
AS
BEGIN
    INSERT INTO Modelo (NombreModelo) VALUES (@NombreModelo);
END;
GO

-- Procedimiento para editar un modelo
CREATE PROCEDURE sp_editar_Modelo(
    @IDModelo INT,
    @NombreModelo VARCHAR(50) NULL
)
AS
BEGIN
    UPDATE Modelo 
    SET NombreModelo = ISNULL(@NombreModelo, NombreModelo)
    WHERE IDModelo = @IDModelo;
END;
GO

-- Procedimiento para eliminar un modelo
CREATE PROCEDURE sp_eliminar_Modelo(
    @IDModelo INT
)
AS
BEGIN
    DELETE FROM Modelo WHERE IDModelo = @IDModelo;
END;
GO



USE [Danny Server];
GO

CREATE PROCEDURE usp_autenticar_usuario
    @Correo VARCHAR(50),
    @Contraseña VARCHAR(255)
AS
BEGIN
    SELECT 
        u.IDUsuario,
        u.Nombre,
        u.Correo,
        u.IDRol,
        r.NombreRol
    FROM Usuario u
    INNER JOIN Rol r ON u.IDRol = r.IDRol
    WHERE u.Correo = @Correo AND u.Contraseña = @Contraseña;
END;
GO



-- Procedimiento para listar usuarios
CREATE PROC sp_lista_Usuario
AS
BEGIN
    SELECT IDUsuario, Nombre, Correo, IDRol FROM Usuario;
END;
GO

-- Procedimiento para guardar un usuario
CREATE PROC sp_guardar_Usuario(
    @Nombre VARCHAR(50),
    @Correo VARCHAR(50),
    @Contraseña VARCHAR(255),
    @IDRol INT
)
AS
BEGIN
    INSERT INTO Usuario (Nombre, Correo, Contraseña, IDRol)
    VALUES (@Nombre, @Correo, @Contraseña, @IDRol);
END;
GO

-- Procedimiento para editar un usuario
CREATE PROC sp_editar_Usuario(
    @IDUsuario INT,
    @Nombre VARCHAR(50) NULL,
    @Correo VARCHAR(50) NULL,
    @Contraseña VARCHAR(255) NULL,
    @IDRol INT NULL
)
AS
BEGIN
    UPDATE Usuario 
    SET Nombre = ISNULL(@Nombre, Nombre),
        Correo = ISNULL(@Correo, Correo),
        Contraseña = ISNULL(@Contraseña, Contraseña),
        IDRol = ISNULL(@IDRol, IDRol)
    WHERE IDUsuario = @IDUsuario;
END;
GO

-- Procedimiento para eliminar un usuario
CREATE PROC sp_eliminar_Usuario(
    @IDUsuario INT
)
AS
BEGIN
    DELETE FROM Usuario WHERE IDUsuario = @IDUsuario;
END;
GO


CREATE PROCEDURE sp_lista_Minisplit
AS
BEGIN
    SELECT 
        m.IDMarca,
        ma.NombreMarca,    -- Obtener el nombre de la marca
        mo.NombreModelo,   -- Obtener el nombre del modelo
        m.IDModelo,
        m.NombreMinisplit,
        m.Descripcion,
        m.ImagenRuta
    FROM Minisplit m
    INNER JOIN Marca ma ON m.IDMarca = ma.IDMarca
    INNER JOIN Modelo mo ON m.IDModelo = mo.IDModelo
END


USE [Danny Server];
GO

-- Procedimiento para guardar un minisplit
CREATE PROC sp_guardar_Minisplit(
    @IDMarca INT,
    @IDModelo INT,
    @NombreMinisplit VARCHAR(100),
    @Descripcion VARCHAR(300),
    @ImagenRuta VARCHAR(250)
)
AS
BEGIN
    INSERT INTO Minisplit (IDMarca, IDModelo, NombreMinisplit, Descripcion, ImagenRuta)
    VALUES (@IDMarca, @IDModelo, @NombreMinisplit, @Descripcion, @ImagenRuta);
END;
GO

-- Procedimiento para editar un minisplit
CREATE PROC sp_editar_Minisplit(
    @IDMarca INT,
    @IDModelo INT,
    @NombreMinisplit VARCHAR(100) NULL,
    @Descripcion VARCHAR(300) NULL,
    @ImagenRuta VARCHAR(250) NULL
)
AS
BEGIN
    UPDATE Minisplit 
    SET NombreMinisplit = ISNULL(@NombreMinisplit, NombreMinisplit),
        Descripcion = ISNULL(@Descripcion, Descripcion),
        ImagenRuta = ISNULL(@ImagenRuta, ImagenRuta)
    WHERE IDMarca = @IDMarca AND IDModelo = @IDModelo;
END;
GO


-- Procedimiento para eliminar un minisplit
CREATE PROC sp_eliminar_Minisplit(
    @IDMarca INT,
    @IDModelo INT
)
AS
BEGIN
    DELETE FROM Minisplit WHERE IDMarca = @IDMarca AND IDModelo = @IDModelo;
END;
GO




DROP PROCEDURE sp_lista_Mantenimiento;
DROP PROCEDURE sp_guardar_Mantenimiento;
DROP PROCEDURE sp_editar_Mantenimiento;
DROP PROCEDURE sp_eliminar_Mantenimiento;


SELECT * 
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Mantenimiento';


USE [Danny Server];
GO


CREATE OR ALTER PROC sp_lista_Mantenimiento
AS
BEGIN
    SELECT 
        m.IDMantenimiento, 
        m.IDUsuario, 
        u.Nombre AS NombreUsuario, 
        ms.IDMarca, 
        ma.NombreMarca AS NombreMarca, 
        ms.IDModelo, 
        mo.NombreModelo AS NombreModelo, 
		ms.ImagenRuta AS ImagenRuta,
        m.Direccion, 
        m.ProblemaDescripcion, 
        m.FechaReservacion, 
        m.Aprobada
    FROM Mantenimiento m
    INNER JOIN Usuario u ON m.IDUsuario = u.IDUsuario
    INNER JOIN Minisplit ms ON m.IDMarca = ms.IDMarca AND m.IDModelo = ms.IDModelo
    INNER JOIN Marca ma ON ms.IDMarca = ma.IDMarca
    INNER JOIN Modelo mo ON ms.IDModelo = mo.IDModelo;
END;



CREATE PROCEDURE sp_obtener_Mantenimiento
    @IDMantenimiento INT
AS
BEGIN
    SELECT 
        m.IDMantenimiento, 
        m.IDUsuario, 
        u.Nombre AS NombreUsuario, 
        m.IDMarca, 
        ma.NombreMarca, 
        m.IDModelo, 
        mo.NombreModelo, 
        m.Direccion, 
        m.ProblemaDescripcion, 
        m.FechaReservacion, 
        m.Aprobada
    FROM Mantenimiento m
    INNER JOIN Usuario u ON m.IDUsuario = u.IDUsuario
    INNER JOIN Marca ma ON m.IDMarca = ma.IDMarca
    INNER JOIN Modelo mo ON m.IDModelo = mo.IDModelo
    WHERE m.IDMantenimiento = @IDMantenimiento
END



CREATE PROCEDURE sp_guardar_Mantenimiento
    @IDUsuario INT,
    @IDMarca INT,
    @IDModelo INT,
    @Direccion VARCHAR(200),
    @ProblemaDescripcion VARCHAR(300),
    @FechaReservacion DATETIME,
    @Aprobada BIT
AS
BEGIN
    INSERT INTO Mantenimiento (IDUsuario, IDMarca, IDModelo, Direccion, ProblemaDescripcion, FechaReservacion, Aprobada)
    VALUES (@IDUsuario, @IDMarca, @IDModelo, @Direccion, @ProblemaDescripcion, @FechaReservacion, @Aprobada);
END


USE [Danny Server];
GO

CREATE PROCEDURE sp_solicitar_Mantenimiento
    @IDUsuario INT,
    @IDMarca INT,
    @IDModelo INT,
    @Direccion VARCHAR(200),
    @ProblemaDescripcion VARCHAR(300),
    @FechaReservacion DATETIME,
    @Aprobada BIT
AS
BEGIN
    -- Validar que el Minisplit exista
    IF NOT EXISTS (
        SELECT 1
        FROM Minisplit
        WHERE IDMarca = @IDMarca AND IDModelo = @IDModelo
    )
    BEGIN
        RAISERROR('El Minisplit especificado no existe.', 16, 1);
        RETURN;
    END

    -- Insertar el mantenimiento
    INSERT INTO Mantenimiento (IDUsuario, IDMarca, IDModelo, Direccion, ProblemaDescripcion, FechaReservacion, Aprobada)
    VALUES (@IDUsuario, @IDMarca, @IDModelo, @Direccion, @ProblemaDescripcion, @FechaReservacion, @Aprobada);
END;



CREATE PROCEDURE sp_editar_Mantenimiento
    @IDMantenimiento INT,
    @IDUsuario INT,
    @IDMarca INT,
    @IDModelo INT,
    @Direccion VARCHAR(200),
    @ProblemaDescripcion VARCHAR(300),
    @FechaReservacion DATETIME,
    @Aprobada BIT
AS
BEGIN
    UPDATE Mantenimiento
    SET
        IDUsuario = @IDUsuario,
        IDMarca = @IDMarca,
        IDModelo = @IDModelo,
        Direccion = @Direccion,
        ProblemaDescripcion = @ProblemaDescripcion,
        FechaReservacion = @FechaReservacion,
        Aprobada = @Aprobada
    WHERE IDMantenimiento = @IDMantenimiento;
END

USE [Danny Server];
GO

CREATE PROCEDURE sp_aprobar_Mantenimiento
    @IDMantenimiento INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Mantenimiento
    SET Aprobada = 1
    WHERE IDMantenimiento = @IDMantenimiento;
END;

UPDATE Mantenimiento
SET Aprobada = 0
WHERE Aprobada = 1;



CREATE PROCEDURE sp_eliminar_Mantenimiento
    @IDMantenimiento INT
AS
BEGIN
    DELETE FROM Mantenimiento
    WHERE IDMantenimiento = @IDMantenimiento;
END





-- Procedimiento para listar 'AcercaDe'
CREATE PROC sp_lista_AcercaDe
AS
BEGIN
    SELECT IDAcercaDe, IDUsuario, Contenido 
    FROM AcercaDe;
END;
GO

CREATE OR ALTER PROCEDURE sp_obtener_AcercaDe
    @IDAcercaDe INT
AS
BEGIN
    SELECT IDAcercaDe, IDUsuario, Contenido
    FROM AcercaDe
    WHERE IDAcercaDe = @IDAcercaDe;
END;
GO


-- Procedimiento para guardar 'AcercaDe'
CREATE PROC sp_guardar_AcercaDe(
    @IDUsuario INT,
    @Contenido VARCHAR(1000)
)
AS
BEGIN
    INSERT INTO AcercaDe (IDUsuario, Contenido)
    VALUES (@IDUsuario, @Contenido);
END;
GO

USE [Danny Server];
GO

-- Procedimiento para editar 'AcercaDe'
CREATE PROC sp_editar_AcercaDe(
    @IDAcercaDe INT,
    @Contenido VARCHAR(1000)
)
AS
BEGIN
    IF @Contenido IS NOT NULL
    BEGIN
        UPDATE AcercaDe 
        SET Contenido = @Contenido
        WHERE IDAcercaDe = @IDAcercaDe;
    END
END;
GO


-- Procedimiento para eliminar 'AcercaDe'
CREATE PROC sp_eliminar_AcercaDe(
    @IDAcercaDe INT
)
AS
BEGIN
    DELETE FROM AcercaDe WHERE IDAcercaDe = @IDAcercaDe;
END;
GO






CREATE PROCEDURE sp_lista_Comentario
AS
BEGIN
    SELECT 
        c.IDComentario, 
        c.IDUsuario, 
        u.Nombre, 
        c.Comentario, 
        c.FechaCreacion, 
        c.FechaModificacion, 
        c.Aprobada
    FROM Comentario c
    INNER JOIN Usuario u ON c.IDUsuario = u.IDUsuario
END



USE [Danny Server];
GO

CREATE PROCEDURE sp_lista_ComentarioPorUsuario
    @IDUsuario INT
AS
BEGIN
    SELECT 
        c.IDComentario, 
        c.IDUsuario, 
        u.Nombre, 
        c.Comentario, 
        c.FechaCreacion, 
        c.FechaModificacion, 
        c.Aprobada
    FROM Comentario c
    INNER JOIN Usuario u ON c.IDUsuario = u.IDUsuario
    WHERE c.IDUsuario = @IDUsuario
END


CREATE PROCEDURE sp_obtener_ComentarioPorId
    @IDComentario INT
AS
BEGIN
    SELECT 
        c.IDComentario, 
        c.IDUsuario, 
        u.Nombre, 
        c.Comentario, 
        c.FechaCreacion, 
        c.FechaModificacion, 
        c.Aprobada
    FROM Comentario c
    INNER JOIN Usuario u ON c.IDUsuario = u.IDUsuario
    WHERE c.IDComentario = @IDComentario;
END;
GO

CREATE PROCEDURE sp_guardar_Comentario(
    @IDUsuario INT,
    @Comentario VARCHAR(500),
    @FechaCreacion DATETIME
)
AS
BEGIN
    INSERT INTO Comentario (IDUsuario, Comentario, FechaCreacion, FechaModificacion, Aprobada)
    VALUES (@IDUsuario, @Comentario, @FechaCreacion, GETDATE(), 0); -- Aprobada se establece como 0
END;
GO


USE [Danny Server];
GO

CREATE PROCEDURE sp_editar_Comentario(
    @IDComentario INT,
    @Comentario VARCHAR(500) NULL,
    @FechaModificacion DATETIME NULL,
    @Aprobada BIT NULL
)
AS
BEGIN
    UPDATE Comentario 
    SET Comentario = ISNULL(@Comentario, Comentario),
        FechaModificacion = ISNULL(@FechaModificacion, GETDATE()), -- Actualiza la fecha a la actual si es nula
        Aprobada = ISNULL(@Aprobada, Aprobada)
    WHERE IDComentario = @IDComentario;
END;
GO


-- Procedimiento para eliminar un comentario
CREATE PROC sp_eliminar_Comentario(
    @IDComentario INT
)
AS
BEGIN
    DELETE FROM Comentario WHERE IDComentario = @IDComentario;
END;
GO

CREATE PROC sp_aprobar_Comentario
    @IDComentario INT
AS
BEGIN
    UPDATE Comentario
    SET Aprobada = 1
    WHERE IDComentario = @IDComentario;
END;
GO











sp_lista_Usuario



USE [Danny Server]

GO


--************************ VALIDAMOS SI EXISTE EL PROCEDIMIENTO ************************--

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_registrar_usuario')
    DROP PROCEDURE usp_registrar_usuario
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_modificar_usuario')
    DROP PROCEDURE usp_modificar_usuario
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_obtener_usuario')
    DROP PROCEDURE usp_obtener_usuario
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_listar_usuario')
    DROP PROCEDURE usp_listar_usuario
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_eliminar_usuario')
    DROP PROCEDURE usp_eliminar_usuario
GO

--************************ PROCEDIMIENTOS PARA CREAR ************************--

-- Procedimiento para registrar un usuario
CREATE PROCEDURE usp_registrar_usuario(
    @Nombre VARCHAR(50),
    @Correo VARCHAR(50),
    @Contraseña VARCHAR(255),
    @IDRol INT
)
AS
BEGIN
    INSERT INTO Usuario(Nombre, Correo, Contraseña, IDRol)
    VALUES (@Nombre, @Correo, @Contraseña, @IDRol)
END
GO

-- Procedimiento para modificar un usuario
CREATE PROCEDURE usp_modificar_usuario(
    @IDUsuario INT,
    @Nombre VARCHAR(50),
    @Correo VARCHAR(50),
    @Contraseña VARCHAR(255),
    @IDRol INT
)
AS
BEGIN
    UPDATE Usuario
    SET 
        Nombre = @Nombre,
        Correo = @Correo,
        Contraseña = @Contraseña,
        IDRol = @IDRol
    WHERE IDUsuario = @IDUsuario
END
GO

-- Procedimiento para obtener un usuario por ID
CREATE PROCEDURE usp_obtener_usuario(
    @IDUsuario INT
)
AS
BEGIN
    SELECT * FROM Usuario WHERE IDUsuario = @IDUsuario
END
GO

-- Procedimiento para listar todos los usuarios
CREATE PROCEDURE usp_listar_usuario
AS
BEGIN
    SELECT * FROM Usuario
END
GO

-- Procedimiento para eliminar un usuario por ID
CREATE PROCEDURE usp_eliminar_usuario(
    @IDUsuario INT
)
AS
BEGIN
    DELETE FROM Usuario WHERE IDUsuario = @IDUsuario
END
GO

USE [Danny Server]

GO

CREATE PROCEDURE usp_modificar_rol_usuario
    @IDUsuario INT,
    @IDRol INT
AS
BEGIN
    UPDATE Usuario
    SET IDRol = @IDRol
    WHERE IDUsuario = @IDUsuario;
END;



--************************ VALIDAMOS SI EXISTE EL PROCEDIMIENTO ************************--

-- Procedimiento para obtener un modelo por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_obtener_modelo')
    DROP PROCEDURE usp_obtener_modelo
GO

CREATE PROCEDURE usp_obtener_modelo(
    @IDModelo INT
)
AS
BEGIN
    SELECT * FROM Modelo WHERE IDModelo = @IDModelo
END
GO

-- Procedimiento para obtener una marca por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_obtener_marca')
    DROP PROCEDURE usp_obtener_marca
GO

CREATE PROCEDURE usp_obtener_marca(
    @IDMarca INT
)
AS
BEGIN
    SELECT * FROM Marca WHERE IDMarca = @IDMarca
END
GO


-- Procedimiento para obtener un minisplit por IDMarca e IDModelo
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_obtener_minisplit')
    DROP PROCEDURE usp_obtener_minisplit
GO

CREATE PROCEDURE usp_obtener_minisplit(
    @IDMarca INT,
    @IDModelo INT
)
AS
BEGIN
    SELECT * FROM Minisplit 
    WHERE IDMarca = @IDMarca AND IDModelo = @IDModelo
END
GO






-- Procedimiento para listar mantenimientos
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_listar_mantenimiento')
    DROP PROCEDURE usp_listar_mantenimiento
GO

CREATE PROCEDURE usp_listar_mantenimiento
AS
BEGIN
    SELECT * FROM Mantenimiento;
END;
GO

-- Procedimiento para obtener un mantenimiento por ID
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_obtener_mantenimiento')
    DROP PROCEDURE usp_obtener_mantenimiento
GO

CREATE PROCEDURE usp_obtener_mantenimiento(
    @IDMantenimiento INT
)
AS
BEGIN
    SELECT * FROM Mantenimiento WHERE IDMantenimiento = @IDMantenimiento;
END;
GO

-- Procedimiento para guardar un mantenimiento
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_guardar_mantenimiento')
    DROP PROCEDURE usp_guardar_mantenimiento
GO

CREATE PROCEDURE usp_guardar_mantenimiento(
    @IDUsuario INT,
    @IDMarca INT,
    @IDModelo INT,
    @Direccion VARCHAR(200),
    @ProblemaDescripcion VARCHAR(300),
    @FechaReservacion DATETIME,
    @Aprobada BIT
)
AS
BEGIN
    INSERT INTO Mantenimiento (IDUsuario, IDMarca, IDModelo, Direccion, ProblemaDescripcion, FechaReservacion, Aprobada)
    VALUES (@IDUsuario, @IDMarca, @IDModelo, @Direccion, @ProblemaDescripcion, @FechaReservacion, @Aprobada);
END;
GO

-- Procedimiento para editar un mantenimiento
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_editar_mantenimiento')
    DROP PROCEDURE usp_editar_mantenimiento
GO

CREATE PROCEDURE usp_editar_mantenimiento(
    @IDMantenimiento INT,
    @IDUsuario INT,
    @IDMarca INT,
    @IDModelo INT,
    @Direccion VARCHAR(200),
    @ProblemaDescripcion VARCHAR(300),
    @FechaReservacion DATETIME,
    @Aprobada BIT
)
AS
BEGIN
    UPDATE Mantenimiento
    SET IDUsuario = @IDUsuario,
        IDMarca = @IDMarca,
        IDModelo = @IDModelo,
        Direccion = @Direccion,
        ProblemaDescripcion = @ProblemaDescripcion,
        FechaReservacion = @FechaReservacion,
        Aprobada = @Aprobada
    WHERE IDMantenimiento = @IDMantenimiento;
END;
GO

-- Procedimiento para eliminar un mantenimiento
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_eliminar_mantenimiento')
    DROP PROCEDURE usp
