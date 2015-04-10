import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
header = ['duration','start_date','ID','dist','speed']

path = "trips_startdate_duration.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
for trip in trips[1:]:
	trip = re.split(",",trip[:-2])
	row = trip[0:2] + trip[-3:]
	datafile.writerow(row)