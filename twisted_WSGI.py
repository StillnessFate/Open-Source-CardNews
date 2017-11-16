#-*- coding: utf-8 -*-

from twisted.web.wsgi import WSGIResource
from twisted.internet import reactor
from twisted.web import server
from app import app as application

resource = WSGIResource(reactor, reactor.getThreadPool(), application)
site = server.Site(resource)
reactor.listenTCP(8080, site)
reactor.run()