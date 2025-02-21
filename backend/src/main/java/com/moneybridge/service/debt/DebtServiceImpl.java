
package com.moneybridge.service.debt;

import com.moneybridge.domain.debt.DebtRequest;
import com.moneybridge.domain.debt.DebtRequestStatus;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberRole;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.debt.DebtRequestDTO;
import com.moneybridge.repository.debt.DebtRequestRepository;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.wallet.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {

    private final DebtRequestRepository debtRequestRepository;
    private final ContractRepository contractRepository;
    private final MemberRepository memberRepository;
    private final WalletRepository walletRepository; // ✅ 추가

    @Override
    @Transactional
    public DebtRequestDTO createDebtRequest(DebtRequestDTO dto) {
        return contractRepository.findById(dto.getContractId())
                .filter(contract -> contract.getStatus() == ContractStatus.OVERDUE)
                .map(contract -> {
                    DebtRequest debtRequest = DebtRequest.builder()
                            .contract(contract)
                            .lender(contract.getLender())
                            .debtstatus(DebtRequestStatus.PENDING)
                            .build();

                    debtRequestRepository.save(debtRequest);
                    return new DebtRequestDTO(debtRequest);
                })
                .orElseThrow(() -> new IllegalStateException("연체된 계약만 요청할 수 있습니다."));
    }

    @Override
    @Transactional
    public DebtRequestDTO updateDebtRequestStatus(Long requestId, DebtRequestStatus debtstatus) {
        return debtRequestRepository.findById(requestId)
                .map(debtRequest -> {
                    debtRequest.setDebtstatus(debtstatus);
                    debtRequestRepository.save(debtRequest);
                    return new DebtRequestDTO(debtRequest);
                })
                .orElseThrow(() -> new IllegalArgumentException("요청을 찾을 수 없습니다."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DebtRequestDTO> getDebtRequestsByContract(Long contractId) {
        return debtRequestRepository.findByContractId(contractId)
                .stream()
                .map(DebtRequestDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DebtRequestDTO> getAllDebtRequests(Authentication authentication) {
        Member admin = getAuthenticatedAdmin(authentication);
        return debtRequestRepository.findAll()
                .stream()
                .map(DebtRequestDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DebtRequestDTO approveOrRejectDebtRequest(Long requestId, DebtRequestStatus status, Authentication authentication) {
        Member admin = getAuthenticatedAdmin(authentication);

        return debtRequestRepository.findById(requestId)
                .map(debtRequest -> {
                    debtRequest.setDebtstatus(status);
                    debtRequestRepository.save(debtRequest);

                    // ✅ 상태 변경에 따른 대출자의 지갑 잠금/해제 처리
                    if (status == DebtRequestStatus.APPROVED) {
                        changeBorrowerWalletLock(debtRequest.getContract(), true); // 지갑 잠금
                    } else if (status == DebtRequestStatus.COLLECTED) {
                        changeBorrowerWalletLock(debtRequest.getContract(), false); // 지갑 해제
                    }

                    return new DebtRequestDTO(debtRequest);
                })
                .orElseThrow(() -> new IllegalArgumentException("요청을 찾을 수 없습니다."));
    }

    // ✅ 대출자의 지갑을 잠금 또는 해제하는 메서드
    private void changeBorrowerWalletLock(Contract contract, boolean lockStatus) {
        String borrowerId = contract.getBorrower().getId();
        Wallet wallet = walletRepository.findByMember_Id(borrowerId)
                .orElseThrow(() -> new IllegalArgumentException("대출자의 지갑을 찾을 수 없습니다."));

        if (wallet.isLocked() != lockStatus) { // 현재 상태와 다를 경우만 업데이트
            wallet.setLocked(lockStatus);
            walletRepository.save(wallet);
        }
    }

    // ✅ 관리자 권한 검증
    private Member getAuthenticatedAdmin(Authentication authentication) {
        return memberRepository.findById(authentication.getName())
                .filter(member -> member.getMemberRoleList().contains(MemberRole.ADMIN))
                .orElseThrow(() -> new SecurityException("관리자 권한이 없습니다."));
    }

    // ✅ 추심 완료 처리 (debtstatus를 COLLECTED로 변경 후 계약 상태 변경)
    @Override
    @Transactional
    public void completeDebtCollection(Long requestId) {
        DebtRequest debtRequest = debtRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 추심 요청입니다."));

        log.info("✅ 추심 요청 찾음: requestId={}, 현재 상태={}", debtRequest.getId(), debtRequest.getDebtstatus());

        // ✅ debtstatus를 COLLECTED로 변경
        debtRequest.setDebtstatus(DebtRequestStatus.COLLECTED);
        debtRequestRepository.save(debtRequest);
        log.info("✅ 추심 요청 상태를 COLLECTED로 변경 완료");

        // ✅ 관련 계약 찾기
        Contract contract = debtRequest.getContract();
        log.info("✅ 관련 계약 찾음: contractId={}, 현재 상태={}", contract.getId(), contract.getStatus());

        // ✅ 계약 상태가 OVERDUE인 경우 COMPLETED로 변경
        if (contract.getStatus() == ContractStatus.OVERDUE) {
            log.info("🔄 계약 상태를 COMPLETED로 변경 중: contractId={}", contract.getId());

            // ✅ 엔티티의 상태를 직접 변경
            contract.setStatus(ContractStatus.COMPLETED);

            // ✅ 변경 사항을 데이터베이스에 반영
            contractRepository.save(contract);
            contractRepository.flush();

            log.info("✅ 계약 상태를 COMPLETED로 변경 완료: contractId={}", contract.getId());
        } else {
            log.warn("⚠ 계약 상태가 OVERDUE가 아님: contractId={}, 현재 상태={}", contract.getId(), contract.getStatus());
        }
    }
}