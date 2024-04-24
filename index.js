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
      <div data-id=${item.id} class="edit-button">Edit</div>
      <button data-id=${item.id} class="delete-button">Delete</button>
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
  if (e.target && e.target.classList.contains("delete-button")) {
    const idToDelete = e.target.getAttribute("data-id");
    data.deleteData(parseInt(idToDelete));
    e.target.closest("tr").remove();
  } else if (e.target && e.target.className === "edit-button") {
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
};

document.addEventListener("DOMContentLoaded", () => {
  const contactsData = data.getAllContact();
  contactsData.forEach((item) => {
    const createTableRow = createContactRow(item);
    tableBody.appendChild(createTableRow);
  });
});
