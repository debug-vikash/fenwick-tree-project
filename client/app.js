const API_URL = 'http://127.0.0.1:5050';

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.onsubmit = async function(event) {
        event.preventDefault(); 
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch(API_URL + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        const msgBox = document.getElementById('msgBox');
        msgBox.style.display = "block";
        if (data.error) {
            msgBox.className = "message error-message";
            msgBox.innerText = "Validation Error: " + data.error;
        } else {
            msgBox.className = "message";
            msgBox.innerText = "Success! You can now login.";
            setTimeout(() => { window.location.href = "login.html"; }, 1000);
        }
    };
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const response = await fetch(API_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        const msgBox = document.getElementById('msgBox');
        if (data.error) {
            msgBox.style.display = "block";
            msgBox.className = "message error-message";
            msgBox.innerText = "Login Failed! " + data.error;
        } else {
            localStorage.setItem("userEmail", data.email);
            window.location.href = "dashboard.html"; 
        }
    };
}

const logoutBtn = document.getElementById('logoutBtn');
const logoutDropdownBtn = document.getElementById('dropdownLogoutBtn');
const userProfileToggle = document.getElementById('userProfileToggle');
const profileDropdown = document.getElementById('profileDropdown');

if (userProfileToggle || logoutBtn || logoutDropdownBtn) {
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) {
        window.location.href = "login.html";
    } else {
        const displayUsername = document.getElementById('displayUsername');
        if (displayUsername) displayUsername.innerText = loggedInEmail.split('@')[0] || "User";
    }

    const handleLogout = (e) => {
        if(e) e.preventDefault();
        localStorage.removeItem("userEmail");
        window.location.href = "login.html";
    };

    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (logoutDropdownBtn) logoutDropdownBtn.addEventListener("click", handleLogout);

    if (userProfileToggle) {
        userProfileToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === "none" ? "block" : "none";
        });
        document.addEventListener("click", function(e) {
            if (profileDropdown.style.display === "block" && !userProfileToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.style.display = "none";
            }
        });
    }

    function showPage(pageId) {
        document.querySelectorAll('.page-view').forEach(p => p.style.display = 'none');
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.style.display = 'block';
        document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.menu-link[data-page="${pageId}"]`);
        if(activeLink) activeLink.classList.add('active');
        if(pageId === 'array') fetchArrayData();
    }

    const links = document.querySelectorAll('.menu-link');
    links.forEach(link => {
        if (link.id !== 'logoutBtn') {
            link.addEventListener('click', () => {
                const page = link.getAttribute('data-page');
                showPage(page);
            });
        }
    });

    const initialHash = window.location.hash.replace('#', '');
    if (['dashboard', 'update', 'prefix', 'array', 'db'].includes(initialHash)) {
        showPage(initialHash);
    } else {
        showPage('dashboard');
    }

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (['dashboard', 'update', 'prefix', 'array', 'db'].includes(hash)) showPage(hash);
    });

    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.onclick = async function() {
            const index = document.getElementById('updateIndex').value;
            const value = document.getElementById('updateValue').value;
            const mode = document.getElementById('updateMode').value;
            const msgBox = document.getElementById('updateMsg');
            try {
                const response = await fetch(API_URL + '/api/fenwick/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ index, value, mode })
                });
                const data = await response.json();
                msgBox.style.display = "block";
                if (data.error) {
                    msgBox.className = "message error-message";
                    msgBox.innerText = "Error: " + data.error;
                } else {
                    msgBox.className = "message";
                    msgBox.innerText = "Value updated successfully!";
                    document.getElementById('updateIndex').value = ""; 
                    document.getElementById('updateValue').value = ""; 
                }
                setTimeout(() => msgBox.style.display = "none", 3000);
            } catch (err) { alert("Network error"); }
        };
    }

    const getSumBtn = document.getElementById('getSumBtn');
    if (getSumBtn) {
        getSumBtn.onclick = async function() {
            const index = document.getElementById('prefixIndex').value;
            const msgBox = document.getElementById('prefixMsg');
            try {
                const response = await fetch(API_URL + '/api/fenwick/prefix-sum/' + index);
                const data = await response.json();
                if (data.error) {
                    msgBox.style.display = "block";
                    msgBox.className = "message error-message";
                    msgBox.innerText = "Error: " + data.error;
                    document.getElementById('resultDisplay').innerText = "---";
                    setTimeout(() => msgBox.style.display = "none", 3000);
                } else {
                    document.getElementById('resultDisplay').innerText = data.sum;
                }
            } catch (err) { alert("Network error"); }
        };
    }

    const getDbSumBtn = document.getElementById('getDbSumBtn');
    if (getDbSumBtn) {
        getDbSumBtn.onclick = async function() {
            const index = document.getElementById('dbIndex').value;
            const msgBox = document.getElementById('dbMsg');
            const resContainer = document.getElementById('dbResultContainer');
            try {
                const response = await fetch(API_URL + '/api/fenwick/prefix-db/' + index);
                const data = await response.json();
                if (data.error) {
                    msgBox.style.display = "block";
                    msgBox.className = "message error-message";
                    msgBox.innerText = "Error: " + data.error;
                    resContainer.style.display = "none";
                    setTimeout(() => msgBox.style.display = "none", 3000);
                } else {
                    resContainer.style.display = "block";
                    document.getElementById('resFenwickSum').innerText = data.fenwickSum;
                    document.getElementById('resDbSum').innerText = data.dbSum;
                    const resDiff = document.getElementById('resDiff');
                    resDiff.innerText = data.difference;
                    resDiff.style.color = data.difference === 0 ? "green" : "red";
                }
            } catch (err) { alert("Network error"); }
        };
    }

    const rebuildTreeBtn = document.getElementById('rebuildTreeBtn');
    if (rebuildTreeBtn) {
        rebuildTreeBtn.onclick = async function() {
            const msgBox = document.getElementById('dbMsg');
            try {
                rebuildTreeBtn.disabled = true;
                rebuildTreeBtn.innerText = "Rebuilding...";
                const response = await fetch(API_URL + '/api/fenwick/rebuild', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                msgBox.style.display = "block";
                if (data.error) {
                    msgBox.className = "message error-message";
                    msgBox.innerText = "Rebuild Failed: " + data.error;
                } else {
                    msgBox.className = "message";
                    msgBox.innerText = data.message + " (Unique Indices: " + data.count + ")";
                    if(document.getElementById('page-array').style.display !== 'none') fetchArrayData();
                }
                setTimeout(() => msgBox.style.display = "none", 5000);
            } catch (err) { alert("Network error: " + err.message); }
            finally {
                rebuildTreeBtn.disabled = false;
                rebuildTreeBtn.innerText = "Rebuild Memory Tree from DB";
            }
        };
    }

    const fetchArrayBtn = document.getElementById('fetchArrayBtn');
    if (fetchArrayBtn) fetchArrayBtn.onclick = fetchArrayData;

    async function fetchArrayData() {
        const tbody = document.getElementById('arrayTableBody');
        tbody.innerHTML = '<tr><td colspan="2">Loading...</td></tr>';
        try {
            const response = await fetch(API_URL + '/api/fenwick/all');
            const data = await response.json();
            if (data.array) {
                tbody.innerHTML = '';
                let hasData = false;
                for(let i = 1; i < data.array.length; i++) {
                    const val = data.array[i];
                    if (val !== 0) {
                        hasData = true;
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td>${i}</td><td>${val}</td>`;
                        tbody.appendChild(tr);
                    }
                }
                if (!hasData) tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;">All values are currently 0.</td></tr>';
            }
        } catch (err) { tbody.innerHTML = '<tr><td colspan="2" style="color:red;">Failed to load data.</td></tr>'; }
    }
}
