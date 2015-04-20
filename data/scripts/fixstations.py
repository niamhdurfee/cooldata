import csv, re, os, simplejson, urllib,time

temp = open('../stations.csv').readlines()
temp = [re.sub('\r\n','',station) for station in temp]
temp = [re.sub('\n','',station) for station in temp]
temp = [re.split(',',station) for station in temp]
os.remove('stations.csv')
f = csv.writer(open('stations.csv','a'))
f.writerows(temp)