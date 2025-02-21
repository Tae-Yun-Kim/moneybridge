package com.moneybridge.service.wallet;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.domain.wallet.WalletTransaction;
import com.moneybridge.dto.wallet.WalletDTO;
import com.moneybridge.repository.account.AccountRepository;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.wallet.WalletRepository;


import com.moneybridge.repository.wallet.WalletTransactionRepository;
//import com.moneybridge.service.sms.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Log4j2
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final MemberRepository memberRepository;
    private final AccountRepository accountRepository;
    private final WalletTransactionRepository walletTransactionRepository;
//    private final SmsService smsService;

    @Override
    @Transactional
    public WalletDTO createWallet(WalletDTO walletDTO) {
        Optional<Member> optionalMember = memberRepository.findById(walletDTO.getMemberId());
        if (optionalMember.isEmpty()) {
            throw new RuntimeException("⚠️ 회원이 존재하지 않습니다: " + walletDTO.getMemberId());
        }
        Member member = optionalMember.get();
        System.out.println("✅ 회원 조회 성공: " + member.getId());

        // 2. Account 조회
        System.out.println("Received accountNumber: " + walletDTO.getAccountNumber());
        Account account = accountRepository.findByAccountNumber(walletDTO.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));


        String customWalletId = "w_" + member.getId();

        Wallet wallet = Wallet.builder()
                .walletId(customWalletId)
                .member(member)
                .account(account)
                .balance(0L)
                .pinNumber(walletDTO.getPinNumber()!= null ? walletDTO.getPinNumber() : "1234") // 기본값 설정
                .transactionCount(0)
                .isLocked(false)
                .build();

        wallet = walletRepository.save(wallet);
        return convertToDTO(wallet);
    }

    @Override
    public WalletDTO getWalletById(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return convertToDTO(wallet);
    }

    @Override
    public WalletDTO getWalletByAccountNumber(String accountNumber) {
        Wallet wallet = walletRepository.findByAccount_AccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return convertToDTO(wallet);
    }

    @Override
//    public WalletDTO getWalletByMemberId(String memberId) {
//        Wallet wallet = walletRepository.findByMember_Id(memberId)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//        return convertToDTO(wallet);
//    }
    public WalletDTO getWalletByMemberId(String memberId) {
        Optional<Wallet> walletOpt = walletRepository.findByMember_Id(memberId);

        if (walletOpt.isEmpty()) {
            log.warn("⚠️ 해당 회원의 지갑이 없습니다. memberId: {}", memberId);
            return null; // 예외 대신 null 반환
        }

        Wallet wallet = walletOpt.get();
        return convertToDTO(wallet);
    }

    @Override
    @Transactional
    public WalletDTO updateWalletBalance(String walletId, Long amount) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        long newBalance = wallet.getBalance() + amount;
        if (newBalance > 1000000000L) {
            throw new IllegalArgumentException("Balance cannot exceed 1 billion won");
        }
        wallet.updateBalance(amount);
        return convertToDTO(wallet);
    }

    @Override
    @Transactional
    public void incrementTransactionCount(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.incrementTransactionCount();
    }

    @Override
    @Transactional
    public void lockWallet(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.changeLockStatus(true);
    }

    @Override
    @Transactional
    public void unlockWallet(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.changeLockStatus(false);
    }

    @Override
    @Transactional
    public void updatePinNumber(String walletId, String oldPin, String newPin) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // 기존 PIN 확인
        if (!wallet.getPinNumber().equals(oldPin)) {
            throw new IllegalArgumentException("현재 PIN 번호가 올바르지 않습니다.");
        }

        // 새로운 PIN 유효성 검사 (4자리 숫자만 허용)
        if (newPin == null || !newPin.matches("\\d{4}")) {
            throw new IllegalArgumentException("새 PIN 번호는 4자리 숫자여야 합니다.");
        }

        // PIN 변경
        wallet.setPinNumber(newPin);
        walletRepository.save(wallet);
    }

//    @Override
//    @Transactional
//    public void transferFromAccountToWallet(String memberId, Long amount) {
//        // 1. 회원 및 지갑 찾기
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new RuntimeException("Member not found"));
//        Wallet wallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//
//        // 2. 계좌 검증
//        if (wallet.getAccount() == null) {
//            throw new IllegalArgumentException("No linked account found for this wallet");
//        }
//        if (wallet.getAccount().getBalance() < amount) {
//            throw new IllegalArgumentException("Insufficient account balance");
//        }
//
//        // 3. 계좌 잔액 차감 및 지갑 잔액 증가
//        wallet.getAccount().updateBalance(-amount);
//        wallet.updateBalance(amount);
//
//        // 4. 저장
//        walletRepository.save(wallet); // 지갑 업데이트
//        memberRepository.save(member); // 계좌 업데이트
//    }
@Override
@Transactional
public void transferFromAccountToWallet(String memberId, Long amount) {
    log.info("🔍 [Transfer] 계좌에서 지갑으로 송금 시작: {}, 금액: {}", memberId, amount);
    log.info("🔍 [Transaction] 트랜잭션 호출됨: {}", Thread.currentThread().getStackTrace());

    // 1. 회원 및 지갑 찾기
    Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
    Wallet wallet = walletRepository.findByMember(member)
            .orElseThrow(() -> new RuntimeException("Wallet not found"));

    // ✅ 지갑이 잠겨있다면 출금 불가
    if (wallet.isLocked()) {
        throw new IllegalStateException("❌ 지갑이 잠겨 있어 출금할 수 없습니다.");
    }

    // 2. 계좌 검증
    if (wallet.getAccount() == null) {
        throw new IllegalArgumentException("No linked account found for this wallet");
    }
    if (wallet.getAccount().getBalance() < amount) {
        throw new IllegalArgumentException("Insufficient account balance");
    }

    // 3. 계좌 잔액 차감 및 지갑 잔액 증가
    log.info("✅ [Before Update] 계좌 잔액: " + wallet.getAccount().getBalance());
    log.info("✅ [Before Update] 지갑 잔액: " + wallet.getBalance());

    long newAccountBalance = wallet.getAccount().getBalance() - amount;
    long newWalletBalance = wallet.getBalance() + amount;

    wallet.getAccount().setBalance(newAccountBalance); // 계좌 잔액 직접 설정
    wallet.setBalance(newWalletBalance); // 지갑 잔액 직접 설정

    log.info("✅ [After Update] 계좌 잔액: " + wallet.getAccount().getBalance());
    log.info("✅ [After Update] 지갑 잔액: " + wallet.getBalance());

    // 4. 거래 기록 생성 및 저장
    WalletTransaction transaction = WalletTransaction.builder()
            .fromWallet(null) // 계좌에서 송금하므로 `fromWallet`은 null
            .toWallet(wallet) // 도착 지갑
            .amount(amount)
            .transactionType("입금") // 거래 유형: 입금
            .build();
    walletTransactionRepository.save(transaction); // 거래 내역 저장

    // 5. 저장
    walletRepository.save(wallet); // 지갑 업데이트
    accountRepository.save(wallet.getAccount()); // 계좌 업데이트

    log.info("🔍 [Transfer] 계좌에서 지갑으로 송금 완료");
}

//    @Override
//    @Transactional
//    public void transferFromWalletToAccount(String memberId, Long amount) {
//        // 1. 회원 및 지갑 찾기
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new RuntimeException("Member not found"));
//        Wallet wallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//
//        // 2. 잔액 검증
//        if (wallet.getBalance() < amount) {
//            throw new IllegalArgumentException("Insufficient wallet balance");
//        }
//
//        // 3. 계좌 검증
//        if (wallet.getAccount() == null) {
//            throw new IllegalArgumentException("No linked account found for this wallet");
//        }
//
//        // 4. 지갑 잔액 차감 및 계좌 잔액 증가
//        wallet.updateBalance(-amount);
//        wallet.getAccount().updateBalance(amount);
//
//        // 5. 저장
//        walletRepository.save(wallet); // 지갑 업데이트
//        memberRepository.save(member); // 계좌 업데이트
//    }
@Override
@Transactional
public void transferFromWalletToAccount(String memberId, Long amount) {
    // 1. 회원 및 지갑 찾기
    Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));
    Wallet wallet = walletRepository.findByMember(member)
            .orElseThrow(() -> new RuntimeException("Wallet not found"));

    // ✅ 지갑이 잠겨있다면 출금 불가
    if (wallet.isLocked()) {
        throw new IllegalStateException("❌ 지갑이 잠겨 있어 출금할 수 없습니다.");
    }

    // 2. 잔액 검증
    if (wallet.getBalance() < amount) {
        throw new IllegalArgumentException("Insufficient wallet balance");
    }

    // 3. 계좌 검증
    if (wallet.getAccount() == null) {
        throw new IllegalArgumentException("No linked account found for this wallet");
    }

    // 4. 지갑 잔액 차감 및 계좌 잔액 증가
    long newAccountBalance = wallet.getAccount().getBalance() - amount;
    long newWalletBalance = wallet.getBalance() + amount;

    wallet.getAccount().setBalance(newAccountBalance); // 계좌 잔액 직접 설정
    wallet.setBalance(newWalletBalance); // 지갑 잔액 직접 설정

    // 5. 거래 기록 생성 및 저장
    WalletTransaction transaction = WalletTransaction.builder()
            .fromWallet(wallet) // 출발 지갑
            .toWallet(null) // 계좌로 송금하므로 `toWallet`은 null
            .amount(amount)
            .transactionType("출금") // 거래 유형: 출금
            .build();
    walletTransactionRepository.save(transaction); // 거래 내역 저장

    // 6. 저장
    walletRepository.save(wallet); // 지갑 업데이트
    accountRepository.save(wallet.getAccount()); // 계좌 업데이트
    }

    @Override
    @Transactional
    public void transferBetweenWallets(String fromWalletId, String toWalletId, Long amount) {
        // 출발 지갑 및 도착 지갑 조회
        Wallet fromWallet = walletRepository.findById(fromWalletId)
                .orElseThrow(() -> new RuntimeException("From Wallet not found"));
        Wallet toWallet = walletRepository.findById(toWalletId)
                .orElseThrow(() -> new RuntimeException("To Wallet not found"));

        // ✅ 출발 지갑 또는 도착 지갑이 잠겨 있으면 송금 불가
        if (fromWallet.isLocked() || toWallet.isLocked()) {
            throw new IllegalStateException("❌ 송금할 수 없습니다. 한쪽 지갑이 잠겨 있습니다.");
        }

        // 출발 지갑 잔액 확인
        if (fromWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance in the sender's wallet.");
        }

        // 잔액 업데이트
        fromWallet.updateBalanceWithWallet(-amount); // 출발 지갑에서 금액 차감
        toWallet.updateBalanceWithWallet(amount);   // 도착 지갑에 금액 추가

        // 거래 카운트 업데이트
        fromWallet.incrementTransactionCount(); // 출발 지갑의 거래 카운트 증가
//        toWallet.incrementTransactionCount();   // 도착 지갑의 거래 카운트 증가

        // 거래 기록 생성
        WalletTransaction walletTransaction = WalletTransaction.builder()
                .fromWallet(fromWallet)
                .toWallet(toWallet)
                .amount(amount)
                .transactionType("송금") // 거래 타입 설정 (예: 송금)
                .build();

        // 저장
        walletTransactionRepository.save(walletTransaction);
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);


        // ✅ 수신 지갑 회원 정보 조회 후 전화번호 가져오기
//        Member receiver = memberRepository.findById(toWallet.getMember().getId())
//                .orElseThrow(() -> new RuntimeException("수신자 회원을 찾을 수 없음"));
//
//        String receiverPhone = receiver.getPhoneNumber(); // 수신자의 전화번호 가져오기
//        String senderPhone = fromWallet.getMember().getPhoneNumber(); // 발신자의 전화번호 가져오기
//
//        // ✅ 문자 메시지 전송
//        String message = "지갑 간 송금 완료: " + amount + "원이 송금되었습니다.";
//        smsService.sendSms(receiverPhone, senderPhone, message);

        // 2. 문자 전송 (받는 사람에게)
//        smsService.sendSms(toWallet.getMember().getPhoneNumber(), fromWallet.getMember().getPhoneNumber(), amount);

//        System.out.println("송금 완료: " + fromWallet.getMember().getId() + " -> " + toWallet.getMember().getId() + ", 금액: " + amount);
    }

    private WalletDTO convertToDTO(Wallet wallet) {
        return WalletDTO.builder()
                .walletId(wallet.getWalletId())
                .memberId(wallet.getMember().getId())
                .accountNumber(wallet.getAccount().getAccountNumber())
                .balance(wallet.getBalance())
                .pinNumber(wallet.getPinNumber())
                .transactionCount(wallet.getTransactionCount())
                .isLocked(wallet.isLocked())
                .build();
    }

    @Transactional
    @Override
    public void lockWalletByBorrowerId(String borrowerId) {
        Wallet wallet = walletRepository.findByMember_Id(borrowerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 대출자의 지갑을 찾을 수 없습니다."));

        if (wallet.isLocked()) {
            throw new IllegalStateException("이미 잠긴 지갑입니다.");
        }

        wallet.setLocked(true);
        walletRepository.save(wallet);
    }
}
