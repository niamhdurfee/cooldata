from geopy.distance import great_circle
import re
import csv
import os


trips =  open('../trips.min.csv','r').readlines()
trips = [re.split(',',trip[:-2]) for trip in trips]
temp = open('../stations.csv','r').readlines()
temp = [re.split(',',station[:-2]) for station in temp]
header = trips[0]
header.append('dist')
header.append('speed')
stations = {}

for station in temp:
    stations[station[0]] = station[1:]

path = 'trips_withdistance.csv'
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)

notworking = csv.writer(open('notworking.csv','a'))
i = 0
for trip in trips[1:]:
    try:
        startstation = (stations[trip[2]][-2],stations[trip[2]][-1])
        endstation = (stations[trip[3]][-2],stations[trip[3]][-1])
        dist = great_circle(startstation, endstation).miles
        speed = 60*dist / int(trip[0])
        dist = '{0:.2f}'.format(dist)
        speed = '{0:.2f}'.format(speed)
        trip.append(dist)
        trip.append(speed)
        datafile.writerow(trip)
    except:
        i += 1
        notworking.writerow(trip)
print i