// Import Firebase modules
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Access the Firestore database from the global window object
const db = window.db;

// Function to display the specified section and hide others
function showSection(sectionId) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach((section) => {
    section.style.display = section.id === sectionId ? "block" : "none";
  });
}

// Function to display the modal
function showModal() {
  document.getElementById("queue-modal").style.display = "block";
}

// Function to hide the modal
function hideModal() {
  document.getElementById("queue-modal").style.display = "none";
  document.getElementById("checkin-form").reset();
  document.getElementById("confirmation").innerText = "";
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

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  showSection("queue"); // Show queue by default
  displayQueue();

  // Event listener for opening the modal
  document
    .getElementById("open-modal-btn")
    .addEventListener("click", showModal);

  // Event listener for closing the modal
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", hideModal);

  // Event listener for form submission
  document
    .getElementById("checkin-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const partySize = parseInt(document.getElementById("partySize").value);
      const skill = parseFloat(document.getElementById("skill").value);
      const matchPref = document.querySelector(
        'input[name="matchPref"]:checked'
      ).value;

      if (!name || isNaN(partySize) || isNaN(skill)) {
        document.getElementById("confirmation").innerText =
          "Please fill out all fields correctly.";
        return;
      }

      const data = { name, partySize, skill, matchPref };

      try {
        await addDoc(collection(db, "queue"), data);
        hideModal();
        displayQueue();
      } catch (err) {
        console.error("Error joining queue:", err);
        document.getElementById("confirmation").innerText =
          "Something went wrong. Please try again.";
      }
    });
});
document
  .getElementById("checkin-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const partySize = parseInt(document.getElementById("partySize").value);
    const skill = parseFloat(document.getElementById("skill").value);
    const matchPref = document.querySelector(
      'input[name="matchPref"]:checked'
    ).value;

    if (!name || isNaN(partySize) || isNaN(skill)) {
      document.getElementById("confirmation").innerText =
        "Please fill out all fields correctly.";
      return;
    }

    const data = { name, partySize, skill, matchPref };

    try {
      await addDoc(collection(db, "queue"), data);
      hideModal(); // Hide the modal after successful submission
      displayQueue(); // Refresh the queue display
    } catch (err) {
      console.error("Error joining queue:", err);
      document.getElementById("confirmation").innerText =
        "Something went wrong. Please try again.";
    }
  });
function hideModal() {
  document.getElementById("queue-modal").style.display = "none";
  document.getElementById("checkin-form").reset();
  document.getElementById("confirmation").innerText = "";
}
