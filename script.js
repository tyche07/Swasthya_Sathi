const toastElement = document.getElementById('appToast');
const appToast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 2600 });
function showToast(message) {
  document.getElementById('toastText').textContent = message;
  appToast.show();
}

const profileModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('profileModal'));
const sidebar = document.getElementById('sidebar');

document.getElementById('mobileMenu').addEventListener('click', () => sidebar.classList.toggle('open'));
document.getElementById('profileSettings').addEventListener('click', () => profileModal.show());
document.querySelectorAll('[data-open="profile"]').forEach(button => button.addEventListener('click', () => profileModal.show()));
document.querySelectorAll('[data-open="reminders"]').forEach(button => button.addEventListener('click', () => showToast('Reminder management is a demo feature.')));
document.getElementById('notificationButton').addEventListener('click', () => showToast('You’re all caught up!'));
document.getElementById('newChat').addEventListener('click', () => {
  document.getElementById('chatMessages').innerHTML = '<p class="assistant-message">New conversation started. What would you like help with?</p>';
  document.getElementById('chatInput').value = '';
  document.getElementById('chatInput').focus();
});
document.getElementById('startCheckin').addEventListener('click', () => {
  document.getElementById('chatInput').focus();
  document.getElementById('chatInput').placeholder = 'Describe what you would like help with...';
  document.getElementById('chat').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.querySelectorAll('.recent-item').forEach(button => button.addEventListener('click', () => {
  document.getElementById('chatInput').value = button.textContent.trim();
  document.getElementById('chatInput').focus();
}));
document.querySelectorAll('.side-nav .nav-link').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.side-nav .nav-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
  if (window.innerWidth <= 800) sidebar.classList.remove('open');
  const section = link.dataset.section;
  if (!['Home', 'Insights'].includes(section)) showToast(`${section}: demo section ready to customize.`);
}));
document.getElementById('profileForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('displayName').value.trim() || 'Guest User';
  document.querySelector('.user-copy strong').textContent = name;
  document.querySelector('.avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profileStatus').textContent = document.getElementById('age').value ? `Profile started · Age ${document.getElementById('age').value}` : 'Profile started';
  profileModal.hide();
  showToast('Profile updated in this demo.');
});

const chatForm = document.getElementById('chatForm');
chatForm.addEventListener('submit', async event => {
  event.preventDefault();
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, 'user');
  input.value = '';
  const pending = appendMessage('Thinking…', 'assistant');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!response.ok) throw new Error('Backend is unavailable');
    const data = await response.json();
    pending.textContent = data.reply;
  } catch (error) {
    pending.textContent = 'This demo can help organize general wellness questions, but its AI service is not configured. For symptoms or treatment advice, contact a qualified healthcare professional.';
  }
});
function appendMessage(text, role) {
  const p = document.createElement('p');
  p.className = role === 'user' ? 'user-message' : 'assistant-message';
  p.textContent = text;
  document.getElementById('chatMessages').appendChild(p);
  document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
  return p;
}
