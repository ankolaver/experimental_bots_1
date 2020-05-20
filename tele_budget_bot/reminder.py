import webbrowser
import random
import pyowm


#weather observation
owm = pyowm.OWM('somekey')
observation = owm.weather_at_place("Singapore")
w = observation.get_weather()
#wind = w.get_wind()
temperature = w.get_temperature('celsius')
temperature = str(temperature['temp'])

#daily quote
quotes = open("quote.txt","r")
liquotes = []
for sentence in quotes:
    liquotes.append(sentence)

num = random.randint(0, len(liquotes)-1)
quote_selected = liquotes[num].replace('"','')
quote_selected = quote_selected.replace(' ','+')
quote_selected = quote_selected.replace('.','')

print(quote_selected)

text = "Hi+,+remember+to+document+your+expenses+at+https://forms.gle/a1UBu9YJVqP4iSfTA+\n"

link = "https://api.telegram.org/ link text={0}+                 +{1}+       +Local+temp+{2}".format(text,quote_selected,temperature)
print(link)

#main
webbrowser.open(link)
