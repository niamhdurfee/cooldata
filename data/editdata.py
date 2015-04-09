import csv
import re
import os
trips =  open('hubway_trips.csv','r').readlines()
header = re.split(",",trips[0])
header.remove('status')
header.remove('seq_id')
header.remove('hubway_id')
header[-1] = re.sub('\r\n','',header[-1])
header[-2] = 'age'
print len(trips)

path = "hubway_trips.min.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
for trip in trips[1:]:
	trip = re.sub("\r\n",'',trip)
	trip = re.sub("Female",'F',trip)
	trip = re.sub("Male",'M',trip)
	trip = re.sub("Casual",'C', trip)
	trip = re.sub("Registered",'R',trip)
	trip = re.split(",",trip)
	trip.remove('Closed')
	trip[3] = trip[3][:-3]
	trip[5] = trip[5][:-3]
	if trip[-4] == 'R':
		if trip[-2] != '':
			trip[-2] = str(2011 - int(trip[-2]))
		else:
			trip[-2] = None
	datafile.writerow(trip[2:])


