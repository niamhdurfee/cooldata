import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
trips = [re.split(",",trip[:-2]) for trip in trips]

headCasual=['duration', 'start_date', 'strt_statn', 'end_statn', 'ID']
headRegistered = ['duration', 'start_date', 'strt_statn', 'end_statn', 'zip_code', 'age', 'gender', 'ID']
pathCasual = '../trips_casual.csv'
pathReg = "../trips_registered.csv"
os.remove(pathCasual)
os.remove(pathReg)

casual =  csv.writer(open(pathCasual,'a'))
reg =  csv.writer(open(pathReg,'a'))

casual.writerow(headCasual)
reg.writerow(headRegistered)
for trip in trips[1:]:
	if trip[4] =='R':
		trip.remove('R')
		reg.writerow(trip)
	else:
		row = trip[:4] + [trip[-1]]
		casual.writerow(row)