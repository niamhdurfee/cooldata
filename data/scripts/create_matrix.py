import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
header = re.split(',',trips[0][:-2])

path = "../matrix.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
# datafile.writerow(header)


Matrix = [[0 for x in range(146)] for x in range(146)] 

for trip in trips[1:]:
	trip = re.split(",",trip[:-2])
	Matrix[int(trip[2])][int(trip[3])] += 1;

datafile.writerows(Matrix)

