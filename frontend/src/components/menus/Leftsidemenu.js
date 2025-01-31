import "./BasicMenu.css"; // 일반 CSS import
import dororong from "../../images/윈드밀도로롱.gif";

const Leftsidemenu = () => {
  return (
    <div className="flex flex-col">
      {/* 첫 번째 박스 */}
      <div className="menu-box">
        <h3>회원신용도 순위 TOP 10(API)</h3>
        <ul className="text-left">
          <li>1. 김뫄뫄</li>
          <li>2. 도로롱</li>
          <li>3. 무로롱</li>
          <li>4. 김ㅅㅅ</li>
          <li>5. 몰라!</li>
          <li>6. 배고파</li>
          <li>7. 나다</li>
          <li>8. 죽을게</li>
          <li>9. 똥</li>
          <li>10. 뜌땨</li>
        </ul>
      </div>

      {/* 두 번째 박스 */}
      <div className="menu-box green">
        <h3>은행대출이자율API</h3>
        <div className="image-container">
          <img src={dororong} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Leftsidemenu;
