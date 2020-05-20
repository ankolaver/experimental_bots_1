import re
import nltk
from nltk.corpus import stopwords

swear_words = [
        'shit','die','fuck','crap','loli','fk','piss',"pussy",'damn'
        'stfu',"af","knn","ccb","knnccb"
    ]

regular_exp = ['^f\w*k$','^s\w*t$','^cc\w*b$','^p\w*ss$']

#compiled expressions
final_exp = []
for raw_re in regular_exp:
    final_exp.append(re.compile(raw_re))

#split individual words up
#mytokenizer = nltk.MWETokenizer(separator='')
#mytokenizer.add_mwe(('*','#','-'))

#user_msg = nltk.word_tokenize('you f*k shit sh1t sh-t')
stop_words = set(stopwords.words('english'))

user_msg = nltk.regexp_tokenize(msg, pattern=r"\s|[\.,;']", gaps=True)
#tknzr = nltk.TweetTokenizer()
#user_msg = tknzr.tokenize('you, f*k #god shit sh1t sh-t')

user_msg = [word for word in user_msg if not word in stop_words]

print(user_msg)
#check words that are in a list of swear words
check = False
for word in user_msg:
    if any(exp.match(word)for exp in final_exp):
        check = True
        print("yes")
        break
    elif word.lower() in swear_words:
        check = True
        print("found w/o regex")
        break
