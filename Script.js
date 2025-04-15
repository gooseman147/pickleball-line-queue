// Firebase Firestore integration
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = window.db;

function showSection(sectionId) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });
}

function showModal() {
  document.getElementById("queue-modal").style.display = "flex";
}

function hideModal() {
  document.getElementById("queue-modal").style.display = "none";
  document.getElementById("checkin-form").reset();
  document.getElementById("confirmation").innerText = "";
}

// Show modal on button click
document.getElementById("open-modal-btn").addEventListener("click", showModal);

// Submit form handler
const form = document.getElementById("checkin-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const partySize = parseInt(document.getElementById("partySize").value);
  const skill = parseFloat(document.getElementById("skill").value);
  const matchPref = document.querySelector(
    "input[name='matchPref']:checked"
  )?.value;

  if (!name || isNaN(partySize) || isNaN(skill)) {
    document.getElementById("confirmation").innerText =
      "Please fill out all fields correctly.";
    return;
  }

  const player = { name, partySize, skill, matchPref };

  try {
    await addDoc(collection(db, "queue"), player);
    hideModal();
    showQueue();
  } catch (error) {
    console.error("Error adding player to queue:", error);
    document.getElementById("confirmation").innerText =
      "There was an error. Please try again.";
  }
});

// Display queue
async function showQueue() {
  const queueList = document.getElementById("queue-list");
  const snapshot = await getDocs(collection(db, "queue"));

  let html = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    html += `<div class='queue-card'>
      <strong>${data.name}</strong> (Skill: ${data.skill})<br />
      Party Size: ${data.partySize}<br />
      Match Preference: ${data.matchPref}
      <button class='remove-button' onclick="deletePlayer('${docSnap.id}')">X</button>
    </div>`;
  });

  queueList.innerHTML = html;
}

// Delete player
window.deletePlayer = async function (id) {
  try {
    await deleteDoc(doc(db, "queue", id));
    showQueue();
  } catch (err) {
    console.error("Error deleting player:", err);
  }
};

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  showSection("queue");
  showQueue();
});
document.addEventListener("DOMContentLoaded", () => {
  showSection("queue");
  showQueue();

  // Home button
  document.getElementById("home-nav").addEventListener("click", () => {
    showSection("home");
  });

  // Queue button
  document.getElementById("queue-nav").addEventListener("click", () => {
    showSection("queue");
    showQueue(); // Refresh queue when returning
  });
});
