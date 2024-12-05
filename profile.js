const API_KEY = "afad05b1-e389-4ab8-a92d-d77313b4da24";

const accessToken = localStorage.getItem("accessToken");
const userName = localStorage.getItem("name");
const profileUrl = `https://v2.api.noroff.dev/auction/profiles/${userName}`;

if (!accessToken || !userName) {
    alert("You are not logged in. Redirecting to home...");
    window.location.href = "index.html";
} else {


    async function fetchProfile() {
        try {
            const response = await fetch(profileUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "X-Noroff-API-Key": API_KEY,
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById("profileMessage").innerText = `${result.data.name}`;
                document.getElementById("userCredits").innerText = result.data.credits;

                const avatarUrl = result.data.avatar?.url || "assets/images/usericon.png";

                const avatarImageElement = document.getElementById("userAvatar");
                avatarImageElement.src = avatarUrl;
                avatarImageElement.alt = "User Avatar";
                avatarImageElement.style.display = "block";
            } else {
                alert(`Failed to load profile: ${result.message || "Unknown error"}`);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("name");
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("An error occurred. Please log in again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("name");
            window.location.href = "index.html";
        }
    }

    fetchProfile();
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    alert("You have been logged out.");
    window.location.href = "index.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});
