document.addEventListener('DOMContentLoaded', function() {
  const myCheckbox = document.getElementById('myCheckbox');
  const myMemo = document.getElementById('myMemo');
  const myCombobox = document.getElementById('myCombobox');
  const saveButton = document.getElementById('saveButton');
  const contentArea = document.getElementById('contentArea');

  // Load saved state on page load
  const savedCheckboxState = localStorage.getItem('myCheckboxState');
  if (savedCheckboxState === 'true') {
    myCheckbox.checked = true;
  }

  const savedMemoContent = localStorage.getItem('myMemoContent');
  if (savedMemoContent) {
    myMemo.value = savedMemoContent;
  }

  const savedComboboxValue = localStorage.getItem('myCombobox');
  if (savedComboboxValue) {
    myCombobox.value = savedComboboxValue;
    loadPage(savedComboboxValue);
  }

  // Save state when the button is clicked
  saveButton.addEventListener('click', function() {
    localStorage.setItem('myCheckboxState', myCheckbox.checked);
    localStorage.setItem('myMemoContent', myMemo.value);
    localStorage.setItem('myCombobox', myCombobox.value);
    alert("저장되었습니다!");
  });

  // 콤보박스 선택 시 페이지 로드
  myCombobox.addEventListener('change', function() {
    const selectedValue = myCombobox.value;
    if (selectedValue) {
      loadPage(selectedValue);
    } else {
      contentArea.innerHTML = "";
    }
  });

  // 선택한 HTML을 contentArea에 불러오기
  function loadPage(url) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      document.getElementById("contentArea").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("contentArea").innerHTML =
        `<p style="color:red">파일을 불러올 수 없습니다: ${url}</p>`;
    });
}

});
