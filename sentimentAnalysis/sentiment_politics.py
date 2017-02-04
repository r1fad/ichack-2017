# Import all modules necessary
from google.cloud import language
import json
import unicodedata

# Instantiates a client
language_client = language.Client()

#open JSONs
with open('../news/politics/politics.json','r') as infile:
  newsJSON = json.load(infile)

# The text to analyze
for news_article in newsJSON:

  text = news_article["headline"]
  text = unicodedata.normalize('NFKD', text).encode('ascii','ignore')
  document = language_client.document_from_text(text)

  # Detects the sentiment of the text
  sentiment = document.analyze_sentiment()

  news_article["sentiment_score"] = sentiment.score
  news_article["sentiment_magnitude"] = sentiment.magnitude

  #print('Text: {}'.format(text))
  #print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))

  print news_article

with open('../news/world/world.json','w') as outfile:
  json.dump(newsJSON,outfile,sort_keys=True,indent=2)

