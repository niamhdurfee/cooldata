import csv, re, os, simplejson, urllib,time

temp = open('../stations.csv').readlines()
temp = [re.split(',',station[:-2]) for station in temp[1:]]
stations = dict()
for station in temp:
	stations[station[0]] = station[1:]
possibletrips = set()
for s1 in stations:
	for s2 in stations:
		a = int(s1)
		b = int(s2)
		if a != b:
			stri = str(min(a,b))+','+ str(max(a,b))
			possibletrips.add(stri)
possibletrips = list(possibletrips)
possibletrips = [re.split(',',trip) for trip in possibletrips]
# path = "possibletrips.csv"
# os.remove(path)
# datafile = csv.writer(open(path,'a'))
# header = ['to','from','ID']
# datafile.writerow(header)
# i = 0
# for trip in possibletrips:
# 	i +=1
# 	trip.append(i)
# 	datafile.writerow(trip)


i = 7470
data = []
nw = []
for trip in possibletrips[7471:]:
	i += 1
	orig = stations[trip[0]]
	dest = stations[trip[1]]
	orig_coord = float(orig[-2]), float(orig[-1])
	dest_coord = float(dest[-2]), float(dest[-1])
	url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins={0}&destinations={1}&mode=bicycling".format(str(orig_coord),str(dest_coord))
	result= simplejson.load(urllib.urlopen(url))
	if result['status'] == 'OVER_QUERY_LIMIT':
		print "INDEX OF BUST "+str(i)
		break
	res = result['rows'][0]['elements'][0]
	if res['status'] != 'OK':
		trip.append(i)
		trip.append(res['status'])
		nw.append(trip)
	else:
		row = [i, trip[0], trip[1],res['duration']['value'], res['distance']['value']]
		data.append(row)
	print i, res['status']
	time.sleep(.2)

path = "trips_stats.csv" 
os.remove("trips_stats.csv")
os.remove('notworking.csv')
datafile = csv.writer(open("trips_stats.csv",'a'))
nwfile = csv.writer(open('notworking.csv','a'))

header = ['ID','orig','dest','duration','distance']
nwfile.writerows(nw)
datafile.writerow(header)
datafile.writerows(data)