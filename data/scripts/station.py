import re,os,csv

lines = [re.sub("\r\n","",line) for line in open("../stations.csv")]
lines = [re.split(",",line) for line in lines[1:]]
path ="stations.json"
os.remove(path)
f = open(path,"a")
f.write('{')
for station in stations:
	f.write('"'+station[0]+'": \n{')
	f.write('"fullname":"'+route[1]+'",\n')
	f.write('"short":"'+station[2]+'",\n')
	f.write('"lat":'+station[3]+',\n')
	f.write('"long":'+station[4]+',\n')
	f.write('"hood":"'+station[5]+'" \n },\n')
f.write("}")
f.close()		