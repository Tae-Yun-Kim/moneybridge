package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.dto.post.NotificationDTO;
import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO notificationDTO, String memberId);
    List<NotificationDTO> getMemberNotifications(String userId);

    void deleteNotification(Long notificationId);
    // 계약 승인 대기(대출희망자가 댓글 닮)
    void createApprovalPendingNotification(Member member, LoanPost post, String comment);
    // 계약 대기 알림 생성(채무자가 댓글 선택했을 때)
    void createContractPendingNotification(Member member, LoanPost post);
    // 출자자가 계약 최종승인
    void createContractActiveNotification(Member member, Contract contract);
    // 계약 연체
    void createOverdueNotification(Member member, LoanPost post);
    // 계약 완료(상환 완료)
    void createContractCompletedNotification(Member member, LoanPost post);
    // 계약 취소
    void createContractCancelledNotification(Member borrower, Member lender, Contract contract);

    // 채권자 -> 채무자, 채무자 -> 채권자
//    void createDebtorToCreditorNotification(Member member, Double amount);
//    void createCreditorToDebtorNotification(Member member, Double amount);

    // 지갑 -> 계좌, 계좌-> 지갑
//  void createTransferToWalletNotification(Member member, Double amount, LoanPost post);
//  void createTransferToAccountNotification(Member member, Double amount, LoanPost post);

}
