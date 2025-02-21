package com.moneybridge.domain.qna;

import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "moneybridge_qna")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qno;

    @Column(nullable = false, length = 255)
    private String qnaTitle;

    @Column(nullable = false, length = 2000)
    private String qnaContent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id", nullable = false)
    private Member member; // 작성자 정보

    @Column(nullable = false)
    private boolean complete;

    private LocalDate dueDate;

    @Column(nullable = false)
    @Builder.Default
    private int viewCount = 0;


    // =============================================
    // QnA 댓글 관계 설정
    // QnaComment의 "qna" 필드와 매핑
    // cascade=ALL, orphanRemoval=true → QnA 삭제 시 댓글들도 삭제
    @Builder.Default
    @OneToMany(mappedBy = "qna", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QnaComment> comments = new ArrayList<>();

    @Column(nullable = false)
    private boolean isSecret;



    @Column(name = "registerDate", nullable = false, updatable = false)
    private LocalDate regDate;

    @Column(name = "modifyDate")
    private LocalDate modDate;

    @PrePersist
    protected void onCreate() {
        regDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        modDate = LocalDate.now();
    }

    public void changeTitle(String qnaTitle) {
        this.qnaTitle = qnaTitle;
    }

    public void changeContent(String qnaContent) {
        this.qnaContent = qnaContent;
    }

    public void changeComplete(boolean complete) {
        this.complete = complete;
    }

    public void changeDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }


    // ===========================================================

    // ====================== 댓글 편의 메서드 ======================
    public void addComment(QnaComment comment) {
        comment.setQna(this);    // 연관관계 주인(QnaComment)에 QnA 설정
        this.comments.add(comment);
    }

    public void removeComment(QnaComment comment) {
        this.comments.remove(comment);
        comment.setQna(null);
    }
    // ============================================================

    public void increaseViewCount() {
        this.viewCount++;
    }

    public String getId() {
        return member != null ? member.getId() : "Unknown";
    }

    public void updateModifiedDate() {
        this.modDate = LocalDate.now();
    }
}
