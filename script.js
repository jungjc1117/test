document.addEventListener('DOMContentLoaded', function() {
    const myCheckbox = document.getElementById('myCheckbox');
    const myMemo = document.getElementById('myMemo');
    const saveButton = document.getElementById('saveButton');

    // Load saved state on page load
    const savedCheckboxState = localStorage.getItem('myCheckboxState');
    if (savedCheckboxState === 'true') {
        myCheckbox.checked = true;
    }

    const savedMemoContent = localStorage.getItem('myMemoContent');
    if (savedMemoContent) {
        myMemo.value = savedMemoContent;
    }

    // Save state when the button is clicked
    saveButton.addEventListener('click', function() {
        localStorage.setItem('myCheckboxState', myCheckbox.checked);
        localStorage.setItem('myMemoContent', myMemo.value);
        alert('Settings saved!'); // Optional: provide user feedback
    });
});