let notificationsEnabled = false;

document.getElementById('toggle-notifications').addEventListener('click', () => {
  if (!notificationsEnabled) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        notificationsEnabled = true;
        alert('Уведомления включены');
      }
    });
  } else {
    notificationsEnabled = false;
    alert('Уведомления отключены');
  }
});

function sendNewTaskNotification(text) {
  if (notificationsEnabled) {
    new Notification('Новая задача', {
      body: text,
      icon: 'icons/icon-192.png'
    });
  }
}

function startReminderInterval() {
  setInterval(() => {
    const active = loadTasks().filter(t => !t.completed);
    if (notificationsEnabled && active.length > 0) {
      new Notification('Напоминание', {
        body: `У вас ${active.length} невыполненных задач`,
        icon: 'icons/icon-192.png'
      });
    }
  }, 2 * 60 * 60 * 1000); // каждые 2 часа
}
