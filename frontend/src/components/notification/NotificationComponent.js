import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns"; // date-fns import 추가
import {
  getMemberNotifications,
  deleteNotification,
  createContractPendingNotification,
  createApprovalPendingNotification,
  createContractActiveNotification,
  createContractCompletedNotification,
  createContractCancelledNotification,
  createDebtorToCreditorNotification,
  createCreditorToDebtorNotification,
  createOverdueNotification,
} from "../../api/notificationApi";
import "./NotificationComponent.css";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  // 알림 목록 조회
  const fetchNotifications = async () => {
    try {
      const data = await getMemberNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((notif) => !notif.read).length);
      setError(null);
    } catch (error) {
      setError("알림을 불러오는데 실패했습니다.");
      console.error("알림 조회 실패:", error);
    }
  };

  // 알림 삭제
  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.notificationId !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setError(null);
    } catch (error) {
      setError("알림 삭제에 실패했습니다.");
      console.error("알림 삭제 실패:", error);
    }
  };

  // 새로운 알림 생성 함수들
  const createNotification = async (
    type,
    postId,
    amount = null,
    comment = null
  ) => {
    try {
      switch (type) {
        case "CONTRACT_PENDING":
          await createContractPendingNotification(postId);
          break;
        case "APPROVAL_PENDING":
          await createApprovalPendingNotification(postId, comment);
          break;
        case "CONTRACT_ACTIVE":
          await createContractActiveNotification(postId);
          break;
        case "CONTRACT_COMPLETED":
          await createContractCompletedNotification(postId);
          break;
        case "CONTRACT_CANCELLED":
          await createContractCancelledNotification(postId);
          break;
        case "DEBTOR_TO_CREDITOR":
          await createDebtorToCreditorNotification(postId, amount);
          break;
        case "CREDITOR_TO_DEBTOR":
          await createCreditorToDebtorNotification(postId, amount);
          break;
        case "OVERDUE":
          await createOverdueNotification(postId);
          break;
        default:
          throw new Error("알 수 없는 알림 유형입니다.");
      }
      await fetchNotifications(); // 알림 목록 새로고침
      setError(null);
    } catch (error) {
      setError("알림 생성에 실패했습니다.");
      console.error("알림 생성 실패:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // 새로고침 후에도 알림 개수를 유지하도록 초기 로드
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications(); // 드롭다운이 열릴 때만 새로고침
    }
  }, [showDropdown]);
  // const getNotificationMessage = (notification) => {
  //   switch (notification.type) {
  //     case 'TRANSFER_TO_WALLET':
  //     case 'DEBTOR_TO_CREDITOR':
  //       return `계좌에서 지갑으로 ${notification.amount?.toLocaleString()}원이 이체되었습니다.`;
  //     case 'TRANSFER_TO_ACCOUNT':
  //     case 'CREDITOR_TO_DEBTOR':
  //       return `지갑에서 계좌로 ${notification.amount?.toLocaleString()}원이 이체되었습니다.`;
  //     case 'CONTRACT_PENDING':
  //       return '새로운 계약 요청이 있습니다.';
  //     case 'APPROVAL_PENDING':
  //       return `승인 대기 중입니다: ${notification.comment || ''}`;
  //     case 'CONTRACT_ACTIVE':
  //       return '계약이 체결되었습니다.';
  //     case 'CONTRACT_COMPLETED':
  //       return '계약이 완료되었습니다.';
  //     case 'CONTRACT_CANCELLED':
  //       return '계약이 취소되었습니다.';
  //     case 'OVERDUE':
  //       return '연체가 발생했습니다.';
  //     default:
  //       return notification.message || '알 수 없는 알림';
  //   }
  // };
  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case "TRANSFER_TO_WALLET":
        return `회원님의 지갑으로 ${notification.amount?.toLocaleString()}원이 입금되었습니다.`;
      case "TRANSFER_TO_ACCOUNT":
        return `회원님의 계좌로 ${notification.amount?.toLocaleString()}원이 출금되었습니다.`;
      case "DEBTOR_TO_CREDITOR":
        return `계좌에서 지갑으로 ${notification.amount?.toLocaleString()}원이 이체되었습니다.`;
      case "CREDITOR_TO_DEBTOR":
        return `지갑에서 계좌로 ${notification.amount?.toLocaleString()}원이 이체되었습니다.`;
      case "CONTRACT_PENDING":
        return "새로운 계약 요청이 있습니다.";
      case "APPROVAL_PENDING":
        return `승인 대기 중입니다: ${notification.comment || ""}`;
      case "CONTRACT_ACTIVE":
        return "계약이 체결되었습니다.";
      case "CONTRACT_COMPLETED":
        return "계약이 완료되었습니다.";
      case "CONTRACT_CANCELLED":
        return "계약이 취소되었습니다.";
      case "OVERDUE":
        return "연체가 발생했습니다.";
      default:
        return notification.message || "알 수 없는 알림";
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-noti">
        <div
          className="notification-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-content">
            <h3 className="notification-title">알림</h3>
            {error && <div className="notification-error">{error}</div>}
            {notifications.length === 0 ? (
              <p className="notification-empty">새로운 알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className="notification-item"
                >
                  <div className="notification-item-content">
                    <p className="notification-time">
                      {format(
                        new Date(notification.createdAt),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </p>
                    <p className="notification-message">
                      {getNotificationMessage(notification)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.notificationId);
                      }}
                      className="notification-delete-btn"
                    >
                      확인
                    </button>
                  </div>
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
