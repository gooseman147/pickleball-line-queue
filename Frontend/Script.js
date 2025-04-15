document
  .getElementById("checkin-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const partySize = parseInt(document.getElementById("partySize").value);
    const skill = parseFloat(document.getElementById("skill").value);
    const matchPref = document.querySelector(
      'input[name="matchPref"]:checked'
    ).value;

    const data = { name, partySize, skill, matchPref };

    try {
      const res = await fetch("http://localhost:3000/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Hide modal, show main page, show queue position
      document.getElementById("queue-modal").style.display = "none";
      document.getElementById("main-content").style.display = "block";
      document.getElementById(
        "line-status"
      ).innerText = `You are #${result.position} in line.`;
    } catch (err) {
      console.error("Error joining queue:", err);
      document.getElementById("confirmation").innerText =
        "Something went wrong. Please try again.";
    }
  });

// Game Done button functionality
document.getElementById("game-done-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/game-done", {
      method: "POST",
    });

    const result = await res.json();

    const names = result.nowPlaying.map((p) => p.name).join(", ");
    document.getElementById("now-playing").style.display = "block";
    document.getElementById(
      "now-playing"
    ).innerText = `You're up! You are playing with: ${names}`;

    // Show the form again so user can rejoin
    document.getElementById("queue-modal").style.display = "flex";
    document.getElementById("main-content").style.display = "none";
    document.getElementById("checkin-form").reset();
    document.getElementById("confirmation").innerText = "";
  } catch (err) {
    alert("Error marking game as done or getting next players.");
    console.error(err);
  }
});
function showSection(sectionId) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });
}

// Function to fetch and display the queue
async function displayQueue() {
  const queueList = document.getElementById("queue-list");
  queueList.innerHTML = ""; // Clear existing content

  const querySnapshot = await getDocs(collection(db, "queue"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "queue-card";
    card.innerHTML = `
      <span class="remove-button" data-id="${docSnap.id}">X</span>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Skill Level:</strong> ${data.skill}</p>
    `;
    queueList.appendChild(card);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const docId = button.getAttribute("data-id");
      await deleteDoc(doc(db, "queue", docId));
      displayQueue(); // Refresh the queue
    });
  });
}

// Initial display
document.addEventListener("DOMContentLoaded", () => {
  showSection("queue"); // Show queue by default
  displayQueue();
});
