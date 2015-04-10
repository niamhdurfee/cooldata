import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
header = ['start_date','duration','ID']

path = "trips_startdate_duration.csv" 
# os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
for trip in trips[1:]:
	trip = re.split(",",trip[:-2])
	trip = [trip[0],trip[1],trip[-1]]
	datafile.writerow(trip)