import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./PostSlider.css";
/* React Slick 기본 스타일 */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllLoanPosts } from "../api/postApi";

const PostSlider = () => {
  const [posts, setPosts] = useState([]); // 모든 게시글 데이터
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllLoanPosts(); // 모든 게시글 가져오기
        const sortedPosts = allPosts
          .sort((a, b) => b.comments.length - a.comments.length) // 댓글 많은 순
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신 날짜 순
        setPosts(sortedPosts);
      } catch (error) {
        console.error("게시글 데이터 가져오기 오류:", error);
        setError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-slider-container">
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>글쓴이 ID: {post.writerId}</h3>
            <p>작성 시간: {new Date(post.createdAt).toLocaleString()}</p>
            <p>대출 금액: {post.loanAmount.toLocaleString()} 원</p>
            <p>댓글 수: {post.comments.length}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PostSlider;
