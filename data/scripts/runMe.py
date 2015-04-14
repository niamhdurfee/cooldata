import csv, re, os, simplejson, urllib,time

temp = open('../stations.csv').readlines()
temp = [re.sub('\r\n','',station) for station in temp[1:]]
temp = [re.sub('\n','',station) for station in temp]
temp = [re.split(',',station) for station in temp]
stations = dict()
for station in temp:
	stations[station[0]] = station[1:]
trips = [re.split(',', trip[:-2]) for trip in open('possibletrips.csv')]
trips = trips[1:]

# # Lexi uncomment these
# trips = trips[7379:] 
# i = 7379

# # Dayne these ones! 
# trips = trips[4879:]
# i = 4879

workingTrips = []
notworking = []

for trip in trips:
	orig = stations[trip[0]]
	dest = stations[trip[1]]
	orig_coord = float(orig[-3]), float(orig[-2])
	dest_coord = float(dest[-3]), float(dest[-2])
	url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins={0}&destinations={1}&mode=bicycling".format(str(orig_coord),str(dest_coord))
	result= simplejson.load(urllib.urlopen(url))
	if result['status'] == 'OVER_QUERY_LIMIT':
		print "INDEX OF BUST "+str(i)
		break
	res = result['rows'][0]['elements'][0]
	if res['status'] != 'OK':
		trip.append(i)
		trip.append(res['status'])
		notworking.append(trip)
	else:
		row = [i, trip[0], trip[1],res['duration']['value'], res['distance']['value']]
		workingTrips.append(row)
	print i, res['status']
	time.sleep(.1)
	i += 1

# # Lexi's
# pathNotWorking = "notworkingLexi.csv"
# pathFile = "trip_stats_7379.csv"

# # Dayne's
# pathFile = "trip_stats_4879.csv"
# pathNotWorking = "notworkingDayne.csv"

datafile = csv.writer(open(pathFile,'a'))
nwfile = csv.writer(open(pathNotWorking,'a'))

header = ['ID','orig','dest','duration','distance']
nwfile.writerows(notworking)
datafile.writerow(header)
datafile.writerows(workingTrips)