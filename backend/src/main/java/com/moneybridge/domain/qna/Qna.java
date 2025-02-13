//package com.moneybridge.domain.qna;
//
//import com.moneybridge.domain.member.Member;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//
//@Entity
//@Table(name = "moneybridge_qna")
//@Getter
//@ToString
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Setter
//public class Qna {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long qno;
//
//    @Column(nullable = false, length = 255)
//    private String qnaTitle;
//
//    @Column(nullable = false, length = 2000)
//    private String qnaContent;
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "id", nullable = false)
//    private Member member;
//
//    @Column(nullable = false)
//    private boolean complete;
//
//    private LocalDate dueDate;
//
//    @Column(nullable = false)
//    @Builder.Default
//    private int viewCount = 0;
//
//    @Builder.Default
//    @OneToMany(mappedBy = "qna", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<QnaAttachment> attachments = new ArrayList<>();
//
//    @Column(nullable = false)
//    private boolean isSecret;
//
//    @Column(nullable = false, length = 100)
//    private String category;
//
//    @Column(name = "registerDate", nullable = false, updatable = false)
//    private LocalDate regDate;
//
//    @Column(name = "modifyDate")
//    private LocalDate modDate;
//
//    @PrePersist
//    protected void onCreate() {
//        regDate = LocalDate.now();
//    }
//
//    @PreUpdate
//    protected void onUpdate() {
//        modDate = LocalDate.now();
//    }
//
//    public void changeTitle(String qnaTitle) {
//        this.qnaTitle = qnaTitle;
//    }
//
//    public void changeContent(String qnaContent) {
//        this.qnaContent = qnaContent;
//    }
//
//    public void changeComplete(boolean complete) {
//        this.complete = complete;
//    }
//
//    public void changeDueDate(LocalDate dueDate) {
//        this.dueDate = dueDate;
//    }
//
//    public void addAttachment(QnaAttachment attachment) {
//        attachment.setQna(this);
//        this.attachments.add(attachment);
//    }
//
//
//    public List<QnaAttachment> getAttachmentsByType(String fileType) {
//        List<QnaAttachment> filteredAttachments = new ArrayList<>();
//        for (QnaAttachment attachment : attachments) {
//            if (attachment.getFileType().equalsIgnoreCase(fileType)) {
//                filteredAttachments.add(attachment);
//            }
//        }
//        return filteredAttachments;
//    }
//
//    public List<String> getAttachmentFileNames() {
//        List<String> fileNames = new ArrayList<>();
//        for (QnaAttachment attachment : attachments) {
//            fileNames.add(attachment.getFileName());
//        }
//        return fileNames;
//    }
//
//    public void increaseViewCount() {
//        this.viewCount++;
//    }
//
//    public String getId() {
//        return member != null ? member.getId() : "Unknown";
//    }
//
//    public void updateModifiedDate() {
//        this.modDate = LocalDate.now();
//    }
//
//    // 이미지 추가 메서드
//    public void addImageString(String fileName) {
//        QnaAttachment attachment = QnaAttachment.builder()
//                .fileName(fileName)
//                .fileType("image")
//                .qna(this)
//                .build();
//        this.attachments.add(attachment);
//    }
//}
