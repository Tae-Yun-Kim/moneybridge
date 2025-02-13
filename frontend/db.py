import mariadb
import pandas as pd
import datetime

# 데이터베이스 연결 정보
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "moneybridge",
    "password": "moneybridge",
    "database": "moneybridge",
    "local_infile": True  # 반드시 추가해야 함
}

def load_csv_with_infile(csv_file, table, data):
    conn = mariadb.connect(**DB_CONFIG)
    cur = conn.cursor()\
    
    # CSV 파일 읽기
    # skiprows=1, 
    df = pd.read_csv(csv_file, encoding='cp949', delimiter='\t')  # 첫 번째 행은 헤더이므로 건너뜀
    column_name = [str(x) for x in df.columns]
    print(df)

    try:
        # 데이터 삽입
        cur.execute(f"""CREATE TABLE {table} (
        {data}
        """)

        for _, row in df.iterrows():
            cur.execute(f"""
                INSERT INTO {table} (
                    {column_name}
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, tuple(row))

        conn.commit()
        cur.close()
        conn.close()
        print("✅ 데이터 삽입 완료!")
    except mariadb.Error as e:
        print(f"❌ 삽입 실패: {e}")

    cur.close()
    conn.close()


def show_data(table):
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SELECT * FROM {table}")
        columns = [x[0] for x in cur.description]
        #print(columns)
        #print(len(columns))

        rows = cur.fetchall()
        #print(str(rows[0]))
        result = []

        datetime_indexes = []
        if len(rows) > 0:
            datetime_indexes = [i for i, value in enumerate(rows[0]) if isinstance(value, (datetime.date, datetime.datetime))]

        if datetime_indexes:
            datetime_columns = [(columns[i], i) for i in datetime_indexes]

        if rows != None:
            for r in rows:
                new_row = []
                for j, v in enumerate(r):
                    if j == 9:
                        val = v.strftime("%Y:%m:%d")
                        #print(val)
                    else:
                        val = v
                
                    new_row.append(val)
                result.append(new_row)
        
        result = pd.DataFrame(result, columns=columns)
        return result

    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")

    finally:
        if conn:
            cur.close()
            conn.close()


def get_all_data_in_tables():
    conn = None
    try:
        conn = mariadb.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 데이터 조회
        cur.execute(f"SHOW Tables")
        rows = cur.fetchall()
        
        table_names = [x[0] for x in rows]
        #print(table_names)

        DB = pd.DataFrame()
        for i in range(len(table_names)):
            df = show_data(table_names[i])
            DB = pd.concat([DB, df])

        # print(DB)
        # DB.to_csv('./temp.csv')
        return DB

    
    except mariadb.Error as e:
        print(f"❌ 데이터 조회 실패: {e}")

    finally:
        if conn:
            cur.close()
            conn.close()


# if __name__ == '__main__':
#     get_all_data_in_tables()
#     # csv = 'C:/Users/EZEN/Downloads/save_c.csv'
#     # load_csv_with_infile(csv, 'stock')
#     show_data('stock')


