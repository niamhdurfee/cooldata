import csv
import re
import os
trips =  open('hubway_trips.csv','r').readlines()
header = re.split(",",trips[0])
header.remove('status')
header[-1] = re.sub('\r\n','',header[-1])

trips = [re.sub("\r\n",'',trip) for trip in trips[1:]]
trips = [re.sub("Female",'f',trip) for trip in trips]
trips = [re.sub("Male",'m',trip) for trip in trips]
trips = [re.sub("Casual",'c',trip) for trip in trips]
trips = [re.sub("Registered",'r',trip) for trip in trips]

trips = [re.split(",",trip) for trip in trips]
[trip.remove('Closed') for trip in trips]

for trip in trips:
	try:
		trip[7] = int(trip[7][1:])
	except:
		trip[7] = None
path = "hubway_trips_compressed.csv" 
#os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
datafile.writerows(trips)
