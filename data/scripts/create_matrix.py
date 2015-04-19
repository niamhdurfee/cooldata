import csv
import re
import os
trips =  [re.split(',',line[:-2]) for line in open('../trips.min.csv','r')]
header = trips.pop(0)
path = "../matrix.js" 
datafile = open(path,'a')
datafile.write("_matrixData = ")

Matrix = [[0 for x in range(146)] for x in range(146)] 

for trip in trips:
	Matrix[int(trip[3])][int(trip[4])] += 1;
datafile.write(str(Matrix))
datafile.close()