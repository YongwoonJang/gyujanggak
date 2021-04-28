import sqlite3

con = sqlite3.connect("queue.sqlite")
cur = con.cursor() 

print("=============================")
print("==== sqlite_master table ====")
for row in cur.execute("select name from sqlite_master where type = 'table'"):
    print(row)

for row in cur.execute("select * from metadata"):
    print(row)
for row in cur.execute("select * from queue"):
    print(row)
for row in cur.execute("select * from states"):
    print(row)
for row in cur.execute("select * from domain_metadata"):
    print(row)

con2 = sqlite3.connect("strategy.sqlite")
cur2 = con2.cursor()

print("========================")
print("==== strategy table ====")
for row in cur2.execute("select name from sqlite_master where type = 'table'"):
    print(row)
for row in cur.execute("select * from states"):
    print(row)
for row in cur.execute("select * from domain_metadata"):
    print(row)
