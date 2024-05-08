const form = document.getElementById("form-address");
const modal = document.getElementById("modal");
const tableBody = document.getElementById("body-table");

document.querySelector(".sidebar_button").addEventListener("click", () => {
  modal.style.display = "block";
});

document.querySelector(".close-button").addEventListener("click", () => {
  modal.style.display = "none";
});

const createContactRow = (item) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.phone}</td>
    <td>${item.email}</td>
    <td>${item.address}</td>
    <td>${item.age}</td>
    <td>
    <div class="rounded-button edit-button" data-id=${item.id}>
      <i  class="fa-regular fa-pen-to-square "></i>
    </div>
    <div class="rounded-button delete-button" data-id=${item.id}>
      <i class="fa-solid fa-trash"></i>
    </div>
    </td>`;
  return row;
};

const createContactRowTrash = (item) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.name}</td>
    <td>${item.phone}</td>
    <td>${item.email}</td>
    <td>${item.address}</td>
    <td>${item.age}</td>
    <td>
    <div class="rounded-button edit-button" data-id=${item.id}>
      <i  class="fa-regular fa-pen-to-square "></i>
    </div>
    <div class="rounded-button delete-button trash" data-id=${item.id}>
      <i class="fa-solid fa-trash"></i>
    </div>
    </td>`;
  return row;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const contactData = {
    id: helper.generateIncrementalId(),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    age: formData.get("age"),
  };

  const contactsData = data.getAllContact();
  contactsData.push(contactData);
  localStorage.setItem("contacts", JSON.stringify(contactsData));

  const createTableRow = createContactRow(contactData);
  tableBody.appendChild(createTableRow);
  modal.style.display = "none";
});

document.addEventListener("click", function (e) {
  if (e.target.closest(".delete-button")) {
    const idToDelete = e.target
      .closest(".delete-button")
      .getAttribute("data-id");
    data.deleteData(parseInt(idToDelete));
    e.target.closest("tr").remove();
  } else if (e.target.closest(".edit-button")) {
    const itemId = e.target.getAttribute("data-id");
    window.location.href = `/contact/index.html?id=${itemId}`;
  }
});

document.getElementById("search-name").addEventListener("input", (e) => {
  const searchValue = e.target.value;
  const filteredContacts = data
    .getAllContact()
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  tableBody.innerHTML = ""; // Bersihkan isi tabel terlebih dahulu
  filteredContacts.forEach((contact) => {
    const row = createContactRow(contact);
    tableBody.appendChild(row);
  });
});

const helper = {
  generateIncrementalId: () => {
    const contactsData = data.getAllContact();
    return contactsData.length + 1;
  },
  searchName: (name) => {
    const contacts = data.getAllContact();

    const findName = contacts.find((contact) => contact.name === name);
    console.log(findName);

    return findName;
  },
};

const data = {
  getAllContact: () => {
    return JSON.parse(localStorage.getItem("contacts")) || [];
  },
  getTrashContact: () => {
    return JSON.parse(localStorage.getItem("trash")) || [];
  },
  deleteData: (id) => {
    const contactsData = data.getAllContact();
    const trashContact = data.getTrashContact();

    const index = contactsData.findIndex((item) => item.id === id);
    if (index !== -1) {
      trashContact.push(contactsData[index]);
      contactsData.splice(index, 1);
    }

    localStorage.setItem("contacts", JSON.stringify(contactsData));
    localStorage.setItem("trash", JSON.stringify(trashContact));
  },
  deleteDataTrash: (id) => {
    const contactsData = data.getAllContact();
    const trashContact = data.getTrashContact();

    const index = contactsData.findIndex((item) => item.id === id);
    if (index !== -1) {
      trashContact.splice(index, 1);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLabels = document.querySelectorAll(".sidebar-category-label");
  const titleElement = document.querySelector(".main-contact-content_title");

  sidebarLabels.forEach((label) => {
    label.addEventListener("click", () => {
      const category = label.getAttribute("data-category");
      const contacts =
        category === "all" ? data.getAllContact() : data.getTrashContact();

      updateTitleAndContent(category, contacts);
      setActiveSidebarLabel(label);
    });
  });

  loadInitialContacts();
});

function updateTitleAndContent(category, contacts) {
  const title = category === "all" ? "All contact" : "Trash";
  document.querySelector(".main-contact-content_title").textContent = title;

  tableBody.innerHTML = "";
  contacts.forEach((contact) => {
    const row = createContactRow(contact);
    tableBody.appendChild(row);
  });
}

function setActiveSidebarLabel(activeLabel) {
  document.querySelectorAll(".sidebar-category-label").forEach((label) => {
    label.classList.remove("active-sidebar");
  });
  activeLabel.classList.add("active-sidebar");
}

function loadInitialContacts() {
  const initialContacts = data.getAllContact();
  initialContacts.forEach((contact) => {
    const row = createContactRow(contact);
    tableBody.appendChild(row);
  });
}
