import re,os,csv

days = [re.split(',',line[:-1])[:9] for line in open("../weather.csv")]
os.remove("weather.csv")
datafile = csv.writer(open('weather.csv','a'))
datafile.writerow(days[0])

for day in days[1:]:
	del day[0]
	del day[0]
	day[0] = str(int(day[0][4:6]))+'/'+str(int(day[0][-2:]))+'/'+day[0][:4]
	if (day[1] != '-9999'):
		day[1] = float(day[1]) / 10.0
	else:
		day[1] = 0.0
	if (day[2] == '-9999'):
		day[2] = 0
	else:
		day[2] = int(day[2])
	if (day[3] == '-9999'):
		day[3] = 0
	else:
		day[3] = int(day[3])	
	day[4] = float(day[4]) / 10.0
	day[5] = float(day[5]) / 10.0
	day[6] = int(day[6])
	datafile.writerow(day)