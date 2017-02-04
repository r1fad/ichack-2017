########### Python 2.7 #############
import httplib, urllib, base64
import json

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': '2455a3143bf64602afd7e5b6fd697ed5',
}

params = urllib.urlencode({
    # Request parameters
    'Category': 'World',
    'count':101
})

try:
    conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
    conn.request("GET", "/bing/v5.0/news/?%s" % params, "{body}", headers)
    response = conn.getresponse()
    data = response.read()
    worldNewsJSON = json.loads(data)

    clean_world_news=[]
    count = 1
    for news_article in worldNewsJSON["value"]:
        info_news = {}
        info_news["id"] = count
        info_news["headline"]=news_article["name"]
        info_news["url"]=news_article["url"]
        clean_world_news.append(info_news)
        count+=1

    with open('world.json','w') as outfile:
        json.dump(clean_world_news,outfile,sort_keys=True,indent=2)



    conn.close()
except Exception as e:
    #print ("[Errno {0}] {1}".format(e.errno, e.strerror)))
    print e