import { useState, useEffect } from 'react';
import { debtApi } from '../api/debtApi';

export const useDebt = (debtId) => {
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');  
        // 토큰이 없으면 에러를 설정하고 종료
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // API 호출 시, token을 함께 전달합니다.
        const data = await debtApi.getDebtById(debtId, token);
        setDebt(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (debtId) {
      fetchDebt();
    }
  }, [debtId]);

  return { debt, loading, error };
};
