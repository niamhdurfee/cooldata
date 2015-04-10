import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
trips = [re.split(",",trip[:-2]) for trip in trips]

headCasual=['duration', 'start_date', 'strt_statn', 'end_statn', 'ID','dist','speed']
headRegistered = ['duration', 'start_date', 'strt_statn', 'end_statn', 'zip_code', 'age', 'gender', 'ID','dist','speed']

pathCasual = 'trips_casual.csv'
pathReg = "trips_registered.csv"


casual =  csv.writer(open(pathCasual,'a'))
reg =  csv.writer(open(pathReg,'a'))

casual.writerow(headCasual)
reg.writerow(headRegistered)
for trip in trips[1:]:
	if trip[4] =='R':
		trip.remove('R')
		reg.writerow(trip)
	else:
		row = trip[:4] + trip[-3:]
		casual.writerow(row)