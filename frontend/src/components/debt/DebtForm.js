import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createDebt } from '../../slices/debtSlice';
import { debtApi } from '../../api/debtApi';

const DebtForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    repaymentPeriod: '',
    postId: '', // 게시글 ID 추가
  });

  const [calculatedData, setCalculatedData] = useState({
    totalAmount: 0,
    fee: 0,
  });

  const [memberRole, setMemberRole] = useState('');
  const [isLoadingMember, setIsLoadingMember] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      debtApi
        .getMemberInfo()
        .then((response) => {
          setMemberRole(response.lender ? '채권자' : '채무자');
          setIsLoadingMember(false);
        })
        .catch((error) => {
          console.error('Error fetching member info:', error);
          setIsLoadingMember(false);
        });
    } else {
      console.error('회원 정보가 없습니다.');
      setIsLoadingMember(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (name === 'loanAmount' || name === 'interestRate') {
      const loanAmount = Number(updatedFormData.loanAmount) || 0;
      const interestRate = Number(updatedFormData.interestRate) || 0;

      const fee = Math.floor(loanAmount / 1000000) * 1000;
      const totalAmount = loanAmount + loanAmount * (interestRate / 100) + fee;

      setCalculatedData({
        totalAmount: Math.round(totalAmount),
        fee: fee,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }
  
      const debtData = {
        postId: { id: Number(formData.postId) },  // postId를 객체로 래핑
        loanAmount: Number(formData.loanAmount),
        interestRate: Number(formData.interestRate),
        repaymentPeriod: Number(formData.repaymentPeriod),
        fee: calculatedData.fee,
      };
  
      console.log("debtData: ", debtData);
  
      // debt 생성 요청
      await dispatch(createDebt({ debtData, accessToken: token })).unwrap();
      alert("채무가 등록됐습니다");
  
    } catch (error) {
      console.log("formData: ", formData);
      
      if (error.response && error.response.status === 400) {
        alert("현재 상환 중인 부채가 있어 등록할 수 없습니다.");
      } else {
        console.error('Failed to create debt:', error);
        alert("현재 상환 중인 부채가 있어 등록할 수 없습니다.");
      }
    }
  };
  

  if (isLoadingMember) {
    return <p>회원 정보를 로딩 중...</p>;
  }

  if (memberRole !== '채무자') {
    return <p>부채 등록은 채무자만 가능합니다.</p>;
  }

  return (
    <div>
      <h3>부채 등록</h3>
      <form onSubmit={handleSubmit}>

        <div>
          <label>게시글 ID</label>
          <input
            type="number"
            name="postId"
            placeholder="게시글 ID"
            value={formData.postId}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>대출 금액</label>
          <input
            type="number"
            name="loanAmount"
            placeholder="대출 금액"
            value={formData.loanAmount}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>이자율</label>
          <input
            type="number"
            name="interestRate"
            placeholder="이자율"
            value={formData.interestRate}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>상환 기간(일)</label>
          <input
            type="number"
            name="repaymentPeriod"
            placeholder="상환 기간(일)"
            value={formData.repaymentPeriod}
            onChange={(e) =>
              setFormData({ ...formData, repaymentPeriod: e.target.value })
            }
          />
        </div>

        <button type="submit">저장</button>
      </form>
        <p>이자 포함 총액: {calculatedData.totalAmount.toLocaleString()} 원</p>
        <p>수수료: {calculatedData.fee.toLocaleString()} 원</p>
    </div>
  );
};

export default DebtForm;
