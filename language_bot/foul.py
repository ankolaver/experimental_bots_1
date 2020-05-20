from keepalive import keep_alive
import discord
from dotenv import load_dotenv
import nltk
nltk.download('stopwords')
from regexp import regexp_tokenize
import random
import re
from nltk.corpus import stopwords
import os

#configs
load_dotenv()
TOKEN = '' #secret
GUILD = "Mr Gi's Slaves"
client = discord.Client()

#pre-defined for bot response
def botresponse(author):
    responses = ["I will learn to recognize your pictures one day, in the meantime, be warned!",
	"Please do not send rude messages","Stop it!","Language","my fury is igniting",
	"I am at your door!","This is a family-friendly server",
	"Be friendly"," only teenage boys could possibly find it funny","My top is blown!"
	"You need to speak better","Shall see you in my office!","Good Riddance!","Excuse me","I beg your pardon!","I'll swing for you!","it makes me (want to) puke","no hard feelings","watch your mouth","Don't test my patience"]

    numm = random.randint(0,len(responses)-1)
    new_response = responses[numm]
    msg_author = str(author).split("#")[0].lower()
    response = new_response+" "+msg_author
    return response

def removeduplicate(msg):
	item = []
	for k in msg:
		if k not in item:
			item.append(k)

	return str(''.join(item))


def checkmsg(msg):
	swear_words = [
	
	]

	regular_exp = ['^fu\d*k$','^sh\d*t$','^cc\w*b$']

	#compiled expressions
	final_exp = []
	for raw_re in regular_exp:
		final_exp.append(re.compile(raw_re))

	#split individual words up
	stop_words = set(stopwords.words('english'))

	#check words that are in a list of swear words
	check = False

	user_msg = regexp_tokenize(msg, pattern=r"\s|[\.,;']", gaps=True)
	#tknzr = nltk.TweetTokenizer()
	#user_msg = tknzr.tokenize('you, f*k #god shit sh1t sh-t')\
	if ''.join(user_msg) in swear_words:
		check = True

	symbols = ["'","!","@","%","\"","`","~","^","*"," ","-",":",";",".","&"]
	for symbol in symbols:
		if "".join(msg.split(symbol)) in swear_words:
			check = True

	user_msg = [word for word in user_msg if not word in stop_words]

	print(user_msg)

	for word in user_msg:
		if any(exp.match(word)for exp in final_exp) and len(word)<5:
			check = True
			print("yes")
			break
		elif word.lower() in swear_words:
			check = True
			print("found w/o regex")
			break
		elif removeduplicate(word) in swear_words:
			#print(removeduplicate(word))
			print("found duplicates")
			check = True
			break

	return check


#set up
@client.event
async def on_ready():
    for guild in client.guilds:
        if guild.name == GUILD:
            breakpoint

    print(
        f'{client.user} is connected to the following guild:\n'
        f'{guild.name}(id: {guild.id})'
    )

'''
#kick
@client.command(pass_context=True)
async def kick(ctx, user_name: discord.User):
    await bot.kick(user_name)
'''

#on message sent event
@client.event
async def on_message(message):
    print(message.content,message.author.name)
    if message.author == client.user:
        return

    print(message.author.name)
    #Swear word detected
    if checkmsg(str(message.content)) == True and str(message.author.name)!="thepoppycat_bot1":
        response = botresponse(str(message.author.name))
        print("Here's the response: ",response)

        await message.channel.send(response)

    #if str(message.author.name)=="definitionBot":
        #await message.channel.send("@definitionBot Let's join the Interpol and arrest more criminals")


keep_alive()
client.run(TOKEN)
