import csv
import re
import os
trips =  open('hubway_trips.min.csv','r').readlines()
header = re.split(",",trips[0])
header[-1] = re.sub('\r\n','',header[-1])
header.remove('bike_nr')

print len(trips)

path = "mayors_trips.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
for trip in trips[1:]:
	trip = re.sub("\r\n",'',trip)
	trip = re.split(",",trip)
	if trip[-5] == 'B00001':
		trip.remove('B00001')
		datafile.writerow(trip)
