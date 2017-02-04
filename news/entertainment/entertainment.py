import httplib, urllib, base64, json

category = 'entertainment'

headers = {
	# Request headers 
	'Ocp-Apim-Subscription-Key': '400457d0f353477aa36f882bb8444cb5',
}

params = urllib.urlencode({
	# Request parameters
	'Category': category,
	'count': 100
})

try:
	conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
	conn.request("GET", "/bing/v5.0/news/?%s" % params, None, headers)
	response = conn.getresponse()
	data = response.read()
	newsJSON = json.loads(data)

	# Give unique ID to each headline
	ID = 1

	# Array for articles
	news = []

	# Clear data of unused fields
	for fullArticle in newsJSON["value"]:
		article = {}
		article["id"] = ID
		article["headline"] = fullArticle["name"]
		article["url"] = fullArticle["url"]
		news.append(article)
		ID+=1

	with open(category+'.json','w') as outfile:
		json.dump(news, outfile, sort_keys=True, indent=2)

	conn.close()
except Exception as exception:
	print exception