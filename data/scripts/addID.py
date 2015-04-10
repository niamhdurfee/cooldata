import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
header = re.split(',',trips[0][:-2])
header.remove('bike_nr')

path = "trips.min.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)

for trip in trips[1:]:
	trip = re.split(",",trip[:-2])
	del trip[4]
	datafile.writerow(trip)
