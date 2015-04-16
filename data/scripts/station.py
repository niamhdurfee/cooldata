import re,os,csv

lines = [re.sub('\r\n','',line) for line in open('../stations.csv')]
lines = [re.split(',',line) for line in lines[1:]]
num=[]
for station in lines:
	num.append(int(station[0]))
num.sort()

routes = dict()
for n in num:
	routes[n] = dict()

for n in num:
	for a in num:
		if (a < n):
			routes[a][n] = dict() 
		if (a >n):
			routes[n][a] = dict()
i = 0
datafile = csv.writer(open('../possibletrips.csv','a'))
datafile.writerow(['ID','orig','dest'])
for route in routes:
	for end in routes[route]:
		i +=1
		datafile.writerow([i,route,end])



		