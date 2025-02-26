from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import openai
import requests
import db
import re
import time  # ✅ 음성 인식 대기 시간 추가

from langchain_openai import ChatOpenAI

#DB의 질의응답을 위한 agent
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents import create_pandas_dataframe_agent

#pip install tabulate
from tabulate import tabulate
import pandas as pd

import matplotlib.pyplot as plt
import io
import base64
import platform

# 폰트 설정
if platform.system() == 'Windows':
    plt.rc('font', family='Malgun Gothic')
elif platform.system() == 'Darwin':
    plt.rc('font', family='AppleGothic')

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = "APIKEY"

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get("message")
    print(user_input)
    
    if "포인트 조회" in user_input:
        user_id = "user1"  # 실제 사용자의 ID를 동적으로 가져와야 함
        response = requests.get(f"http://localhost:8080/api/points/{user_id}")
        point_value = response.json()
        chatbot_response = f"사용자의 현재 포인트는 {point_value}점 입니다."
    else:
        openai.api_key = OPENAI_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        chatbot_response = response["choices"][0]["message"]["content"]
        print(chatbot_response)

    return jsonify({"response": chatbot_response})

#사이트의 기능 안내, 명령어 필터링
#프롬프트를 통해 기능, 성능 개선
@app.route('/info', methods=['POST'])
def info():

    #사용자의 질문
    user_input = request.json.get("message")
    print(user_input) # 사용자의 질문 확인 -> 리액트와 python의 통신에 문제 없음

    os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY #openai.api_key = OPENAI_API_KEY와 같음
    #python f포맷 -> ''' ''' 여러줄의 문자가 입력되어도 한 묶음으로 인식할 수 있게
    prompt_info = f'''
    "당신은 개인 간 대출 플랫폼의 고객 지원 챗봇입니다. 사용자가 사이트 기능 및 금융 관련 질문을 하면 친절하고 정확하게 답변하세요. 아래와 같은 유형의 질문이 예상됩니다:

    대출은 어떻게 받을 수 있나요?
    답변: 대출 진행은 채권자 회원들의 게시글에 내용 확인 후 댓글로 본인이 납부할 이자율과 댓글 내용을 입력,
    그 글을 쓴 채권자 회원이 댓글들을 확인 후 맘에 드는 채무자의 댓글을 선택하면 계약진행으로 넘어가고 그에 
    따라 계약 확인 후 채권자의 송금으로 대출 계약이 진행
    
    채무자가 돈을 갚지 않으면 어떻게 되나요?
    답변: 대리 추심 시스템 안내, 신청 방법 및 관리자의 역할 설명
    
    기부 진행은 어떻게 되나요?
    답변: 대출 계약 완료 후 일부 수수료가 기부되며, 기부 내역은 메인 페이지 하단에 표시됨
    
    상환 날짜를 연장하려면 어떻게 해야 하나요?
    답변: 상환 날짜 변경 신청 방법 안내
    
    채권자가 되고 싶으면 어떻게 해야 하나요?
    답변: 홈페이지 상단의 채권/채무 변경 신청 절차 안내
    
    사이트의 주요 기능은 무엇인가요?
    답변: 개인 간 대출을 중개하는 플랫폼으로, 은행을 거치지 않고 직접 대출이 가능함
    
    등급 기준은 어떻게 되나요?
    답변: 대출 계약이 완료된 횟수에 따라 등급이 결정되며, 10회 이상은 실버, 20회 이상은 골드로 부여됨

    지갑(페이) 충전 방법은?
    답변: '내 지갑'에서 충전 가능

    지갑에서 계좌로 이체하려면?
    답변: '내 지갑'에서 본인 계좌로 이체 가능

    계약 상대에게 돈을 보내는 방법은?
    답변: '내 지갑'에서 송금 버튼을 사용하여 상대방의 지갑으로 송금 가능

    당신은 위 내용을 기반으로 사용자의 질문을 이해하고, 친절하고 명확한 답변을 제공해야 합니다."
    '''

    Chat = ChatOpenAI(temperature = 0.3, model='gpt-4o-mini')
    messages = [
        ('system', prompt_info),
        ('human', user_input)
    ]

    response = Chat.invoke(messages)
    return jsonify({"response":response.content})

# ✅ 음성 인식 기능 (OpenAI 최신 API & 2초 대기 적용)
@app.route('/voice-chat', methods=['POST'])
def voice_chat():
    """ 음성으로 입력된 질문을 기존 챗봇과 데이터 조회 기능에 연결 """
    audio_text = request.json.get("text") or request.json.get("message")

    if not audio_text or audio_text.strip() == "":
        return jsonify({"response": "❌ 음성을 인식하지 못했습니다. 다시 시도해주세요."})

    print("🎤 음성 입력 감지됨. 2초 대기 후 처리 시작...")  # ✅ 2초 대기 메시지
    time.sleep(2)  # ✅ 음성 인식 후 2초 대기

    response_text = filter_voice(audio_text)
    if response_text == "❌ 해당 조건에 맞는 데이터가 없습니다.":
        return jsonify({"response": "🔄 다시 말씀해주세요!"})
    
    return filter_voice(audio_text)


@app.route('/filter', methods=['POST'])
def filter():
    user_input = request.json.get('message')
    print(user_input)

    def extract_amount(text):
        match = re.search(r'(\d+(\.\d+)?)[억만천]?', text)
        if match:
            amount = int(match.group(1))
            if '억' in text:
                return amount * 100000000
            elif '만' in text:
                return amount * 10000
            elif '천' in text:
                return amount * 1000
            return int(amount)
        return None

    loan_amount = extract_amount(user_input)

    if loan_amount is None:
        return jsonify({"response": "대출 금액을 정확히 입력해주세요 (예: 500만원, 2억)."})

    # 🔹 데이터 가져오기
    dataframe = db.show_data("loan_posts")

    print("데이터프레임 컬럼 목록:", dataframe.columns)

    if dataframe.empty:
        return jsonify({"response": "현재 대출 게시글이 없습니다."})

    # 🔹 계약된 게시글을 제거하기 위해 contracts 테이블의 loan_post_id 목록 가져오기
    contracts_df = db.show_data("contracts")

    if "loan_post_id" in contracts_df.columns:
        contract_ids = contracts_df["loan_post_id"].tolist()
        is_contracted = dataframe["id"].isin(contract_ids)  # 계약된 게시글 여부 확인
        contracted_df = dataframe[is_contracted]  # 계약된 게시글 목록
        dataframe = dataframe[~is_contracted]  # 계약되지 않은 게시글만 남기기

    # 🔹 필터링된 데이터 확인
    available_posts = dataframe[dataframe["loan_amount"] == loan_amount]
    contracted_posts = contracted_df[contracted_df["loan_amount"] == loan_amount] if "contracted_df" in locals() else None

    if available_posts.empty and (contracted_posts is not None and not contracted_posts.empty):
        return jsonify({"response": f"{loan_amount:,}원 대출 게시글이 있지만, 모두 계약이 완료되었습니다."})

    if available_posts.empty:
        return jsonify({"response": f"{loan_amount:,}원을 빌려주는 게시글이 없습니다."})

    response_text = f"<p>{loan_amount:,}원을 빌려주는 게시글 리스트입니다:</p><ul>"
    for _, row in available_posts.iterrows():
        response_text += (
            f"<li>작성자: {row['member_id']}, "
            f"대출 금액: {row['loan_amount']:,}원, 작성일: {row['created_at']}, "
            f"상환 기간: {row['repayment_period']}개월, "
            f"<a href='/post/view/{row['id']}' className='chatbot-response-button'>게시글보기</a></li>\n"
        )
    response_text += "</ul>"

    return jsonify({"response": response_text})

    # return jsonify({"response": "데이터베이스에 필요한 컬럼이 없습니다."})



def filter_voice(user_input):
    """ 음성으로 대출 게시글 검색 (계약된 게시글 제외) """
    print(f"음성 입력: {user_input}")

    def extract_amount(text):
        match = re.search(r'(\d+(?:\.\d+)?)[억만천원]?', text)
        if match:
            amount = int(match.group(1))
            if '억' in text:
                return amount * 100000000
            elif '만' in text:
                return amount * 10000
            elif '천' in text:
                return amount * 1000
            elif '원' in text:
                return amount
            return int(amount)
        return None

    loan_amount = extract_amount(user_input)

    if loan_amount is None:
        return jsonify({"response": "❌ 대출 금액을 정확히 입력해주세요 (예: 500만원, 2억)."})

    # 🔹 데이터 조회 (loan_posts 테이블)
    dataframe = db.show_data("loan_posts")

    print("데이터프레임 컬럼 목록:", dataframe.columns)

    if dataframe.empty:
        return jsonify({"response": "⚠️ 현재 대출 게시글이 없습니다."})

    # 🔹 계약된 게시글을 제거하기 위해 contracts 테이블의 loan_post_id 목록 가져오기
    contracts_df = db.show_data("contracts")

    if "loan_post_id" in contracts_df.columns:
        contract_ids = contracts_df["loan_post_id"].tolist()
        is_contracted = dataframe["id"].isin(contract_ids)  # 계약된 게시글 여부 확인
        contracted_df = dataframe[is_contracted]  # 계약된 게시글 목록
        dataframe = dataframe[~is_contracted]  # 계약되지 않은 게시글만 남기기

    # 🔹 필터링된 데이터 확인
    available_posts = dataframe[dataframe["loan_amount"] == loan_amount]
    contracted_posts = contracted_df[contracted_df["loan_amount"] == loan_amount] if "contracted_df" in locals() else None

    if available_posts.empty and (contracted_posts is not None and not contracted_posts.empty):
        return jsonify({"response": f"🔒 {loan_amount:,}원 대출 게시글이 있지만, 모두 계약이 완료되었습니다."})

    if available_posts.empty:
        return jsonify({"response": f"❌ {loan_amount:,}원을 빌려주는 게시글이 없습니다."})

    response_text = f"<p>{loan_amount:,}원을 빌려주는 게시글 리스트입니다.</p><ul>"
    for _, row in available_posts.iterrows():
        response_text += (
            f"<li>작성자: {row['member_id']}, "
            f"대출 금액: {row['loan_amount']:,}원, 작성일: {row['created_at']}, "
            f"상환 기간: {row['repayment_period']}개월, "
            f"<a href='/post/view/{row['id']}' className='chatbot-response-button'>게시글보기</a></li>\n"
        )
    response_text += "</ul>"

    return jsonify({"response": response_text})

@app.route('/chart', methods=["GET"])
def interest_rate_chart():
    """최근 4일 동안 날짜별 평균 이자율 그래프 생성"""
    table = "contracts"
    
    try:
        dataframe = db.show_data(table)

        if dataframe.empty or "interest_rate" not in dataframe.columns:
            print("❌ 이자율 데이터 없음")
            return jsonify({"error": "이자율 데이터가 없습니다."}), 500

        # ✅ created_at 컬럼을 datetime으로 변환
        dataframe["created_at"] = pd.to_datetime(dataframe["created_at"], errors="coerce")

        # ✅ NaT 값 제거
        dataframe = dataframe.dropna(subset=["created_at"])

        # ✅ 최근 4일 데이터 필터링
        filter_date = pd.Timestamp.now().normalize() - pd.DateOffset(days=3)
        recent_data = dataframe[dataframe["created_at"].dt.date >= filter_date.date()]

        if recent_data.empty:
            print("❌ 최근 4일간 데이터 없음")
            return jsonify({"error": "최근 4일 동안의 이자율 데이터가 없습니다."}), 500

        # ✅ interest_rate NaN 값 제거
        recent_data = recent_data.dropna(subset=["interest_rate"])

        # ✅ 날짜별 평균 이자율 계산
        daily_avg_interest_rate = recent_data.groupby(recent_data["created_at"].dt.date)["interest_rate"].mean()

        # ✅ 최근 4일 날짜 생성
        date_range = pd.date_range(end=pd.Timestamp.now().normalize(), periods=4, freq='D')

        # ✅ 누락된 날짜를 0으로 채움
        daily_avg_interest_rate = daily_avg_interest_rate.reindex(date_range, fill_value=0)

        if daily_avg_interest_rate.empty:
            print("❌ 차트를 생성할 데이터 없음")
            return jsonify({"error": "차트를 생성할 데이터가 없습니다."}), 500

        # ✅ 선그래프 그리기 (x축: 날짜, y축: 평균 이자율)
        plt.figure(figsize=(2, 2))
        plt.plot(daily_avg_interest_rate.index, daily_avg_interest_rate.values, marker='o', linestyle='-', color='b')

        # ✅ x축, y축 라벨 및 제목 설정
        # plt.xlabel("날짜")
        plt.ylabel("평\n균\n이\n자\n율\n(%)", rotation=0 ,labelpad=15)
        plt.ylim(0, 20)
        # plt.title("최근 4일간 날짜별 평균 이자율")
        # ✅ 옅은 가로 & 세로선 추가 (격자선)
        plt.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray', alpha=0.7)  


        # ✅ 각 점 위에 이자율 값 표시
        for i, txt in enumerate(daily_avg_interest_rate.values):
            plt.text(daily_avg_interest_rate.index[i], txt, f"{txt:.2f}%", ha='center', va='bottom', fontsize=10)


        # ✅ x축 날짜 직접 설정 (하루 단위 4개 표시)
        formatted_dates = [d.strftime("%Y-%m-%d") for d in daily_avg_interest_rate.index]
        plt.xticks(daily_avg_interest_rate.index, labels=formatted_dates, rotation=45)


        # ✅ 차트를 이미지로 변환 후 Base64 인코딩
        img = io.BytesIO()
        plt.savefig(img, format="png", dpi=100, bbox_inches='tight')  # ✅ 이미지 해상도 및 여백 조정
        img.seek(0)
        img_base64 = base64.b64encode(img.getvalue()).decode()

        return jsonify({"image": img_base64})

    except Exception as e:
        print(f"❌ /chart API 오류 발생: {e}")
        return jsonify({"error": f"서버 내부 오류 발생: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(port=7000) 
