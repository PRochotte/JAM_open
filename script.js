// Fonction pour récupérer les projets depuis l'API GitHub
async function fetchProjects(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}+topic:opensource`, {
        headers: {
            Accept: 'application/vnd.github.mercy-preview+json' // Utilisation de l'en-tête nécessaire pour rechercher par sujet (topic)
        }
    });
    const data = await response.json();
    return data.items;
}

// Fonction pour trier les projets en fonction des critères sélectionnés
function sortProjects(projects) {
    const starSort = document.getElementById('star-sort').value;
    const languageSort = document.getElementById('language-sort').value;

    projects.sort((a, b) => {
        // Trier par nombre d'étoiles
        if (starSort === 'desc') {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
        } else if (starSort === 'asc') {
            if (a.stargazers_count !== b.stargazers_count) {
                return a.stargazers_count - b.stargazers_count;
            }
        }

        // Trier par langage de programmation
        console.log(a.language, languageSort, b.language);
        if (languageSort !== 'all') {
            if (a.language && b.language) {
                return a.language.localeCompare(b.language);
            } else {
                if (!a.language && !b.language) return 0;
                if (!a.language) return 1;
                if (!b.language) return -1;
            }
        }
        return 0;
    });

    return projects;
}


// Fonction pour afficher les projets sur la page
async function displayProjects(query = '') {
    let projects = await fetchProjects(query);
    projects = sortProjects(projects);

    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.classList.add('project-item');
        listItem.innerHTML = `
            <h2>${project.name}</h2>
            <p>Description: ${project.description}</p>
            <p>Langage: ${project.language}</p>
            <p>Stars: ${project.stargazers_count}</p>
            <p>URL: <a href="${project.html_url}" target="_blank">${project.html_url}</a></p>
            <button onclick="redirectToChat('${project.name}')">Chat</button> <!-- Bouton de chat -->
        `;
        projectsList.appendChild(listItem);
    });
}

// Gestionnaire d'événement pour la sélection de tri par étoiles
document.getElementById('star-sort').addEventListener('change', function() {
    const query = document.getElementById('search-input').value.trim();
    displayProjects(query);
});

// Gestionnaire d'événement pour la sélection de tri par langage de programmation
document.getElementById('language-sort').addEventListener('change', function() {
    const query = document.getElementById('search-input').value.trim();
    displayProjects(query);
});


// Gestionnaire d'événement pour la soumission du formulaire de recherche
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire
    const query = document.getElementById('search-input').value.trim();
    displayProjects(query);
});

document.getElementById('add-api-button').addEventListener('click', function() {
    openPopup();
});

function openPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function addCustomApi() {
    const customApiUrl = document.getElementById('custom-api-url').value.trim();
    if (customApiUrl) {
        displayProjects(customApiUrl);
        closePopup();
    }
}

function redirectToChat(projectName) {
    window.location.href = `chat/chat.html?project=${encodeURIComponent(projectName)}`;
}

displayProjects();
