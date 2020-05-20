import pyowm

owm = pyowm.OWM('29039888ecce7edd94fe4a51361c0faa')
observation = owm.weather_at_place("Singapore")
w = observation.get_weather()
wind = w.get_wind()
temperature = w.get_temperature('celsius')

#main
print(w)
print(wind)
print(temperature)
