import re,os,csv

lines = [re.sub('\r\n','',line) for line in open('../routes.csv')]
lines = [re.sub('\n','',line) for line in lines[1:]]
lines = [re.split(',',line) for line in lines]

print len(lines)
