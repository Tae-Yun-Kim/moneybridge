//package com.moneybridge.domain.qna;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "qna_attachments")
//@Getter
//@ToString(exclude = "qna") // 순환 참조 방지
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//public class QnaAttachment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//    private String fileType; // 파일 타입 (image 또는 file)
//
//
//
//    @Column(nullable = false, length = 255) // 파일 이름 최대 길이 제한
//    private String fileName;
//
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "qno", nullable = false)
//    private Qna qna;
//
//
//    public void setQna(Qna qna) {
//        this.qna = qna;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        QnaAttachment that = (QnaAttachment) o;
//        return id != null && id.equals(that.id);
//    }
//
//    @Override
//    public int hashCode() {
//        return getClass().hashCode();
//    }
//}
