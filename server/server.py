# TODO remove unneeded imports
import os
from datetime import datetime
import flask
from flask import (Flask, render_template, send_from_directory, request, jsonify,
                   make_response, current_app, redirect, g, redirect, url_for)

from flask_cors import CORS


#For Data
import gmplot
import numpy as np
import pandas as pd
from pathlib import Path
import json
import math
import copy


# TODO we may still need this depending on how Flask works with Firebase
from functools import wraps
from dotenv import load_dotenv
import traceback


# load_dotenv('../secret.env')
load_dotenv('../config.env')

GET = "GET"
POST = "POST"

startDemand = True
showDataType = 7 #0-6 are the days of the week, 7 is weekdays, 8 is weekend

monthlyDataStart = {}
monthlyDataEnd = {}

months2019Start = list(range(201901, 201913))
months2020Start = list(range(202001, 202013))
monthsStart = months2019Start + months2020Start

months2019End = list(range(201901, 201913))
months2020End = list(range(202001, 202013))
monthsEnd = months2019End + months2020End 

for month in monthsStart:
	data_folder = Path("../../data.nosync/{}.nosync/".format(month))
	jsonFileMonthEnd = data_folder / "{}-formated-end-data.json".format(month)
	jsonFileMonthStart = data_folder / "{}-formated-start-data.json".format(month)

	with open(jsonFileMonthStart) as f:
		data = json.load(f)
		monthlyDataStart[str(month)] = data
	
	with open(jsonFileMonthEnd) as f:
		data = json.load(f)
		monthlyDataEnd[str(month)] = data
    






app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
CORS(app)



firstMonth = {'dataType': 'weekday', 'data': monthlyDataStart[str(201901)], 'halfHour': 24, 'startDemand': startDemand}
firstMonth = json.dumps(firstMonth)
@app.route("/", methods=[GET, POST])
def map_page():
    print("CURRENT DATA")
    return render_template('map.html', heading=firstMonth)
    
@app.route('/getmethod/<jsdata>')
def get_javascript_data(jsdata):
    return jsdata


@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    jsdata = request.form['javascript_data']
    return jsdata

@app.route('/result', methods = ['POST'])
def result():
	requestedData = request.get_json(force = True)
	print("JUST PRESSED THE BUTTON with requested data: ", requestedData )

	selectedMonths = requestedData['selectedValues']
	numOfMonths = float(len(selectedMonths))
	first = True
	startDemand = requestedData['startDemand']
	monthlyData = {}
	if startDemand == True:
		monthlyData = monthlyDataStart
	else:
		monthlyData = monthlyDataEnd
	

	for monthEntry in selectedMonths:
		monthIndex = (monthEntry['value'])
		monthData = (monthlyData[monthIndex])
		if first:
			first = False
			dataToSend = copy.deepcopy(monthData)
			for station in dataToSend['stations']:
				for keyWeekdayN, weekday in station['weekdayRides'].items():
					floatWeekday = float(weekday[0])
					weekday[0] = floatWeekday/numOfMonths
					weekday[1] = float(weekday[1])/numOfMonths
				for keyWeekendN, weekend in station['weekendRides'].items():
					weekend[0] = float(weekend[0])/numOfMonths
					weekend[1] = float(weekend[1])/numOfMonths
				for keyDayN, day in station['daysOfWeekRides'].items():
					for hour in range(0,47):
						hourStr = str(hour)
						day[hourStr][0] = float(day[hourStr][0])/numOfMonths
						day[hourStr][1] = float(day[hourStr][1])/numOfMonths
		else:
			for index, station in enumerate(monthData['stations']):
				for keyWeekday, weekday in station['weekdayRides'].items():
					dataToSend['stations'][index]['weekdayRides'][keyWeekday][0] += float(weekday[0])/numOfMonths
					dataToSend['stations'][index]['weekdayRides'][keyWeekday][1] += float(weekday[1])/numOfMonths
				for keyWeekend, weekend in station['weekendRides'].items():
					dataToSend['stations'][index]['weekendRides'][keyWeekend][0] += float(weekend[0])/numOfMonths
					dataToSend['stations'][index]['weekendRides'][keyWeekend][1] += float(weekend[1])/numOfMonths

				for keyDay, day in station['daysOfWeekRides'].items():
					for hour in range(0,47):
						hourStr = str(hour)

						dataToSend['stations'][index]['daysOfWeekRides'][keyDay][hourStr][0] += float(day[hourStr][0])/numOfMonths
						dataToSend['stations'][index]['daysOfWeekRides'][keyDay][hourStr][1] += float(day[hourStr][1])/numOfMonths
	

	#print(monthlyData[201902])
	dataToSendFull = {'data': dataToSend, 'halfHour': requestedData['halfHour'], 'dataType': requestedData['dataType'], 'startDemand': startDemand  }

	dataToSend = json.dumps(dataToSendFull)

	#print("Sent data: ", dataToSend)
	return dataToSend

    # if (requestedData == "weekend"):
    #     print("END")
    #     print(weekendData)
    #     print(currentData)
    #     currentData['dataType'] = "weekend"
    #     currentData['data'] = weekendData
    #     currentData = json.dumps(currentData)
    #     return jsonify(currentData)
    # elif (requestedData == "weekday"):
    #     print("DAY")
    #     currentData['dataType'] = "weekday"
    #     currentData['data'] = weekdayData
    #     currentData = json.dumps(currentData)
    #     return jsonify(currentData)
    




if __name__ == "__main__":
    app.run(debug=True)
