const form = document.getElementById("form");
const tableBody = document.querySelector("#dataTable tbody");
const searchInput = document.getElementById("search");
const nameInput = document.getElementById("name");
const positionInput = document.getElementById("position");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let data = JSON.parse(localStorage.getItem("tableData")) || [];
let currentPage = 1;
const rowsPerPage = 5;

function saveData() {
  localStorage.setItem("tableData", JSON.stringify(data));
}

function renderTable(filteredData = data) {
  const start = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(start, start + rowsPerPage);

  tableBody.innerHTML = "";
  paginatedData.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.position}</td>
      <td class="actions">
        <button class="edit-btn" data-index="${index + start}">Edit</button>
        <button class="delete-btn" data-index="${index + start}">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredData.length / rowsPerPage)}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === Math.ceil(filteredData.length / rowsPerPage);
}

function addRow(name, position) {
  data.push({ name, position });
  saveData();
  renderTable(filterData());
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addRow(nameInput.value, positionInput.value);
  form.reset();
});

tableBody.addEventListener("click", function (e) {
  const index = +e.target.dataset.index;

  if (e.target.classList.contains("delete-btn")) {
    data.splice(index, 1);
    saveData();
    renderTable(filterData());
  } else if (e.target.classList.contains("edit-btn")) {
    const row = data[index];
    nameInput.value = row.name;
    positionInput.value = row.position;
    data.splice(index, 1);
    saveData();
    renderTable(filterData());
  }
});

function filterData() {
  const term = searchInput.value.toLowerCase();
  return data.filter(
    (row) =>
      row.name.toLowerCase().includes(term) ||
      row.position.toLowerCase().includes(term)
  );
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTable(filterData());
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable(filterData());
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < Math.ceil(filterData().length / rowsPerPage)) {
    currentPage++;
    renderTable(filterData());
  }
});

// Initial Render
renderTable();





