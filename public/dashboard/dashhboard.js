// Recuperar el token del almacenamiento local
const token = localStorage.getItem('token');

// Verificar si el usuario está autenticado
if (!token) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = '/login';
} else {
    // Obtener datos del dashboard desde el servidor
    fetch('http://localhost:3000/api/dashboard/data', { // ✅ Ajustado para API correcta
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 403) {
                alert('Acceso denegado. Solo administradores.');
                window.location.href = '/login';
                throw new Error('Acceso denegado');
            }
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data) {
            throw new Error('Los datos del dashboard están vacíos.');
        }

        console.log('🔍 Datos del dashboard recibidos:', data); // Debug

        // Verificación y asignación de datos en el DOM
        const totalUsers = document.getElementById('total-users');
        if (totalUsers) totalUsers.textContent = data.totalUsers ?? '0';

        const activeSessions = document.getElementById('active-sessions');
        if (activeSessions) activeSessions.textContent = data.activeSessions ?? '0';

        const newRegistrations = document.getElementById('new-registrations');
        if (newRegistrations) newRegistrations.textContent = data.newRegistrations ?? '0';

        // Mostrar actividad reciente si el elemento existe
        const activitiesList = document.getElementById('recent-activities');
        if (activitiesList) {
            activitiesList.innerHTML = '';
            (data.recentActivities || []).forEach(activity => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${activity.user} - ${activity.action} (${new Date(activity.timestamp).toLocaleString()})`;
                activitiesList.appendChild(li);
            });
        }

        // Mostrar libros si el elemento existe
        const bookList = document.getElementById('book-list');
        if (bookList) {
            bookList.innerHTML = '';
            (data.books || []).forEach(book => {
                const col = document.createElement('div');
                col.className = 'col-md-3';

                col.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">${book.author}</p>
                            <p class="text-muted">${book.category}</p>
                        </div>
                    </div>
                `;
                bookList.appendChild(col);
            });
        }
    })
    .catch(error => console.error('🚨 Error al cargar el dashboard:', error));
}

// Botón de cerrar sesión con validación
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        alert('Has cerrado sesión.');
        window.location.href = '/login';
    });
} else {
    console.error('🚨 No se encontró el botón de cerrar sesión.');
}