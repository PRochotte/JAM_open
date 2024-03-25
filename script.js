async function fetchProjects(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}+topic:opensource`, {
        headers: {
            Accept: 'application/vnd.github.mercy-preview+json'
        }
    });
    const data = await response.json();
    return data.items;
}

function sortProjects(projects) {
    const starSort = document.getElementById('star-sort').value;

    projects.sort((a, b) => {
        if (starSort === 'desc') {
            return b.stargazers_count - a.stargazers_count;
        } else if (starSort === 'asc') {
            return a.stargazers_count - b.stargazers_count;
        }

        return 0;
    });

    return projects;
}

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

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
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
