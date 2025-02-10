import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getMemberNotifications, deleteNotification } from '../../api/notificationApi';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      const data = await getMemberNotifications();
      console.log("Fetched Notifications Data: ", data);  // 데이터 구조 확인용
      setNotifications(data);
      setUnreadCount(data.filter(notif => !notif.read).length); // 읽지 않은 알림만 카운트
    } catch (error) {
      console.error("알림 조회 실패:", error);
    }
  };

  // 알림 삭제
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.notificationId !== notificationId)
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("알림 삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'TRANSFER_TO_WALLET':
        return `계좌에서 지갑으로 ${notification.amount.toLocaleString()}원이 이체되었습니다.`;
      case 'TRANSFER_TO_ACCOUNT':
        return `지갑에서 계좌로 ${notification.amount.toLocaleString()}원이 이체되었습니다.`;
      case 'PENDING':
        return '새로운 계약 요청이 있습니다.';
      case 'ACTIVE':
        return '계약이 체결되었습니다.';
      case 'COMPLETED':
        return '계약이 완료되었습니다.';
      case 'OVERDUE':
        return '연체가 발생했습니다.';
      default:
        return notification.message;
    }
  };

  return (
    <div className="notification-container">
      <div 
        className="notification-icon"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>알림</h3>
            {notifications.length === 0 ? (
              <p>새로운 알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className="notification-item"
                >
                  <div className="notification-message">
                    <p>{getNotificationMessage(notification)}</p>
                    <button
                      onClick={() => handleDelete(notification.notificationId)}
                      className="delete-button"
                    >
                      ×
                    </button>
                  </div>
                  <p className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;
