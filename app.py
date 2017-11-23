#-*- coding: utf-8 -*-
import sqlite3
import json
from collections import OrderedDict
import secrets
import os
import shutil

sessions = []

conn = sqlite3.connect("data/database.db", check_same_thread=False)
cur = conn.cursor()

query=("SELECT COUNT(*) FROM sqlite_master WHERE name='card'")
cur.execute(query)
rows = cur.fetchall()
if (rows[0][0] == 0) :
	query=(
		"CREATE TABLE card ("
		"id       INTEGER PRIMARY KEY AUTOINCREMENT,"
		"author   TEXT,"
		"title    TEXT,"
		"text     TEXT,"
		"image    TEXT,"
		"pages    INTEGER"
		")"
	)
	cur.execute(query)

query=("SELECT COUNT(*) FROM sqlite_master WHERE name='user'")
cur.execute(query)
rows = cur.fetchall()
if (rows[0][0] == 0) :
	query=(
		"CREATE TABLE user ("
		"name     TEXT,"
		"id       TEXT,"
		"password TEXT"
		")"
	)
	cur.execute(query)

def app(environ, start_response):
	start_response('200 OK', [('Content-type', 'text/plain'), ('charset', 'utf-8'), ('Access-Control-Allow-Origin', 'http://localhost'), ('Access-Control-Allow-Credentials', 'true'), ('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, CARD_ID, CARD_PAGE')])
	print(environ)
	print()
	if (environ['PATH_INFO'] == '/store.py') :
		return grapesjs_store(environ)
	elif (environ['PATH_INFO'] == '/load.py' and environ['REQUEST_METHOD'] == 'GET') :
		return grapesjs_load(environ)
	elif (environ['PATH_INFO'] == '/load-cards.py' and environ['REQUEST_METHOD'] == 'GET') :
		return send_card_list(environ)
	elif (environ['PATH_INFO'] == '/new-card.py' and environ['REQUEST_METHOD'] == 'POST') :
		return create_new_card(environ)
	elif (environ['PATH_INFO'] == '/delete-card.py' and environ['REQUEST_METHOD'] == 'POST') :
		return delete_card(environ)
	elif (environ['PATH_INFO'] == '/register.py' and environ['REQUEST_METHOD'] == 'POST') :
		return register(environ)
	elif (environ['PATH_INFO'] == '/login.py' and environ['REQUEST_METHOD'] == 'POST') :
		return login(environ)
	elif (environ['PATH_INFO'] == '/edit-card.py' and environ['REQUEST_METHOD'] == 'POST') :
		return edit_card(environ)
	elif (environ['PATH_INFO'] == '/session-check.py' and environ['REQUEST_METHOD'] == 'GET') :
		return session_check(environ)
	elif (environ['PATH_INFO'] == '/page_add.py' and environ['REQUEST_METHOD'] == 'POST') :
		return page_add(environ)
	elif (environ['PATH_INFO'] == '/page_delete.py' and environ['REQUEST_METHOD'] == 'POST') :
		return page_delete(environ)
	elif (environ['PATH_INFO'] == '/grapesjs-dev/page_file_save.py' and environ['REQUEST_METHOD'] == 'POST') :
		return page_file_save(environ)
	elif (environ['PATH_INFO'] == '/asset.py' and environ['REQUEST_METHOD'] == 'POST') :
		return 0
	return [''.encode('utf-8')]


def page_add(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=("SELECT * FROM card WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		if (rows[0][1] != session['name']):
			json_data['error']=2
			data =json.dumps(json_data, ensure_ascii=False, indent="\t")
			return [data.encode('utf-8')]
	else:
		json_data['error']=1
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	if (content['page'] <= rows[0][5]):
		for x in range(rows[0][5], content['page'] - 1, -1):
			os.rename("html/cards/{0}/{1}.html".format(rows[0][0], x), "html/cards/{0}/{1}.html".format(rows[0][0], x + 1))

	f = open("html/cards/{0}/{1}.html".format(rows[0][0], content['page']), 'w+')
	f.close()

	query=(
		"UPDATE card SET pages='{0}'".format(
			rows[0][5] + 1
			)
		)
	cur.execute(query)
	conn.commit()
	
	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]

def page_delete(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=("SELECT * FROM card WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		if (rows[0][1] != session['name']):
			json_data['error']=2
			data =json.dumps(json_data, ensure_ascii=False, indent="\t")
			return [data.encode('utf-8')]
	else:
		json_data['error']=1
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	if (content['page'] < rows[0][5]):
		os.remove("html/cards/{0}/{1}.html".format(rows[0][0], content['page']))
		if os.path.isfile("data/cards/{0}/{1}.json".format(rows[0][0], content['page'])):
			os.remove("data/cards/{0}/{1}.json".format(rows[0][0], content['page']))
		for x in range(content['page'] + 1, rows[0][5] + 1):
			os.rename("html/cards/{0}/{1}.html".format(rows[0][0], x), "html/cards/{0}/{1}.html".format(rows[0][0], x - 1))
			if os.path.isfile("data/cards/{0}/{1}.json".format(rows[0][0], x)):
				os.rename("data/cards/{0}/{1}.json".format(rows[0][0], x), "data/cards/{0}/{1}.json".format(rows[0][0], x - 1))

	query=(
		"UPDATE card SET pages='{0}'".format(
			rows[0][5] - 1
			)
		)
	cur.execute(query)
	conn.commit()
	
	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]

def page_file_save(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	f=open('html/cards/{0}/{1}.html'.format(content['id'], content['page']), 'w')
	f.write('<link rel="stylesheet" href="{0}.css">'.format(content['page']))
	f.write(content['html'])
	f.close()

	f=open('html/cards/{0}/{1}.css'.format(content['id'], content['page']), 'w')
	f.write(content['css'])
	f.close()
	
	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]

def grapesjs_store(environ):
	if ('HTTP_CONTENT_LENGTH' in environ and environ['HTTP_CONTENT_LENGTH']) :
			data = environ['wsgi.input'].read(int(environ['HTTP_CONTENT_LENGTH']))
			f=open('data/cards/{0}/{1}.json'.format(get_item_query('id',environ['QUERY_STRING']), get_item_query('page',environ['QUERY_STRING'])), 'wb')
			f.write(data)
			f.close()
	return [''.encode('utf-8')]

def grapesjs_load(environ):
	path = 'data/cards/{0}/{1}.json'.format(get_item_query('id',environ['QUERY_STRING']), get_item_query('page',environ['QUERY_STRING']))
	if os.path.isfile(path):#isdir
		f=open(path, 'r')
	else:
		f=open('data/empty.json', 'r')
	data = f.read()
	f.close()
	return [data.encode('utf-8')]

def session_check(environ):
	json_data=OrderedDict()

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=1
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=2
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")
	return [data.encode('utf-8')]


def send_card_list(environ):
	json_data=OrderedDict()
	cards=list()

	query="SELECT * FROM card"
	cur.execute(query)
	rows = cur.fetchall()
	for row in rows:
		card=OrderedDict()
		card['id']=row[0]
		card['author']=row[1]
		card['title']=row[2]
		card['text']=row[3]
		card['image']=row[4]
		card['pages']=row[5]
		cards.append(card)

	json_data['cards']=cards
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]


def create_new_card(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=(
		"INSERT INTO card (author, title, text, image, pages) VALUES"
		"('{0}', '{1}', '{2}', '{3}', '{4}')".format(
			session['name'],
			content['title'],
			content['text'],
			content['image'],
			0
			)
		)
	cur.execute(query)
	conn.commit()
	
	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	query=("SELECT last_insert_rowid()")
	cur.execute(query)
	rows = cur.fetchall()
	os.mkdir("data/cards/{0}".format(rows[0][0]))
	os.mkdir("html/cards/{0}".format(rows[0][0]))

	return [data.encode('utf-8')]

def edit_card(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=("SELECT * FROM card WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		if (rows[0][1] != session['name']):
			json_data['error']=2
			data =json.dumps(json_data, ensure_ascii=False, indent="\t")
			return [data.encode('utf-8')]
	else:
		json_data['error']=1
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]


	query=(
		"UPDATE card SET title='{0}', text='{1}', image='{2}' WHERE id='{3}'".format(
			content['title'],
			content['text'],
			content['image'],
			content['id']
			)
		)
	cur.execute(query)
	conn.commit()
	
	json_data['error']=0
	data=json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]


def delete_card(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	session_id = get_session_id_by_cookie(environ)
	if (session_id == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	session = search_session('session_id', session_id)
	if (session == None):
		json_data['error']=10
		data=json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=("SELECT * FROM card WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		if (rows[0][1] != session['name']):
			json_data['error']=2
			data =json.dumps(json_data, ensure_ascii=False, indent="\t")
			return [data.encode('utf-8')]
	else:
		json_data['error']=1
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]


	query=("DELETE FROM card WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	conn.commit()

	json_data['error']=0
	data =json.dumps(json_data, ensure_ascii=False, indent="\t")

	shutil.rmtree('data/cards/{0}'.format(content['id']))
	shutil.rmtree('html/cards/{0}'.format(content['id']))

	return [data.encode('utf-8')]

def register(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	query=("SELECT * FROM user WHERE name='{0}'".format(content['name']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		json_data['error']=1
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	query=("SELECT * FROM user WHERE id='{0}'".format(content['id']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		json_data['error']=2
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]
	
	query=(
		"INSERT INTO user (name, id, password) VALUES"
		"('{0}', '{1}', '{2}')".format(
			content['name'],
			content['id'],
			content['password']
			)
		)
	cur.execute(query)
	conn.commit()

	json_data['error']=0
	data =json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]

def login(environ):
	json_data=OrderedDict()
	content = environ["wsgi.input"].read()
	content = json.loads(content)
	print(content)#====TEST

	query=("SELECT * FROM user WHERE id='{0}' AND password='{1}'".format(content['id'], content['password']))
	cur.execute(query)
	rows = cur.fetchall()
	if (0 < len(rows)):
		session = search_session('id', rows[0][1])
		if (session == None):
			session_id = make_session_id()
			session = {'session_id': session_id,'name': rows[0][0], 'id': rows[0][1]}
			sessions.append(session)
		print(sessions)
		json_data['error']=0
		json_data['session_id']=session['session_id']
		json_data['name']=session['name']
		data =json.dumps(json_data, ensure_ascii=False, indent="\t")
		return [data.encode('utf-8')]

	json_data['error']=1
	data =json.dumps(json_data, ensure_ascii=False, indent="\t")

	return [data.encode('utf-8')]



def search_session(item_name, value):
	for x in sessions:
		if (x[item_name] == value):
			return x
	return None

def get_item_query(item, query):
	for x in query.split('&'):
		xx=x.split('=')
		if xx[0].strip() == item:
			return xx[1]
	return None

def get_session_id_by_cookie(environ):
	for x in environ['HTTP_COOKIE'].split(';'):
		xx=x.split('=')
		if xx[0].strip() == 'SESSION_ID':
			return xx[1]
	return None

def make_session_id():
	session_id = secrets.token_hex(nbytes=16)
	while search_session('session_id', session_id):
		session_id = secrets.token_hex(nbytes=16)
	return session_id
