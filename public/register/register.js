document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const nickname = document.getElementById("nickname").value;
    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;
    const confirmarContraseña = document.getElementById("confirmar-contraseña").value;
    const perfil = document.getElementById("perfil").value;

    // Validar que las contraseñas coincidan
    if (contraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Validación específica para perfil de administrador
    if (perfil === "admin") {
        alert("Para registrar un perfil de administrador necesitas una autorización o certificación válida. Actualmente estás registrado como usuario.");
        return;
    }

    const usuario = { nombre, nickname, email, contraseña, perfil };
    console.log("Enviando datos:", usuario);

    try {
        const response = await fetch("http://localhost:3000/api/usuarios/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(errorText || "Error en el registro.");
            return;
        }

        const data = await response.json();
        alert(data.mensaje);

        // Redirigir al login tras registro exitoso
        window.location.href = "../login/login.html"; 
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al conectar con el servidor.");
    }
});
