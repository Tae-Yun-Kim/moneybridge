package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.dto.post.NotificationDTO;
import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO notificationDTO, String memberId);
    List<NotificationDTO> getMemberNotifications(String userId);
    void deleteNotification(Long notificationId);

    void createContractPendingNotification(Member member, LoanPost post);
    void createApprovalPendingNotification(Member member, LoanPost post, String comment);
    void createContractActiveNotification(Member member, LoanPost post);
    void createOverdueNotification(Member member, LoanPost post);
    void createContractCompletedNotification(Member member, LoanPost post);
    void createContractCancelledNotification(Member member, LoanPost post);

    // 채권자 -> 채무자, 채무자 -> 채권자
//    void createDebtorToCreditorNotification(Member member, Double amount);
//    void createCreditorToDebtorNotification(Member member, Double amount);

    // 지갑 -> 계좌, 계좌-> 지갑
//  void createTransferToWalletNotification(Member member, Double amount, LoanPost post);
//  void createTransferToAccountNotification(Member member, Double amount, LoanPost post);

}
