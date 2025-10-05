import { learningItems } from "../../js/learningItems.js";

function renderLearningItems() {
  const list = document.getElementById('learning-list');
  const empty = document.getElementById('learning-empty');
  if (learningItems.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  learningItems.slice(0, 20).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.topic}</strong>: ${item.progress}`;
    list.appendChild(li);
  });
  empty.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', renderLearningItems);
