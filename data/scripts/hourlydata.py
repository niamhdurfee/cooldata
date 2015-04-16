import re,os,csv

trips = [re.sub('\r\n','',line) for line in open('../trips.min.csv')]
trips = [re.split(',',line) for line in trips[1:20]]

stations = [re.split(',',station[:-2])[0] for station in open('../stations.csv').readlines()[1:]]
temp = dict()
for station in stations:
	temp[str(station)] = { 'average':[0.0,0.0], 'hourly': []}
	temp[str(station)]['hourly'] = [[0.0,0.0] for x in range(24)]
print temp

for trip in trips:
	# arriving
	arr = trip[4]
	
	
	# departing
	dep = trip[3]