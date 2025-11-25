import { useState } from 'react';
import styles from './DashboardPage.module.css';

export default function DashboardNotifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'Nouveau message',
      message: 'Vous avez reçu un nouveau message',
      time: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'listing',
      title: 'Annonce validée',
      message: 'Votre annonce "Toyota Corolla" a été validée',
      time: new Date(Date.now() - 86400000),
      read: true
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        );
      case 'listing':
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'message':
        return '#3b82f6';
      case 'listing':
        return '#22c55e';
      default:
        return '#6366f1';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Alertes & Notifications</h1>
        <p className={styles.pageSubtitle}>Restez informé de votre activité</p>
      </div>

      {notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <h3>Aucune notification</h3>
          <p>Vous êtes à jour!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.listItem} ${!notif.read ? styles.listItemUnread : ''}`}
            >
              <div
                className={styles.listItemIcon}
                style={{ color: getIconColor(notif.type) }}
              >
                {getIcon(notif.type)}
              </div>
              <div className={styles.listItemContent}>
                <div className={styles.listItemTitle}>{notif.title}</div>
                <div className={styles.listItemText}>{notif.message}</div>
                <div className={styles.listItemMeta}>
                  {new Date(notif.time).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {!notif.read && <div className={styles.unreadDot}></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
