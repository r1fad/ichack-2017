#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Feb  4 17:17:18 2017

@author: Mina.
"""

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64
import json

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': '53e1a89eca0e4b7592159b8932beb24d',
}

params = urllib.parse.urlencode({
    # Request parameters
    'Category': 'ScienceAndTechnology',
    'Count': 100
})

try:
    conn = http.client.HTTPSConnection('api.cognitive.microsoft.com')
    conn.request("GET", "/bing/v5.0/news/?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    
    
    sciAndTechJSON = json.loads(data)
    #print(sciAndTechJSON["value"])

    clean_news = []

    i = 1
    for news_article in sciAndTechJSON["value"]:
        info_news = {}
        info_news["id"] = i    
        info_news["headLine"] = news_article["name"]
        info_news["url"] = news_article["url"]
        i = i + 1
        clean_news.append(info_news)

    with open('technology.json','w') as outfile:
        json.dump(clean_news,outfile,sort_keys =True,indent=2)




    conn.close()
except Exception as e:
    print(e)
  #  print("[Errno {0}] {1}".format(e.errno, e.strerror))