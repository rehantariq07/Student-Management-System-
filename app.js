let students = JSON.parse(localStorage.getItem('neonStudents')) || [];

const form       = document.getElementById('studentForm');
const editForm   = document.getElementById('editForm');
const errorDiv   = document.getElementById('error');
const submitBtn  = document.getElementById('submitBtn');
const updateBtn  = document.getElementById('updateBtn');
const editIndex  = document.getElementById('editIndex');
const tbody      = document.querySelector('#studentTable tbody');

const editModal       = new bootstrap.Modal(document.getElementById('editModal'));
const editName        = document.getElementById('editName');
const editAge         = document.getElementById('editAge');
const editMarks       = document.getElementById('editMarks');
const editModalIndex  = document.getElementById('editModalIndex');
const saveEditBtn     = document.getElementById('saveEditBtn');

function getStatus(marks) {
    if (marks >= 80) return {text:'DISTINCTION', cls:'badge-distinction'};
    if (marks >= 60) return {text:'PASS',     cls:'badge-pass'};
    if (marks >= 40) return {text:'AVERAGE',     cls:'badge-average'};
    return              {text:'FAIL',     cls:'badge-fail'};
}

function saveToStorage() {
    localStorage.setItem('neonStudents', JSON.stringify(students));
}

function render() {
    tbody.innerHTML = '';
    students.forEach((s, i) => {
        const st = getStatus(s.marks);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.name}</td>
            <td>${s.age}</td>
            <td>${s.marks}</td>
            <td><span class="badge ${st.cls}">${st.text}</span></td>
            <td>
                <button class="btn btn-edit btn-sm me-2 px-3" onclick="openEdit(${i})">
                    <i class="fas fa-edit"></i> EDIT
                </button>
                <button class="btn btn-delete btn-sm px-3" onclick="remove(${i})">
                    <i class="fas fa-trash"></i> TERMINATE
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function resetAddForm() {
    form.reset();
    submitBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    editIndex.value = -1;
    errorDiv.textContent = '';
}

function openEdit(index) {
    const s = students[index];
    editName.value   = s.name;
    editAge.value    = s.age;
    editMarks.value  = s.marks;
    editModalIndex.value = index;

    editModal.show();
}

function validateAndGetData(nameEl, ageEl, marksEl, errorEl) {
    const name  = nameEl.value.trim();
    const age   = parseInt(ageEl.value);
    const marks = parseInt(marksEl.value);

    errorEl.textContent = '';

    if (!name || isNaN(age) || isNaN(marks)) {
        errorEl.textContent = 'All fields are mandatory.';
        return null;
    }
    if (age < 18) {
        errorEl.textContent = 'Age Must Be Atleast 18 or Above.';
        return null;
    }

    return { name, age, marks };
}

// Add new
form.addEventListener('submit', e => {
    e.preventDefault();

    const data = validateAndGetData(
        document.getElementById('name'),
        document.getElementById('age'),
        document.getElementById('marks'),
        errorDiv
    );

    if (!data) return;

    students.push(data);
    saveToStorage();
    render();
    resetAddForm();
});

// Update via modal
saveEditBtn.addEventListener('click', () => {
    const index = parseInt(editModalIndex.value);
    if (index < 0 || index >= students.length) return;

    const data = validateAndGetData(editName, editAge, editMarks, errorDiv);
    if (!data) return;

    students[index] = data;
    saveToStorage();
    render();
    editModal.hide();
    resetAddForm();
});

// Delete
window.remove = (index) => {
    if (!confirm("Terminate this Student permanently?")) return;
    students.splice(index, 1);
    saveToStorage();
    render();
};

// Entrance animation
window.addEventListener('load', () => {
    render();
    setTimeout(() => {
        document.querySelectorAll('.futuristic-card').forEach((el,i) => {
            setTimeout(() => el.classList.add('show'), 200 + i*350);
        });
    }, 400);
});