import re,os,csv

lines = [re.sub("\r\n","",line) for line in open("../stations.csv")]
lines = [re.split(",",line) for line in lines[1:]]
#print lines
path ="stations.json"
os.remove(path)
f = open(path,"a")
f.write('{')
for route in lines:
	f.write('"'+route[0]+'": \n{')
	f.write('"fullname":"'+route[1]+'",\n')
	f.write('"short":"'+route[2]+'",\n')
	f.write('"lat":'+route[3]+',\n')
	f.write('"long":'+route[4]+',\n')
	f.write('"hood":"'+route[5]+'" \n },\n')
f.write("}")
f.close()		