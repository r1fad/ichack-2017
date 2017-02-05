# ICHack '17

Nowadays, the headlines are filled with negativity. There is not a hint of hope in them. We decided to bring a change to headlines you encounter on a daily basis.

#What we built
We built an Alexa skill called 'Content' that provides positive headlines to you. It will also text you the link of the article if you are interested in further reading.

#How it works
We used the Bing Search API for Microsoft Azure Cognitive Services to obtain news headlines in 6 different categories (World News, Politics, Entertainment, Business, Sports and Technology). We then fed each headline into the Google Text Analytics API which assigned a sentiment score from -1 to 1 with -1 being highly negative and 1 being highly positive. 
When the user ask Alexa if there are any positive headlines in a particular category, a randomly selected rating with a sentiment score of 0.7 or higher will be read out by Alexa and if the user is interested in reading the news article, the user will receive a text from Alexa with the news article's link.

#Challenges
The biggest challenge we faced was Google Text Analytics API assigning a positive rating to news headlines a human would consider highly negative. That is why the threshold of 0.7 was selected in order to ensure that highly positive headlines will be read out. 

