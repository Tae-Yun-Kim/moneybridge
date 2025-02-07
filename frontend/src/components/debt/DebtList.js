import React, { useState, useEffect } from 'react';
import { debtApi } from '../../api/debtApi';
import { DEBT_STATUS } from '../../util/repaymentStatusUtil';  // DEBT_STATUS 가져오기

const DebtList = () => {
  const [debts, setDebts] = useState([]);
  const [memberRole, setMemberRole] = useState('');
  const [isLoadingDebts, setIsLoadingDebts] = useState(true);
  const [isLoadingMember, setIsLoadingMember] = useState(true);
  const [processingDebtId, setProcessingDebtId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error("토큰이 없습니다. 로그인 상태를 확인해주세요.");
      return;
    }

    // 회원 정보 가져오기
    debtApi.getMemberInfo(token)
      .then((response) => {
        setMemberRole(response.lender ? '채권자' : '채무자');
        setIsLoadingMember(false);
      })
      .catch((error) => {
        console.error("회원 정보 로딩 실패", error);
        setIsLoadingMember(false);
      });

    // 부채 목록 가져오기
    debtApi.getAllDebts(token)
      .then((response) => {
        console.log('전체 응답:', response);
        setDebts(response || []);
        setIsLoadingDebts(false);
      })
      .catch((error) => {
        console.error("부채 목록 가져오기 실패", error);
        setIsLoadingDebts(false);
      });
  }, []);

  if (isLoadingMember || isLoadingDebts) {
    return <p>데이터를 로딩 중...</p>;
  }

  if (memberRole !== '채무자' && memberRole !== '채권자') {
    return <p>부채 목록은 채무자나 채권자만 볼 수 있습니다.</p>;
  }

  return (
    <div>
      <h3>부채 목록 ({memberRole})</h3>

      {debts.length > 0 ? (
        debts.map(debt => (
          <div key={debt.debtId} className="debt-item">
            <p>사용자 ID: {debt.member?.id || '알 수 없음'}</p>
            <p>사용자 이름: {debt.member?.name || '알 수 없음'}</p>
            <p>대출 ID: {debt.debtId}</p>

            {memberRole === '채무자' && (
              <>
                <p>대출 금액: {debt.loanAmount.toLocaleString()}원</p>
                <p>상환 기간: {debt.repaymentPeriod}일</p>
                <p>상환 날짜: {debt.repaymentDate}</p>
                <p>상환 상태: {DEBT_STATUS[debt.repaymentStatus] || '알 수 없음'}</p>

                <button
                  onClick={async () => {
                    try {
                      setProcessingDebtId(debt.debtId);
                      const token = localStorage.getItem('accessToken');

                      // 연장 요청
                      await debtApi.requestExtension(debt.debtId, token);

                      // 연장 요청 후 부채 목록 새로고침
                      const updatedDebts = await debtApi.getAllDebts(token);
                      setDebts(updatedDebts || []);

                      alert('연장 신청이 완료되었습니다.');
                    } catch (error) {
                      console.error('연장 신청 실패:', error);
                      alert('연장 신청에 실패했습니다.');
                    } finally {
                      setProcessingDebtId(null);
                    }
                  }}
                  disabled={
                    processingDebtId === debt.debtId ||
                    debt.extensionRequested ||
                    debt.repaymentStatus === 'COMPLETED'
                  }
                >
                  {processingDebtId === debt.debtId ? '처리 중...' :
                   debt.extensionRequested ? '연장 신청됨' :
                   '상환기간 연장 신청'}
                </button>
              </>
            )}

            {memberRole === '채권자' && (
              <>
                <p>추심 진행 여부: {debt.collectionInProgress ? '진행' : '진행 안 함'}</p>
              </>
            )}
          </div>
        ))
      ) : (
        <p>부채 목록이 없습니다.</p>
      )}
    </div>
  );
};

export default DebtList;
