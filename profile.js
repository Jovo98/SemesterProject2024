const API_KEY = "afad05b1-e389-4ab8-a92d-d77313b4da24";
const accessToken = localStorage.getItem("accessToken");
const userName = localStorage.getItem("name");

if (!accessToken || !userName) {
    alert("You are not logged in. Redirecting to home...");
    window.location.href = "index.html";
} else {

    async function fetchProfile() {
        const profileUrl = `https://v2.api.noroff.dev/auction/profiles/${userName}`;
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

    // Handle logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("name");
        alert("You have been logged out.");
        window.location.href = "index.html";
    });

    document.getElementById("changeAvatarBtn").addEventListener("click", async () => {
        const newAvatarUrl = prompt("Enter the new avatar URL:");

        if (newAvatarUrl) {
            try {
                const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${userName}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "X-Noroff-API-Key": API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        avatar: {
                            url: newAvatarUrl
                        }
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    document.getElementById("userAvatar").src = newAvatarUrl;
                    alert("Avatar updated successfully!");
                } else {
                    alert(`Failed to update avatar: ${result.message || "Unknown error"}`);
                }
            } catch (error) {
                alert("An error occurred while updating the avatar.");
            }
        }
    });
}

document.getElementById("homeBtn").onclick = function () {
    location.href = "index.html";
};
