const apiUrl = "https://v2.api.noroff.dev/auction/listings";
const listingsContainer = document.getElementById("listings");
const registerUrl = "https://v2.api.noroff.dev/auth/register";
const loginUrl = "https://v2.api.noroff.dev/auth/login";
const accessToken = localStorage.getItem("accessToken");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");
async function fetchListings() {
    try {
        const response = await fetch(apiUrl);
        const { data } = await response.json();

        listingsContainer.innerHTML = "";

        data.forEach(item => {
            const { title, description, media, endsAt, _count } = item;

            const mediaUrl = media.length > 0 ? media[0].url : "https://via.placeholder.com/150";
            const mediaAlt = media.length > 0 ? media[0].alt : "Placeholder Image";

            const bids = _count.bids;

            let listingCard = `
                <div class="col-md-4 col-sm-6">
                    <div class="card shadow-sm">
                        <img src="${mediaUrl}" class="card-img-top" alt="${mediaAlt}">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${description || "No description available."}</p>`;

            if (accessToken) {
                listingCard += `<p class="card-bid"><strong>Bids:</strong> ${bids}</p>`;
            }

            listingCard += `
                            <p class="text-muted">Ends: ${new Date(endsAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `;

            listingsContainer.insertAdjacentHTML("beforeend", listingCard);
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        document.getElementById("listings").innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load listings. Please try again later.
            </div>
        `;
    }
}

fetchListings();

document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const avatar = document.getElementById("registerAvatar").value;

    const payload = { name, email, password };
    if (avatar) payload.avatar = avatar;

    try {
        const response = await fetch(registerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registration successful!");
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("name", data.data.name)
            window.location.href = "profile.html";
            alert(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again.");
    }
});

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const payload = { email, password };

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {


            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("name", data.data.name);
            alert("Login successful!");
            window.location.href = "profile.html";
        } else {
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
});

if (accessToken) {
    registerBtn.style.display = "none";
    loginBtn.style.display = "none";
    profileBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
} else {
    registerBtn.style.display = "inline-block";
    loginBtn.style.display = "inline-block";
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
}

profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    alert("You have been logged out.");
    window.location.href = "index.html";
});
