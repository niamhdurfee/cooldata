import csv, os, re

stations = [re.split(',',line[:-2]) for line in open('../stations.csv')]
hoods = set()

for trip in stations[1:]:
	hoods.add(trip[-1])
newHoods = dict()
hoods = list(hoods)
print hoods
myColors = ['#FF41E6',"#FCB749", "#FBE792", "#233884", "#97D3C9", "#CA3A28", "#47C0BE", "#2DA9E1", "#7CB5D6", "#A01C40", "#B0D256", "#71BE45", "#387195", "#723390", "#DEC0CA", "#E8168B",'#13C498','#641DCC','#C014E2','#F39926','#FFE502','#D3ED15','#CA0202','#05E1FF','#003BFF']
i = 0

for hood in hoods:
	print hood+','+myColors[i]
	i+=1