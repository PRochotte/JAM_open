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

// Fonction pour afficher les projets sur la page
async function displayProjects(query = '') {
    const projects = await fetchProjects(query);
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = ''; // Efface la liste précédente avant d'ajouter les nouveaux résultats
    
    projects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.classList.add('project-item');
        listItem.innerHTML = `
            <h2>${project.name}</h2>
            <p>Description: ${project.description}</p>
            <p>Langage: ${project.language}</p>
            <p>Stars: ${project.stargazers_count}</p>
            <p>URL: <a href="${project.html_url}" target="_blank">${project.html_url}</a></p>
        `;
        projectsList.appendChild(listItem);
    });
}

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

async function displayProjects(query = '') {
    const projects = await fetchProjects(query);
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
            <button onclick="redirectToDiscussion('${project.name}')">Discussion</button> <!-- Bouton de discussion -->
            <button onclick="redirectToChat('${project.name}')">Chat</button> <!-- Bouton de chat -->
        `;
        projectsList.appendChild(listItem);
    });
}

function redirectToChat(projectName) {
    window.location.href = `chat/chat.html?project=${encodeURIComponent(projectName)}`;
}

displayProjects();
