//package com.moneybridge.service.post;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.post.Contract;
//import com.moneybridge.domain.post.LoanPost;
//import com.moneybridge.domain.post.Notification;
//import com.moneybridge.dto.post.NotificationDTO;
//import java.util.List;
//
//public interface NotificationService {
//    // ✅ 알림 생성 (redirectUrl 포함)
//    NotificationDTO createNotification(NotificationDTO notificationDTO, String memberId);
//
//    // ✅ 특정 회원의 알림 목록 조회 (이동 경로 포함)
//    List<NotificationDTO> getMemberNotifications(String memberId);
//    void deleteNotification(Long notificationId);
//    // 계약 승인 대기(대출희망자가 댓글 닮)
//    void createApprovalPendingNotification(Member member, LoanPost post, String comment);
//    // 계약 대기 알림 생성(채무자가 댓글 선택했을 때)
//    void createContractPendingNotification(Member member, LoanPost post);
//    // 출자자가 계약 최종승인
//    void createContractActiveNotification(Member member, Contract contract);
//    // 계약 연체
//    void createOverdueNotification(Member member, LoanPost post);
//    // 계약 완료(상환 완료)
//    void createContractCompletedNotification(Member member, LoanPost post);
//    // 계약 취소
//    void createContractCancelledNotification(Member borrower, Member lender, Contract contract);
//
//    // ✅ 이동 경로 자동 생성 (알림 클릭 시 이동할 페이지 결정)
//    String generateRedirectUrl(Notification.NotificationType type, LoanPost post);
//
//    // 채권자 -> 채무자, 채무자 -> 채권자
////    void createDebtorToCreditorNotification(Member member, Double amount);
////    void createCreditorToDebtorNotification(Member member, Double amount);
//
//    // 지갑 -> 계좌, 계좌-> 지갑
////  void createTransferToWalletNotification(Member member, Double amount, LoanPost post);
////  void createTransferToAccountNotification(Member member, Double amount, LoanPost post);
//
//}

package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import java.util.List;

public interface NotificationService {
    // ✅ 알림 생성 (redirectUrl 포함)
    NotificationDTO createNotification(NotificationDTO notificationDTO, String memberId);

    // ✅ 특정 회원의 알림 목록 조회 (이동 경로 포함)
    List<NotificationDTO> getMemberNotifications(String memberId);

    // ✅ 알림 삭제
    void deleteNotification(Long notificationId);

    // ✅ 계약 승인 대기 (대출희망자가 댓글 작성)
    void createApprovalPendingNotification(Member member, LoanPost post, String comment);

    // ✅ 계약 대기 알림 생성 (출자자가 댓글 선택)
    void createContractPendingNotification(Member member, LoanPost post);

    // ✅ 출자자가 계약 최종 승인
    void createContractActiveNotification(Member member, Contract contract);

    // ✅ 계약 연체 알림 생성
    void createOverdueNotification(Member member, LoanPost post);

    // ✅ 계약 완료 알림 생성 (상환 완료)
    void createContractCompletedNotification(Member member, LoanPost post);

    // ✅ 계약 취소 알림 생성
    void createContractCancelledNotification(Member borrower, Member lender, Contract contract);

    // ✅ 이동 경로 자동 생성 (알림 클릭 시 이동할 페이지 결정)
    String generateRedirectUrl(Notification.NotificationType type, LoanPost post);

    void createQnaNotification(Member receiver, Long qno);

    // ✅ 채무자 -> 채권자 이체 알림 (사용 X)
//    void createDebtorToCreditorNotification(Member member, Double amount);
//    void createCreditorToDebtorNotification(Member member, Double amount);

    // ✅ 지갑 -> 계좌, 계좌 -> 지갑 알림 (사용 X)
//    void createTransferToWalletNotification(Member member, Double amount, LoanPost post);
//    void createTransferToAccountNotification(Member member, Double amount, LoanPost post);
}
