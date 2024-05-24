import sqlite3
import random

first_names = [
    "John", "Jane", "Sam", "Alex", "Sarah", "Diana", "Mike", "Laura", "James", "Linda",
    "Robert", "Patricia", "Charles", "Barbara", "Michael", "Elizabeth", "David", "Jennifer",
    "Joseph", "Maria", "Thomas", "Susan", "Chris", "Margaret", "Daniel", "Lisa", "Matthew",
    "Betty", "Anthony", "Dorothy", "Mark", "Sandra", "Paul", "Ashley", "Steven", "Kimberly",
    "Andrew", "Donna", "Kenneth", "Emily", "George", "Carol", "Joshua", "Michelle", "Kevin",
    "Amanda", "Brian", "Melissa", "Edward", "Deborah", "Ronald", "Stephanie", "Timothy",
    "Rebecca", "Jason", "Laura", "Jeffrey", "Helen", "Ryan", "Sharon", "Jacob", "Cynthia",
    "Frank", "Kathleen", "Gary", "Amy", "Jerry", "Shirley", "Tyler", "Angela", "Aaron",
    "Mary", "Henry", "Patricia", "Douglas", "Linda", "Zachary", "Barbara", "Lee", "Elizabeth",
    "Kyle", "Jennifer", "Franklin", "Maria", "Nathan", "Susan", "Samuel", "Margaret", "Richard",
    "Dorothy", "Will", "Lisa", "Benjamin", "Betty", "Gregory", "Nancy", "Alexander", "Sandra",
    "Raymond", "Ashley", "Patrick", "Kimberly", "Jack", "Donna", "Oliver", "Emily"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
    "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White",
    "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall",
    "Young", "Allen", "Sanchez", "Wright", "King", "Scott", "Green", "Baker", "Adams", "Nelson",
    "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres",
    "Parker", "Collins", "Edwards", "Stewart", "Flores", "Morris", "Nguyen", "Murphy", "Rivera", "Cook",
    "Rogers", "Morgan", "Peterson", "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard",
    "Ward", "Cox", "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James",
    "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders", "Ross", "Morales",
    "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez", "Perry", "Butler", "Barnes", "Fisher"
]

def generate_random_name():
    first = random.choice(first_names)
    last = random.choice(last_names)
    return f"{first} {last}"


def get_table_desc(table_name):
    cursor.execute(f"PRAGMA table_info('{table_name}')")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

def create_table(table_name):
    sql = f'''
    CREATE TABLE {table_name} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULY 'John Doe',
        email TEXT DEFAULY 'johndoe@uci.edu',
        chat_id TEXT DEFAULY '1234567890',
        mac_address TEXT DEFAULY '00:00:00:00:00:00'
    )
    '''

    cursor.execute(sql)

def rename_column(table_name, old_column_name, new_column_name):
    cursor.execute(f"ALTER TABLE {table_name} RENAME COLUMN {old_column_name} TO {new_column_name}")

def insert_users(table_name, n):
    for _ in range(n):
        username = generate_random_name()
        email = username.replace(" ", "").lower() + "@gmail.com"
        chat_id = random.randint(1000000000, 9999999999)
        mac_address = ':'.join(['%02x' % random.randint(0, 255) for _ in range(6)])

        sql = f'''
        INSERT INTO {table_name} (name, email, chat_id, mac_address)
        VALUES ('{username}', '{email}', '{chat_id}', '{mac_address}')
        '''

        cursor.execute(sql)

def get_users(table_name):
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

if __name__ == '__main__':
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect('/Users/jaycrappe/Documents/GitHub/Keystone/MainServer/db/main.db')

    # Create a cursor object using the cursor() method
    cursor = conn.cursor()
    # create_table('users_random')
    # create_table('users_primary')
    # get_table_desc('users_random')

    # insert_users('users_random', 150)
    # get_users('users_random')
    # rename_column('users_random', 'mac_Address', 'mac_address')
    get_table_desc('users_random')

    conn.commit()
    conn.close()