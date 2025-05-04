document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    if (!form) {
        console.error('Error: No se encontró el formulario de login en el DOM.');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recarga automática de la página

        const email = document.getElementById('email').value.trim();
        const contraseña = document.getElementById('password').value.trim();

        console.log('Intentando iniciar sesión con:', { email, contraseña });

        if (!email || !contraseña) {
            console.error('Error: Email o contraseña vacíos.');
            alert('Por favor ingresa ambos valores.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contraseña })
            });

            console.log('Código de respuesta del servidor:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en el login:', errorText);
                alert(`Error en el login: ${errorText}`);
                return;
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (!data.token) {
                console.error('Error: El backend no envió un token válido.');
                alert('No se recibió un token válido. Intenta nuevamente.');
                return;
            }

            // Guarda el token de forma segura
            localStorage.setItem('token', data.token);
            console.log('Token guardado en localStorage:', localStorage.getItem('token'));

            // Verifica que el token se guarda antes de redirigir
            if (localStorage.getItem('token')) {
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 100);
            } else {
                console.error('Error: El token no se guardó correctamente.');
                alert('Hubo un problema al guardar el token.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un problema al intentar iniciar sesión.');
        }
    });
});
