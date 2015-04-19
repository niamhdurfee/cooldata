import csv
import re
import os
trips =  [re.split(',',line[:-2]) for line in open('../trips.min.csv','r')]
header = trips.pop(0)
stations = [re.split(',',line[:-2]) for line in open('../stations.csv')]
stations = {int(station[0]):station[1:] for station in stations[1:]}
hood = ['Allston', 'Kendall', 'Fenway/Kenmore', 'Cambridge', 'Fenway', 'South Boston', 'South End', 'Central Square', 'Seaport', 'Downtown', 'Charlestown', 'Brookline', 'East Cambridge', 'West End', 'Dudley Square', 'North Cambridge', 'Back Bay', 'Harvard Square', 'Somerville', 'Porter Square', 'Medford']
path = "../matrix.js" 
os.remove(path)
datafile = open(path,'a')
datafile.write("_matrixData = ")

Matrix = [[0 for x in range(len(hood))] for x in range(len(hood))] 

for trip in trips:
	orig = stations[int(trip[3])][-1]
	dest = stations[int(trip[4])][-1]
	Matrix[hood.index(orig)][hood.index(dest)] += 1;
datafile.write(str(Matrix))
datafile.close()