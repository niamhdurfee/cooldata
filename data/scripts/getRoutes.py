import csv, re, os, simplejson, urllib,time

temp = open('../stations.csv').readlines()
temp = [re.split(',',station[:-2]) for station in temp[1:]]
stations = dict()
for station in temp:
	stations[station[0]] = station[1:]
trips = [re.split(',', trip[:-2]) for trip in open('../possibletrips.csv')]
trips = trips[1:]
trips = trips[:1]
i = 1
workingTrips = []
notworking = []
f = open('temp.txt','w')
for trip in trips:
	orig = stations[str(trip[1])]
	dest = stations[str(trip[2])]
	orig_coord = float(orig[-3]), float(orig[-2])
	dest_coord = float(dest[-3]), float(dest[-2])
	url = "http://maps.googleapis.com/maps/api/directions/json?origin={0}&destination={1}&mode=bicycling".format(str(orig_coord),str(dest_coord))
	result= simplejson.load(urllib.urlopen(url))
	f.write(str(result))
#	if result['status'] == 'OVER_QUERY_LIMIT':
#		print "INDEX OF BUST "+str(i)
#		break
#	res = result['rows'][0]['elements'][0]
#	if res['status'] != 'OK':
#		trip.append(i)
#		trip.append(res['status'])
#		notworking.append(trip)
#	else:
#		row = [i, trip[0], trip[1],res['duration']['value'], res['distance']['value']]
#		workingTrips.append(row)
#	print i, res['status']
#	time.sleep(.1)
#	i += 1
#
#datafile = csv.writer(open("trips_statsAllison.csv",'a'))
#nwfile = csv.writer(open('notworkingAllison.csv','a'))
#
#header = ['ID','orig','dest','duration','distance']
#nwfile.writerows(notworking)
#datafile.writerow(header)
#datafile.writerows(workingTrips)

