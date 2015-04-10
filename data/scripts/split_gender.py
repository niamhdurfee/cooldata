import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()

trips = [re.split(",",trip[:-2]) for trip in trips]
header = ['duration', 'start_date', 'strt_statn', 'end_statn', 'zip_code', 'age','ID']

pathMale = 'trips_male.csv'
pathFemale = "trips_female.csv"
os.remove(pathMale)
os.remove(pathFemale)

male =  csv.writer(open(pathMale,'a'))
female =  csv.writer(open(pathFemale,'a'))

male.writerow(header)
female.writerow(header)
for trip in trips[1:]:
	if trip[4] =='R':
		trip.remove('R')
		g = trip.pop(-2)
		if g == 'M':
			male.writerow(trip)
		else:
			female.writerow(trip)
