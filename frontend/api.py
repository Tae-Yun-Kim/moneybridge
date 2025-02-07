from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import openai
import requests

from langchain_openai import ChatOpenAI

#DB의 질의응답을 위한 agent
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents import create_pandas_dataframe_agent

#pip install tabulate
from tabulate import tabulate
import pandas as pd

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = "#본인 api키"

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
    prompt_info = f'''"사용자가 특정 키워드를 입력하면, 이에 맞는 개인 간 대출 서비스 플랫폼의 기능을 설명해줘. 키워드에 따라 다음과 같이 응답해줘:

                대출 관련 기능 (대출, 빌리기, 돈 필요, 돈 빌려줘)

                사용자가 특정 금액을 빌리고 싶으면, 해당 금액을 빌려주는 게시글 리스트를 출력해.
                채무자가 돈을 갚지 않을 경우, 대리 추심 시스템을 추천해줘.
                
                상환 관련 기능 (상환, 갚기, 연체, 미납, 상환 연기)

                상환 날짜를 변경하고 싶다면, 상환날짜 변경 신청을 할 수 있어야 해.
                채권자 관련 기능 (투자, 채권, 채권자 되고 싶어)

                채권자가 되고 싶으면 채권/채무 변경 신청이 가능해야 해.
                
                지갑 및 결제 기능 (충전, 출금, 이체, 페이)

                사용자가 지갑(페이)에 충전하려면, 내 지갑에서 직접 충전할 수 있어야 해.
                지갑에서 은행 계좌로 돈을 옮기고 싶다면, 내 지갑에서 출금할 수 있어야 해.
                등급 및 신뢰도 시스템 (등급, 신뢰도, 점수, 거래 횟수)

                사용자의 등급은 거래 횟수에 따라 자동으로 부여돼.
                기부 관련 기능 (기부, 후원, 도움 주기)

                기부 진행 방식에 대한 안내를 제공해야 해.
                사이트 개요 (사이트 기능, 이 사이트 뭐야, 무슨 서비스)

                이 사이트는 개인 간 대출을 지원하는 P2P 금융 플랫폼이야.
                사용자는 대출과 상환, 채권 관리, 지갑 충전 및 출금 등의 기능을 활용할 수 있어."
    '''

    Chat = ChatOpenAI(temperature = 0.3, model='gpt-4o-mini')
    messages = [
        ('system', prompt_info),
        ('human', user_input)
    ]

    response = Chat.invoke(messages)
    return jsonify({"response":response.content})
    
@app.route('/filter', methods=['POST'])
def filter():
    table = 'member'  # <-사용할 테이블 이름
    
    user_input = request.json.get('message')
    print(user_input)

    #데이터프레임 불러옴
    dataframe = db.show_data(table)

    os.environ['OPENAI_API_KEY'] = OPENAI_API_KEY
    agent = create_pandas_dataframe_agent(
        ChatOpenAI(temperature=0, model='gpt-4o-mini'),
        dataframe,
        agent_type='tool-calling',
        allow_dangerous_code=True
    )

    response = agent.invoke({user_input})

    return jsonify({"response" : response['output']})


if __name__ == '__main__':
    app.run(port=5000)
