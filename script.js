document.addEventListener('DOMContentLoaded', () => {
    const githubUsername = 'munhof'; // ¡Asegúrate de que este sea tu nombre de usuario de GitHub!
    const projectsContainer = document.getElementById('projects-container');

    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            projectsContainer.innerHTML = ''; // Limpiar el mensaje de "Cargando proyectos..."
            
            if (repos.length === 0) {
                projectsContainer.innerHTML = '<p>No hay proyectos públicos disponibles en este momento.</p>';
                return;
            }

            repos.forEach(repo => {
                // Filtra repositorios que podrías no querer mostrar (ej. el de github pages)
                if (repo.name === 'munhof.github.io') {
                    return; // Saltar este repositorio
                }

                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');

                projectCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Sin descripción.'}</p>
                    <p>Lenguaje principal: ${repo.language || 'N/A'}</p>
                    <a href="${repo.html_url}" target="_blank" class="button">Ver en GitHub</a>
                `;
                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar los proyectos de GitHub:', error);
            projectsContainer.innerHTML = '<p>Lo siento, no pude cargar los proyectos. Intenta de nuevo más tarde.</p>';
        });
});