package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.repository.account.AccountRepository;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.assertThat;
import org.springframework.test.annotation.Commit;
import java.util.Optional;

@Commit
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
public class ContractRepositoryTests {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private LoanPostRepository loanPostRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private AccountRepository accountRepository;

    private Member lender;
    private Member borrower;
    private LoanPost loanPost;
    private PostComment selectedComment;
    private Contract contract;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        // ✅ 계좌 생성 (새로운 계좌번호 및 정보)
        Account lenderAccount = accountRepository.findByAccountNumber("321-654-987")
                .orElseGet(() -> accountRepository.save(Account.builder()
                        .accountNumber("321-654-987")
                        .accountHolderName("투자자")
                        .accountPassword("securePass789")
                        .bankName("FinanceBridge Bank")
                        .balance(20000000L)
                        .build()));

        Account borrowerAccount = accountRepository.findByAccountNumber("789-123-456")
                .orElseGet(() -> accountRepository.save(Account.builder()
                        .accountNumber("789-123-456")
                        .accountHolderName("차입자")
                        .accountPassword("securePass321")
                        .bankName("FinanceBridge Bank")
                        .balance(7000000L)
                        .build()));

        // ✅ 회원 생성 (새로운 ID 및 정보)
        lender = memberRepository.save(Member.builder()
                .id("lender2")
                .password(passwordEncoder.encode("1111"))
                .name("투자자")
                .residentNumber("870505-6543210")
                .phoneNumber("010-3333-3333")
                .email("investor@email.com")
                .nickname("투자왕")
                .address("서울특별시 서초구")
                .isLender(true)
                .creditScore(850)
                .account(lenderAccount)
                .build());

        borrower = memberRepository.save(Member.builder()
                .id("borrower2")
                .password(passwordEncoder.encode("1111"))
                .name("차입자")
                .residentNumber("960606-9876543")
                .phoneNumber("010-4444-4444")
                .email("borrower2@email.com")
                .nickname("돈빌려줘")
                .address("대구광역시 수성구")
                .isLender(false)
                .creditScore(700)
                .account(borrowerAccount)
                .build());

        // ✅ 대출 게시글 생성 (새로운 조건 추가)
        loanPost = loanPostRepository.save(LoanPost.builder()
                .writer(borrower)
                .loanAmount(2000000L)
                .repaymentPeriod(24)
                .additionalConditions("담보 제공 가능")
                .build());

        // ✅ 댓글 생성 (새로운 금리 및 조건)
        selectedComment = postCommentRepository.save(PostComment.builder()
                .post(loanPost)
                .member(lender)
                .interestRate(4.5)
                .commentText("좋은 조건이네요. 대출 가능합니다.")
                .memberGrade(MemberGrade.GOLD)
                .isSelected(true)
                .build());

        // ✅ 계약 생성 (모든 계약 상태를 PENDING으로 설정)
        contract = contractRepository.save(Contract.builder()
                .lender(lender)
                .borrower(borrower)
                .loanPost(loanPost)
                .selectedComment(selectedComment)
                .loanAmount(2000000L)
                .repaymentPeriod(24)
                .interestRate(4.5)
                .totalRepaymentAmount(2090000L)
                .status(ContractStatus.PENDING) // **모든 계약 상태를 PENDING으로 설정**
                .build());
    }


    @Test
    void 계약_생성_테스트() {
        // 계약이 정상적으로 저장되었는지 확인
        assertThat(contract).isNotNull();
        assertThat(contract.getLender()).isEqualTo(lender);
        assertThat(contract.getBorrower()).isEqualTo(borrower);
    }

    @Test
    void 계약_조회_테스트() {
        // 계약 조회
        Optional<Contract> foundContract = contractRepository.findById(contract.getId());

        // 조회 결과 검증
        assertThat(foundContract).isPresent();
        assertThat(foundContract.get().getLoanPost()).isEqualTo(loanPost);
        assertThat(foundContract.get().getSelectedComment()).isEqualTo(selectedComment);
    }

    @Test
    void 계약_상태_업데이트_테스트() {
        // 계약 상태 변경
        contract.setStatus(ContractStatus.ACTIVE);
        contractRepository.save(contract);

        // 변경된 계약 조회 및 검증
        Contract updatedContract = contractRepository.findById(contract.getId())
                .orElseThrow(() -> new EntityNotFoundException("계약 없음"));
        assertThat(updatedContract.getStatus()).isEqualTo(ContractStatus.ACTIVE);
    }

    @Test
    void 계약_삭제_테스트() {
        // 계약 삭제
        contractRepository.delete(contract);

        // 삭제 여부 확인
        Optional<Contract> deletedContract = contractRepository.findById(contract.getId());
        assertThat(deletedContract).isEmpty();
    }
}
