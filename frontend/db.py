#pip install mariadb
import mariadb #마리아DB 컨트롤
import pandas as pd #행과 열로 된 데이터 정렬
import datetime #날짜 저장된 데이터를 컨트롤

#데이터 연결 정보
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "moneybridge",
    "password": "moneybridge",
    "database": "moneybridge",
    "local_infile": True
}

def DBSETTING(database):
    return  {
            "host": "localhost",
            "port": 3306,
            "user": "moneybridge",
            "password": "moneybridge",
            "database": "moneybridge",
            "local_infile": True
            }

#테이블 이름을 전달하면 -> 테이블에 있는 모든 데이터 보여주기
def show_data(table):
    conn = None

    #테이블에 접근해서 데이터를 보여주는
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor() #실질적으로 sql 명령어를 입력

        #내가 지정한 테이블의 데이터를 조회한 후,
        #데이터를 가져와서 데이터프레임으로 만드는 역할
        cur.execute(f"SELECT * FROM {table}")
        rows = cur.fetchall()

        #열이름
        columns = [x[0] for x in cur.description]

        #데이터
        result = []
        #데이터중에 datatime 형식으로 불러와지는 값이 있다면, datetime이 있는 순서가 몇번쨰인지 기억하기
        datetime_index = [i for i, value in enumerate(rows[0]) if isinstance(value, (datetime.date, datetime.datetime))]

        if rows != None:
            for r in rows:
                new_row = []

                for j, v in enumerate(r):
                    if j  in datetime_index:
                        #2025-02-06
                        val = v.strftime("%Y-%M-%d")
                    else:
                        val = v

                    new_row.append(val)
                result.append(new_row)

        result = pd.DataFrame(result, columns=columns)

        return result


    #에러가 발생하면 알려주는
    except mariadb.Error as e:
        print(f"데이터 로드 실패")

    #DB와의 연결을 끊기(conn을 없애주는 역할)
    finally:
        if conn:
            cur.close()
            conn.close()

# if __name__ == '__main__':
#     show_data('')